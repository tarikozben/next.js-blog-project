import { ObjectId } from 'mongodb';

// Frontend için kullanılacak Blog interface (string ID ile)
export interface Blog {
  _id: string;
  blogId: number;
  title: string;
  content: string;
  author: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

// Database için kullanılacak Blog interface (ObjectId ile)
export interface BlogDocument {
  _id?: ObjectId;
  blogId: number;
  title: string;
  content: string;
  author: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

// Blog oluştururken kullanılacak interface
export interface CreateBlogData {
  title: string;
  content: string;
  author: string;
}