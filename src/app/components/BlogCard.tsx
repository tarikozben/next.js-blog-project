import Link from 'next/link';
import { useState } from 'react';
import { Blog } from '../models/Blog';
import ConfirmModal from './ConfirmModal';
interface BlogCardProps {
  blog: Blog;
  onDelete?: (id: string) => void;
}

export default function BlogCard({ blog, onDelete }: BlogCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setShowModal(true);  // Modal'ı aç
};

// Yeni fonksiyon ekle:
const confirmDelete = async () => {
  setShowModal(false);
  setIsDeleting(true);
  
  try {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Giriş yapmanız gerekli!');
      window.location.href = '/login';
      return;
    }

    const response = await fetch('/api/blogs', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ← YENİ: Token ekle
      },
      body: JSON.stringify({ id: blog.blogId }),
    });

    if (response.ok) {
      onDelete && onDelete(blog._id);
    } else {
      const errorData = await response.json();
      alert(`Hata: ${errorData.error || 'Blog silinemedi!'}`);
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert('Bağlantı hatası oluştu!');
  } finally {
    setIsDeleting(false);
  }
};

  return (
    <div className="blog-card-container">
      <Link href={`/blog/${blog.blogId}`} className="blog-card-link">
        <div className="blog-card">
          <h2>{blog.title}</h2>
          <div className="blog-meta">
            <span className="author">Yazar: {blog.author}</span>
            <span className="date">{blog.date}</span>
          </div>
          <p className="content">
            {blog.content.length > 150 
              ? blog.content.substring(0, 150) + '...' 
              : blog.content
            }
          </p>
          <div className="read-more">
            Devamını oku →
          </div>
        </div>
      </Link>
      
      {(() => {
  // User bilgilerini al
  const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userData ? JSON.parse(userData) : null;
  
  // Sadece admin veya blog sahibi düzenle/sil butonlarını görebilir
  const canEdit = user && (user.role === 'admin' || user._id === blog.authorId);
  
  return canEdit ? (
    <div className="blog-actions">
      <Link href={`/edit/${blog.blogId}`} className="edit-btn">
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
  ) : null;
})()}
            <ConfirmModal
        isOpen={showModal}
        title="Blog Sil"
        message="Bu blogu silmek istediğinizden emin misiniz?"
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}

