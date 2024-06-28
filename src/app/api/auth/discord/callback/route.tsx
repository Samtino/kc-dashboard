import { NextRequest, NextResponse } from 'next/server';
import { User } from '@prisma/client';
import { encrypt } from '@/src/services/encryption';
import { createUser, getUser, updateRoles, updateUser } from '@/src/services/user';

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

  try {
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL('/?error=TokenExchangeFailed', request.url));
    }

    const guildResponse = await fetch(
      `https://discord.com/api/users/@me/guilds/${process.env.GUILD_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const guildData = await guildResponse.json();

    // TODO: Add new page to join the KC Discord if user is not in the guild
    if (!guildData.joined_at) {
      return NextResponse.redirect(new URL('/?error=NotInGuild', request.url));
    }

    const avatarUrl =
      `https://cdn.discordapp.com/avatars/${guildData.user.id}/${guildData.avatar || guildData.user.avatar}.png` ||
      'https://cdn.discordapp.com/embed/avatars/0.png';

    const userData = {
      id: guildData.user.id,
      name: guildData.nick || guildData.user.global_name || guildData.username,
      avatar: avatarUrl,
    };

    let user = await getUser(userData.id);

    if (!user) {
      await createUser(userData.id, userData.name, userData.avatar);
    } else {
      await updateUser(userData.id, userData.name, userData.avatar);
    }

    await updateRoles(userData.id, guildData);

    user = await getUser(userData.id);

    const response = NextResponse.redirect(new URL('/dashboard', request.url));

    response.cookies.set('user', await encrypt(user as User), {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.error('Error during Discord OAuth callback:', error);
    return NextResponse.redirect(new URL('/?error=InternalError', request.url));
  }
}
