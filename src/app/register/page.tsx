'use client';
import { useState } from 'react';
import Link from 'next/link';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.name || !formData.email || !formData.password) {
      setMessage('Tüm alanları doldurun!');
      setMessageType('error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Şifreler eşleşmiyor!');
      setMessageType('error');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Şifre en az 6 karakter olmalı!');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setMessageType('success');
        
        // Formu temizle
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // 2 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setMessage(data.error || 'Kayıt işlemi başarısız!');
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
          <h1>Kayıt Ol</h1>
          <p className="auth-subtitle">Yeni hesap oluşturun</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Ad Soyad:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ad soyadınızı girin..."
                disabled={isSubmitting}
                required
              />
            </div>

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

            <div className="form-group">
              <label htmlFor="confirmPassword">Şifre Tekrar:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Şifrenizi tekrar girin..."
                disabled={isSubmitting}
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>

            {message && (
              <div className={`auth-message ${messageType}`}>
                {message}
              </div>
            )}
          </form>

          <div className="auth-links">
            <p>Zaten hesabınız var mı? <Link href="/login">Giriş yapın</Link></p>
            <Link href="/">← Ana Sayfaya Dön</Link>
          </div>
        </div>
      </div>
    </div>
  );
}