// @ts-nocheck
import { NextResponse } from 'next/server';
import { getBlogById } from '../../../data/blogs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogId = parseInt(id);
    
    const blog = getBlogById(blogId);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Hata oluştu' },
      { status: 500 }
    );
  }
}