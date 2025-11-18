import './globals.css';

export const metadata = {
  title: 'Jornada à Maratona 2026',
  description: 'Acompanhe a jornada real até à Maratona 2026 — esforço, ritmo e consistência.',
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
