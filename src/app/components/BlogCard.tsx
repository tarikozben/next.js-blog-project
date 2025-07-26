// @ts-nocheck
import Link from 'next/link';
import { useState } from 'react';

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

interface BlogCardProps {
  blog: Blog;
  onDelete?: (id: number) => void;
}

export default function BlogCard({ blog, onDelete }: BlogCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link'i tetikleme
    e.stopPropagation();
    
    if (!confirm('Bu blogu silmek istediğinizden emin misiniz?')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: blog.id }),
      });

      if (response.ok) {
        onDelete && onDelete(blog.id);
      } else {
        alert('Blog silinemedi!');
      }
    } catch (error) {
      alert('Hata oluştu!');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="blog-card-container">
      <Link href={`/blog/${blog.id}`} className="blog-card-link">
        <div className="blog-card">
          <h2>{blog.title}</h2>
          <div className="blog-meta">
            <span className="author">Yazar: {blog.author}</span>
            <span className="date">{blog.date}</span>
          </div>
          <p className="content">{blog.content}</p>
          <div className="read-more">
            Devamını oku →
          </div>
        </div>
      </Link>
      
      <div className="blog-actions">
        <Link href={`/edit/${blog.id}`} className="edit-btn">
          ✏️ Düzenle
        </Link>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="delete-btn"
        >
          {isDeleting ? 'Siliniyor...' : '🗑️ Sil'}
        </button>
      </div>
    </div>
  );
}