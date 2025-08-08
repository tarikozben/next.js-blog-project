'use client';
import { useState, useEffect } from 'react';
import { Blog } from './models/Blog';
import BlogCard from './components/BlogCard';

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/blogs');
      
      if (!response.ok) {
        throw new Error('Bloglar getirilemedi');
      }
      
      const data: Blog[] = await response.json();
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
    return (
      <div className="container">
        <div className="loading">Bloglar yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Teknoloji Blogu</h1>
        <p>Modern web teknolojileri hakkında yazılar</p>
      </header>
      
      <main className="main">
        {blogs.length === 0 ? (
          <div className="no-blogs">
            <p>Henüz blog yazısı bulunmuyor.</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <BlogCard 
              key={blog._id} 
              blog={blog} 
              onDelete={(deletedId) => {
                setBlogs(blogs.filter(blog => blog._id !== deletedId));
              }} 
            />
          ))
        )}
      </main>
    </div>
  );
}