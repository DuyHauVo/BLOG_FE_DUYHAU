import type { Metadata } from 'next';
import { AuthProvider } from '../context/authContext/AuthContext';
import { NotificationProvider } from '../context/layoutContext/Alerts';
import '../index.css';

export const metadata: Metadata = {
  title: 'Blog App',
  description: 'A Simple Blog Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </head>
      <body>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
