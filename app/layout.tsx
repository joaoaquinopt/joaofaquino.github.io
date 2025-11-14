import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Jornada à Maratona 2026',
  description: 'Acompanhe a jornada real até à Maratona 2026 — esforço, ritmo e consistência.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="bg-[#f5f6fa] text-[#0A2342] font-[Inter] min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <nav className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="text-lg font-semibold tracking-tight">
              🏃‍♂️ Road to Marathon 2026
            </div>
            <div className="space-x-6 text-sm font-medium">
              <Link href="/" className="hover:text-blue-600 transition">Jornada</Link>
              <Link href="/historico" className="hover:text-blue-600 transition">Histórico</Link>
              <Link href="/historia" className="hover:text-blue-600 transition">Minha História</Link>
              <Link href="/parcerias" className="hover:text-blue-600 transition">Parcerias</Link>
              <Link href="/redes" className="hover:text-blue-600 transition">Redes</Link>
            </div>
          </nav>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-200">
          © {new Date().getFullYear()} João Aquino — Road to Marathon 2026
        </footer>
      </body>
    </html>
  );
}
