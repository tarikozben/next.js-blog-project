'use client';
import { useState } from 'react';
import Link from 'next/link';

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');

  // Form input değişikliklerini handle et
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setMessage('Email ve şifre gerekli!');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
        setMessageType('success');
        
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Ana sayfaya yönlendir
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessage(data.error || 'Giriş başarısız!');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Bağlantı hatası! Lütfen tekrar deneyin.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-page">
        <div className="auth-card">
          <h1>Giriş Yap</h1>
          <p className="auth-subtitle">Hesabınıza giriş yapın</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email adresinizi girin..."
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Şifre:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Şifrenizi girin..."
                disabled={isSubmitting}
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>

            {message && (
              <div className={`auth-message ${messageType}`}>
                {message}
              </div>
            )}
          </form>

          <div className="auth-links">
            <div className="register-prompt">
              <p>Hesabınız yok mu?</p>
              <Link href="/register" className="register-link">
                🆕 Hemen Kayıt Olun
              </Link>
            </div>
            <Link href="/">← Ana Sayfaya Dön</Link>
          </div>
        </div>
      </div>
    </div>
  );
}