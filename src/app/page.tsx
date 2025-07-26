'use client';
import { useState, useEffect } from 'react';
import { Blog } from './data/blogs';
import BlogCard from './components/BlogCard';

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]); // Blog listesi
  const [isLoading, setIsLoading] = useState(true); // Yükleniyor mu?
  const [error, setError] = useState<string | null>(null); // Hata var mı?

  const fetchBlogs = async () => {
    try {
      setIsLoading(true); // Yükleniyor durumunu başlat
      setError(null);
      
      const response = await fetch('/api/blogs'); // API çağır
      
      if (!response.ok) {
        throw new Error('Bloglar getirilemedi');
      }
      
      const data: Blog[] = await response.json(); // JSON çevir
      setBlogs(data);
      
    } catch (error) {
      console.error('API Hatası:', error);
      setError('Bloglar yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (isLoading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Teknoloji Blogu</h1>
        <p>Modern web teknolojileri hakkında yazılar</p>
      </header>
      
      <main className="main">
        {blogs.map((blog) => (
          <BlogCard 
            key={blog.id} 
            blog={blog} 
            onDelete={(deletedId) => {
              setBlogs(blogs.filter(blog => blog.id !== deletedId));
            }} 
          />
        ))}
      </main>
    </div>
  );
}