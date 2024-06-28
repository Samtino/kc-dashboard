import { Modal } from '@mantine/core';

export function ExamModal({
  hidden,
  toggle,
  title,
  children,
}: {
  hidden: boolean;
  toggle: () => void;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <Modal title={title || ''} size="auto" padding="md" opened={hidden} onClose={toggle} centered>
      {children}
    </Modal>
  );
}
