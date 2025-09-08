import './globals.css';
import Providers from './providers';

export const metadata = { title: 'Chat App', description: 'Nest GraphQL + Next.js' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
