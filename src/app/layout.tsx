import './globals.css'

export const metadata = {
  title: 'Teknoloji Blogu',
  description: 'Modern web teknolojileri hakkında yazılar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <header className="site-header">
          <div className="container">
            <div className="header-content">
              <h1 className="site-title">
                <a href="/">📱 Tech Blog</a>
              </h1>
              <nav className="site-nav">
                <a href="/">Ana Sayfa</a>
                <a href="/hakkimda">Hakkımda</a>
                <a href="/iletisim">İletişim</a>
                 <a href="/admin">Admin</a>
              </nav>
            </div>
          </div>
        </header>

        <main className="site-main">
          {children}
        </main>

        <footer className="site-footer">
          <div className="container">
            <p>&copy; 2024 Teknoloji Blogu. Tüm hakları saklıdır.</p>
            <p>Next.js ve React ile geliştirildi ⚛️</p>
          </div>
        </footer>
      </body>
    </html>
  )
}