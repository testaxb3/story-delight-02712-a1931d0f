import { memo } from 'react';

export const AuthBackground = memo(function AuthBackground() {
  return (
    <div className="fixed inset-0" style={{ background: '#0D0D0D' }} />
  );
});
