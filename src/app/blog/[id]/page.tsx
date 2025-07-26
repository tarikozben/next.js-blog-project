'use client';
import { useState, useEffect, use } from 'react';
import { Blog } from '../../data/blogs';
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
        throw new Error('Blog bulunamadı');
      }

      const data: Blog = await response.json();
      setBlog(data);

    } catch (error) {
      console.error('API Hatası:', error);
      setError('Blog yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [resolvedParams.id]);

  if (isLoading) {
    return <div className="loading">Blog yükleniyor...</div>;
  }

  if (error || !blog) {
    return <div className="error">{error || 'Blog bulunamadı'}</div>;
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