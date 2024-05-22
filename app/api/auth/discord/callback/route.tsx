import { NextRequest, NextResponse } from 'next/server';
import { encrypt } from '@/app/services/encryption';
import { User } from '@/app/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=NoCodeProvided', request.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  const params = new URLSearchParams();
  params.append('client_id', clientId || '');
  params.append('client_secret', clientSecret || '');
  params.append('code', code.toString());
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', redirectUri || '');

  const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.access_token) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));

    const guildResponse = await fetch(
      `https://discord.com/api/users/@me/guilds/${process.env.GUILD_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );
    const guildData = await guildResponse.json();

    // TODO: take to a page to join the KarmaCommunity discord server
    if (guildData.joined_at === undefined) {
      return NextResponse.redirect(new URL('/?error=NotInGuild', request.url));
    }

    const avatarUrl = `https://cdn.discordapp.com/avatars/${guildData.user.id}/${guildData.avatar || guildData.user.avatar}.png`;
    const user: User = {
      id: guildData.user.id,
      name: guildData.nick || guildData.user.global_name || guildData.username,
      avatar: avatarUrl,
      isAdmin: false,
      isCS: false,
    };

    guildData.roles.forEach((role: string) => {
      if (role === process.env.CS_ROLE_ID) {
        user.isCS = true;
        user.isAdmin = true;
      } else if (role === process.env.ADMIN_ROLE_ID) {
        user.isAdmin = true;
      }
    });

    const encryptedData = await encrypt(user);
    response.cookies.set('user', JSON.stringify(encryptedData), {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });

    return response;
  }

  return NextResponse.redirect(new URL('/?error=TokenExchangeFailed', request.url));
}