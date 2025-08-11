'use client';
import { useEffect, useState } from 'react';
import './globals.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sayfa yüklendiğinde user durumunu kontrol et
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <html lang="tr">
        <body>
          <div className="loading">Yükleniyor...</div>
        </body>
      </html>
    );
  }

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
                
    {/* Her kullanıcı blog yazabilir */}
    <a href="/create-blog" className="blog-write-btn">✍️ Blog Yaz</a>

   {user ? (
  <div className="user-menu">
    <span className="user-greeting">Merhaba, {user.name.split(' ')[0]}!</span>
    
    <button onClick={handleLogout} className="logout-btn">
      Çıkış
    </button>
  </div>
) : (
                  // Kullanıcı giriş yapmamışsa
                  <div className="auth-menu">
                    <a href="/login">Giriş</a>
                    <a href="/register">Kayıt</a>
                  </div>
                )}
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