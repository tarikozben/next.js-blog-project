import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';
import { UserDocument, LoginData } from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Kullanıcı giriş
export async function POST(request: Request) {
  try {
    const body: LoginData = await request.json();
    
    // Validation
    if (!body.email || !body.password) {
      return NextResponse.json({ error: 'Email ve şifre gerekli' }, { status: 400 });
    }

    const db = await getDatabase();
    
    // Kullanıcıyı bul
    const user = await db.collection<UserDocument>('users').findOne({
      email: body.email.toLowerCase()
    });

    if (!user) {
      return NextResponse.json({ error: 'Geçersiz email veya şifre' }, { status: 401 });
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Geçersiz email veya şifre' }, { status: 401 });
    }

    // JWT token oluştur
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable tanımlanmamış');
    }

    const token = jwt.sign(
      { 
        userId: user._id!.toString(),
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // 7 gün geçerli
    );

    // Kullanıcı bilgileri (şifreyi çıkar)
    const userResponse = {
      _id: user._id!.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    };

    console.log('Kullanıcı giriş yaptı:', userResponse.email);

    return NextResponse.json({ 
      message: 'Giriş başarılı',
      token: token,
      user: userResponse 
    }, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Giriş işlemi sırasında hata oluştu' }, { status: 500 });
  }
}