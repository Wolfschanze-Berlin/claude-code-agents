import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sports News Platform',
  description: 'Latest sports news and updates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}