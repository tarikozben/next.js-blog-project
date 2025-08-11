import { NextResponse } from 'next/server';
import { getDatabase } from '../../lib/mongodb';
import { getNextBlogId } from '../../lib/counter';
import { BlogDocument, CreateBlogData } from '../../models/Blog';
import { verifyToken } from '../../lib/auth';
import { ObjectId } from 'mongodb';


// Tüm blogları getir
export async function GET() {
  try {
    const db = await getDatabase();
    const blogs = await db
      .collection<BlogDocument>('blogs')
      .find({})
      .sort({ blogId: 1 }) // En eski bloglar önce (1,2,3,4...)
      .toArray();

    // ObjectId'leri string'e çevir
    const blogsWithStringId = blogs.map(blog => ({
      ...blog,
      _id: blog._id!.toString()
    }));

    return NextResponse.json(blogsWithStringId);
  } catch (error) {
    console.error('Blogs GET Error:', error);
    return NextResponse.json({ error: 'Bloglar getirilemedi' }, { status: 500 });
  }
}

// Yeni blog ekle
// Yeni blog ekle
export async function POST(request: Request) {
  try {
    // Token kontrolü
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekli' }, { status: 401 });
    }

    // Token'ı doğrula ve user bilgilerini al
    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
    }

    const body: CreateBlogData = await request.json();
    
    if (!body.title || !body.content || !body.author) {
      return NextResponse.json({ error: 'Tüm alanlar gerekli' }, { status: 400 });
    }

    const db = await getDatabase();
    
    // Auto-increment ID al
    const blogId = await getNextBlogId();
    
    const now = new Date();
    
    const newBlog: BlogDocument = {
      blogId: blogId,
      title: body.title.trim(),
      content: body.content.trim(),
      author: body.author.trim(),
      authorId: new ObjectId(tokenPayload.userId), // ← YENİ: Token'dan alınan user ID
      date: now.toLocaleDateString('tr-TR'),
      createdAt: now,
      updatedAt: now
    };

    const result = await db.collection<BlogDocument>('blogs').insertOne(newBlog);

    if (!result.insertedId) {
      return NextResponse.json({ error: 'Blog eklenemedi' }, { status: 500 });
    }

    const createdBlog = {
      ...newBlog,
      _id: result.insertedId.toString(),
      authorId: newBlog.authorId.toString() // ObjectId'yi string'e çevir
    };

    console.log('Yeni blog eklendi:', createdBlog);

    return NextResponse.json({ 
      message: 'Blog başarıyla eklendi', 
      blog: createdBlog 
    }, { status: 201 });

  } catch (error) {
    console.error('Blog POST Error:', error);
    return NextResponse.json({ error: 'Blog eklenirken hata oluştu' }, { status: 500 });
  }
}

// Blog sil
// Blog sil
export async function DELETE(request: Request) {
  try {
    // Token kontrolü
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekli' }, { status: 401 });
    }

    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Blog ID gerekli' }, { status: 400 });
    }

    const blogId = parseInt(id);
    
    if (isNaN(blogId)) {
      return NextResponse.json({ error: 'Geçersiz blog ID' }, { status: 400 });
    }

    const db = await getDatabase();
    
    // Blogu bul
    const existingBlog = await db.collection<BlogDocument>('blogs').findOne({
      blogId: blogId
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog bulunamadı' }, { status: 404 });
    }

    // Yetki kontrolü: Sadece admin veya blog sahibi silebilir
    if (tokenPayload.role !== 'admin' && existingBlog.authorId.toString() !== tokenPayload.userId) {
      return NextResponse.json({ error: 'Bu blogu silme yetkiniz yok' }, { status: 403 });
    }

    const result = await db.collection<BlogDocument>('blogs').deleteOne({
      blogId: blogId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blog silinemedi' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog başarıyla silindi' });

  } catch (error) {
    console.error('Blog DELETE Error:', error);
    return NextResponse.json({ error: 'Blog silinirken hata oluştu' }, { status: 500 });
  }
}

// Blog güncelle
// Blog güncelle
// Blog güncelle
export async function PUT(request: Request) {
  try {
    // Token kontrolü
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekli' }, { status: 401 });
    }

    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
    }

    const body = await request.json();
    const { blogId, title, content, author } = body;
    
    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID gerekli' }, { status: 400 });
    }

    if (!title || !content || !author) {
      return NextResponse.json({ error: 'Tüm alanlar gerekli' }, { status: 400 });
    }

    const db = await getDatabase();
    
    // Blogu bul
    const existingBlog = await db.collection<BlogDocument>('blogs').findOne({
      blogId: parseInt(blogId)
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog bulunamadı' }, { status: 404 });
    }

    // Yetki kontrolü: Sadece admin veya blog sahibi güncelleyebilir
    if (tokenPayload.role !== 'admin' && existingBlog.authorId.toString() !== tokenPayload.userId) {
      return NextResponse.json({ error: 'Bu blogu düzenleme yetkiniz yok' }, { status: 403 });
    }

    const result = await db.collection<BlogDocument>('blogs').updateOne(
      { blogId: parseInt(blogId) },
      { 
        $set: { 
          title: title.trim(),
          content: content.trim(),
          author: author.trim(),
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Blog bulunamadı' }, { status: 404 });
    }

    const updatedBlog = await db.collection<BlogDocument>('blogs').findOne({
      blogId: parseInt(blogId)
    });

    const blogWithStringId = updatedBlog ? {
      ...updatedBlog,
      _id: updatedBlog._id!.toString(),
      authorId: updatedBlog.authorId.toString()
    } : null;

    return NextResponse.json({ 
      message: 'Blog başarıyla güncellendi', 
      blog: blogWithStringId 
    });

  } catch (error) {
    console.error('Blog PUT Error:', error);
    return NextResponse.json({ error: 'Blog güncellenirken hata oluştu' }, { status: 500 });
  }
}