'use client';
import { useState, useEffect, use } from 'react';
import { Blog } from '../../models/Blog';
import Link from 'next/link';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: EditPageProps) {
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Blog verilerini yükle
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${resolvedParams.id}`);
        if (response.ok) {
          const blogData = await response.json();
          setBlog(blogData);
          setFormData({
            title: blogData.title,
            content: blogData.content,
            author: blogData.author
          });
        }
      } catch (error) {
        console.error('Blog yüklenemedi:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [resolvedParams.id]);

  // Form değişikliklerini handle et
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
    
    if (!formData.title || !formData.content || !formData.author) {
      setMessage('Tüm alanları doldurun!');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
  // Token kontrolü
  const token = localStorage.getItem('token');
  if (!token) {
    setMessage('Giriş yapmanız gerekli!');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
    return;
  }

  const response = await fetch('/api/blogs', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // ← YENİ: Token ekle
    },
    body: JSON.stringify({
      blogId: resolvedParams.id,
      ...formData,
      date: blog?.date || new Date().toLocaleDateString()
    }),
  });

      if (response.ok) {
        setMessage('Blog başarıyla güncellendi!');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessage('Hata oluştu!');
      }
    } catch (error) {
      setMessage('Bağlantı hatası!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Blog yükleniyor...</div>;
  }

  if (!blog) {
    return <div className="error">Blog bulunamadı</div>;
  }

  return (
    <div className="container">
      <div className="admin-page">
        <h1>Blog Düzenle</h1>
        
        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label htmlFor="title">Blog Başlığı:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
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
              rows={8}
              disabled={isSubmitting}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Güncelleniyor...' : 'Güncelle'}
          </button>

          {message && (
            <div className={`message ${message.includes('başarıyla') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="admin-links">
          <Link href="/">← Ana Sayfaya Dön</Link>
        </div>
      </div>
    </div>
  );
}