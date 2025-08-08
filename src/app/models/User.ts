import { ObjectId } from 'mongodb';

// Frontend için kullanılacak User interface (string ID ile)
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Database için kullanılacak User interface (ObjectId ile)
export interface UserDocument {
  _id?: ObjectId;
  email: string;
  name: string;
  password: string; // Hashed password
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// User oluştururken kullanılacak interface
export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

// Login için kullanılacak interface
export interface LoginData {
  email: string;
  password: string;
}