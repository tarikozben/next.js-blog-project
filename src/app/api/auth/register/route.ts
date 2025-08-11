import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';
import { UserDocument, CreateUserData } from '../../../models/User';
import bcrypt from 'bcryptjs';

// Yeni kullanıcı kaydı
export async function POST(request: Request) {
  try {
    const body: CreateUserData = await request.json();
    
    // Validation
    if (!body.email || !body.name || !body.password) {
      return NextResponse.json({ error: 'Tüm alanlar gerekli' }, { status: 400 });
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Geçersiz email formatı' }, { status: 400 });
    }

    // Şifre uzunluğu kontrolü
    if (body.password.length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalı' }, { status: 400 });
    }

    const db = await getDatabase();
    
    // Email zaten var mı kontrol et
    const existingUser = await db.collection('users').findOne({
      email: body.email.toLowerCase()
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Bu email adresi zaten kullanılıyor' }, { status: 409 });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(body.password, 12);
    
    const now = new Date();
    
    const newUser: UserDocument = {
      email: body.email.toLowerCase(),
      name: body.name.trim(),
      password: hashedPassword,
      role: 'user', // Default role
      createdAt: now,
      updatedAt: now
    };

    const result = await db.collection<UserDocument>('users').insertOne(newUser);

    if (!result.insertedId) {
      return NextResponse.json({ error: 'Kullanıcı kaydedilemedi' }, { status: 500 });
    }

    // Şifreyi response'dan çıkar
    const userResponse = {
      _id: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    console.log('Yeni kullanıcı kaydedildi:', userResponse);

    return NextResponse.json({ 
      message: 'Kullanıcı başarıyla kaydedildi', 
      user: userResponse 
    }, { status: 201 });

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ error: 'Kayıt işlemi sırasında hata oluştu' }, { status: 500 });
  }
}