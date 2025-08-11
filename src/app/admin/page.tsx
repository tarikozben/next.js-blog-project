// @ts-nocheck
'use client';
import { useState } from 'react';

interface BlogFormData {
  title: string;
  content: string;
  author: string;
}

export default function AdminPage() {
  // Form state'leri
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    author: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

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
    
    // Validation
    if (!formData.title || !formData.content || !formData.author) {
      setMessage('Tüm alanları doldurun!');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Token'ı al
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Giriş yapmanız gerekli!');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        const response = await fetch('/api/blogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // ← YENİ: Token header'a ekle
          },
          body: JSON.stringify(formData), // ← Sadeleştir
        });

      if (response.ok) {
        setMessage('Blog başarıyla eklendi!');
        setFormData({ title: '', content: '', author: '' }); // Formu temizle
      } else {
        setMessage('Hata oluştu!');
      }
    } catch (error) {
      setMessage('Bağlantı hatası!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="admin-page">
        <h1>Yeni Blog Ekle</h1>
        
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
              placeholder="Yazar adını girin..."
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Blog İçeriği:</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Blog içeriğini yazın..."
              rows={6}
              disabled={isSubmitting}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ekleniyor...' : 'Blog Ekle'}
          </button>

          {message && (
            <div className={`message ${message.includes('başarıyla') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="admin-links">
          <a href="/">← Ana Sayfaya Dön</a>
        </div>
      </div>
    </div>
  );
}