import { memo } from 'react';

export const AuthBackground = memo(function AuthBackground() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-black" />
  );
});
