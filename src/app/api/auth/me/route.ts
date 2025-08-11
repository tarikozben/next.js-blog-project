import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';
import { UserDocument } from '../../../models/User';
import { getUserFromRequest } from '../../../lib/auth';
import { ObjectId } from 'mongodb';

// Kullanıcı bilgilerini getir
export async function GET(request: NextRequest) {
  try {
    // Token'dan user bilgilerini al
    const tokenPayload = getUserFromRequest(request);
    
    if (!tokenPayload) {
      return NextResponse.json({ error: 'Token geçersiz veya bulunamadı' }, { status: 401 });
    }

    const db = await getDatabase();
    
    // Kullanıcıyı database'den al (güncel bilgiler için)
    const user = await db.collection<UserDocument>('users').findOne({
      _id: new ObjectId(tokenPayload.userId)
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Şifreyi çıkararak kullanıcı bilgilerini döndür
    const userResponse = {
      _id: user._id!.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({ 
      user: userResponse 
    }, { status: 200 });

  } catch (error) {
    console.error('Get User Error:', error);
    return NextResponse.json({ error: 'Kullanıcı bilgileri alınırken hata oluştu' }, { status: 500 });
  }
}