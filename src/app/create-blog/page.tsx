'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlogFormData {
  title: string;
  content: string;
  author: string;
}

export default function CreateBlog() {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    author: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Kullanıcı kontrolü
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setIsLoggedIn(true);
    setFormData(prev => ({
      ...prev,
      author: parsedUser.name
    }));
    setIsLoading(false);
  }, []);

  // Form input değişikliklerini handle et
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setMessage('Başlık ve içerik gerekli!');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Blog başarıyla eklendi!');
        setFormData({
          title: '',
          content: '',
          author: user?.name || ''
        });
        
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setMessage(data.error || 'Blog eklenemedi!');
      }
    } catch (error) {
      setMessage('Bağlantı hatası!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  // Giriş yapmamış kullanıcı için auth kutucuğu
  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="auth-required-page">
          <div className="auth-required-card">
            <div className="auth-icon">✍️</div>
            <h1>Blog Yazmak İstiyorsunuz?</h1>
            <p className="auth-description">
              Düşüncelerinizi paylaşmak ve toplulukla buluşturmak için önce hesap oluşturmanız gerekiyor.
            </p>
            
            <div className="auth-actions">
              <Link href="/login" className="auth-action-btn login-btn">
                🔐 Giriş Yap
              </Link>
              <Link href="/register" className="auth-action-btn register-btn">
                🆕 Hesap Oluştur
              </Link>
            </div>
            
            <div className="auth-note">
              <p>Hesabınız var mı? <Link href="/login">Hemen giriş yapın</Link></p>
              <p>Yeni misiniz? <Link href="/register">Ücretsiz kayıt olun</Link></p>
            </div>
            
            <div className="back-link">
              <Link href="/">← Ana Sayfaya Dön</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Giriş yapmış kullanıcı için blog formu
  return (
    <div className="container">
      <div className="admin-page">
        <h1>Yeni Blog Yaz</h1>
        <p className="auth-subtitle">Düşüncelerinizi paylaşın</p>
        
        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label htmlFor="title">Blog Başlığı:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Blog başlığını girin..."
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Yazar:</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              disabled={true}
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Blog İçeriği:</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Blog içeriğinizi yazın..."
              rows={8}
              disabled={isSubmitting}
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ekleniyor...' : 'Blog Yayınla'}
          </button>

          {message && (
            <div className={`message ${message.includes('başarıyla') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="auth-links">
          <Link href="/">← Ana Sayfaya Dön</Link>
        </div>
      </div>
    </div>
  );
}