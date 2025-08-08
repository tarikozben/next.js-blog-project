'use client';
import { useState, useEffect, use } from 'react';
import { Blog } from '../../models/Blog';
import Link from 'next/link';

interface BlogDetailProps {
  params: Promise<{ id: string }>;
}

export default function BlogDetail({ params }: BlogDetailProps) {
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/blogs/${resolvedParams.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Blog bulunamadı');
        } else if (response.status === 400) {
          throw new Error('Geçersiz blog ID');
        }
        throw new Error('Blog yüklenemedi');
      }

      const data: Blog = await response.json();
      setBlog(data);

    } catch (error) {
      console.error('API Hatası:', error);
      setError(error instanceof Error ? error.message : 'Blog yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Blog yükleniyor...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container">
        <div className="error">{error || 'Blog bulunamadı'}</div>
        <div className="admin-links">
          <Link href="/">← Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="blog-detail">
        <Link href="/" className="back-link">
          ← Ana Sayfaya Dön
        </Link>
        
        <article className="blog-article">
          <header className="blog-header">
            <h1>{blog.title}</h1>
            <div className="blog-meta">
              <span className="author">Yazar: {blog.author}</span>
              <span className="date">{blog.date}</span>
            </div>
          </header>
          
          <div className="blog-content">
            <p>{blog.content}</p>
          </div>
        </article>
      </div>
    </div>
  );
}