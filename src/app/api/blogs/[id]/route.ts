import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';
import { BlogDocument } from '../../../models/Blog';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const blogId = parseInt(id);

      if (isNaN(blogId)) {
      return NextResponse.json(
        { error: 'Geçersiz blog ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const blog = await db.collection<BlogDocument>('blogs').findOne({
      blogId: blogId
    });
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog bulunamadı' },
        { status: 404 }
      );
    }
    
    // ObjectId'yi string'e çevir
    const blogWithStringId = {
      ...blog,
      _id: blog._id!.toString()
    };
    
    return NextResponse.json(blogWithStringId);
    
  } catch (error) {
    console.error('Blog GET Error:', error);
    return NextResponse.json(
      { error: 'Blog getirilemedi' },
      { status: 500 }
    );
  }
}