'use client';

import { ReactNode } from 'react';
// Pass-through wrapper to keep page APIs stable while NavigationWrapper handles nav

interface PostcraftLayoutProps {
  children: ReactNode;
}

export default function PostcraftLayout({ children }: PostcraftLayoutProps) {
  return (
    <div>{children}</div>
  );
}
