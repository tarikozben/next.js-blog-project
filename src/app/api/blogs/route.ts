import { NextResponse } from 'next/server';
import { blogs, addBlog, deleteBlog, updateBlog, Blog } from '../../data/blogs';

// Tüm blogları getir (GET)
export async function GET() {
  try {
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}

// Yeni blog ekle (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validation - tüm alanlar dolu mu?
    if (!body.title || !body.content || !body.author) {
      return NextResponse.json({ error: 'Tüm alanlar gerekli' }, { status: 400 });
    }

    const newBlog = addBlog({
      title: body.title,
      content: body.content,
      author: body.author,
      date: new Date().toLocaleDateString()
    });

    console.log('Yeni blog eklendi:', newBlog);

    return NextResponse.json({ message: 'Blog eklendi', blog: newBlog }, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}

// Blog sil (DELETE)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    const success = deleteBlog(parseInt(id));
    
    if (success) {
      return NextResponse.json({ message: 'Blog silindi' });
    } else {
      return NextResponse.json({ error: 'Blog bulunamadı' }, { status: 404 });
    }
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}

// Blog güncelle (PUT)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...blogData } = body;
    
    if (!blogData.title || !blogData.content || !blogData.author) {
      return NextResponse.json({ error: 'Tüm alanlar gerekli' }, { status: 400 });
    }

    const updatedBlog = updateBlog(parseInt(id), blogData);
    
    if (updatedBlog) {
      return NextResponse.json({ message: 'Blog güncellendi', blog: updatedBlog });
    } else {
      return NextResponse.json({ error: 'Blog bulunamadı' }, { status: 404 });
    }
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}