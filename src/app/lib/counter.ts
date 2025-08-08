import { getDatabase } from './mongodb';

// Sonraki blog ID'sini al (auto-increment)
export async function getNextBlogId(): Promise<number> {
  const db = await getDatabase();
  
  // Counters collection'ında blog_id counter'ını güncelle
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: 'blog_id' },
    { $inc: { sequence_value: 1 } },
    { 
      upsert: true,  // Yoksa oluştur
      returnDocument: 'after'  // Güncellenmiş değeri döndür
    }
  );
  
  return result?.sequence_value || 1;
}