export interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

// Global blog verisi - bellekte tutulacak
export let blogs: Blog[] = [
  {
    id: 1,
    title: "Next.js Öğrenmeye Başladım",
    content: "Bu blog yazısında Next.js ile ilgili öğrendiklerimi paylaşıyorum. React tabanlı bu framework çok güçlü! Server-side rendering, static generation gibi özellikler sunuyor.",
    author: "Ahmet",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "TypeScript Neden Kullanmalıyız?",
    content: "TypeScript, JavaScript'e tip güvenliği getiriyor. Bu sayede daha az hata yapıyoruz. Büyük projelerde özellikle çok faydalı.",
    author: "Ayşe",
    date: "2024-01-18"
  },
  {
    id: 3,
    title: "Web Geliştirmede Modern Yaklaşımlar",
    content: "Günümüzde web geliştirme çok hızlı değişiyor. Component tabanlı geliştirme artık standart. React, Vue, Angular gibi framework'ler bu yaklaşımı benimsiyor.",
    author: "Mehmet",
    date: "2024-01-20"
  }
];

// Yeni blog ekleme fonksiyonu
export function addBlog(blog: Omit<Blog, 'id'>) {
  const newBlog = {
    ...blog,
    id: blogs.length + 1
  };
  blogs.push(newBlog);
  return newBlog;
}

// ID'ye göre blog bulma fonksiyonu
export function getBlogById(id: number) {
  return blogs.find(blog => blog.id === id);
}

// Blog silme fonksiyonu
export function deleteBlog(id: number) {
  const index = blogs.findIndex(blog => blog.id === id);
  if (index > -1) {
    blogs.splice(index, 1);
    return true;
  }
  return false;
}

// Blog güncelleme fonksiyonu
export function updateBlog(id: number, updatedBlog: Omit<Blog, 'id'>) {
  const index = blogs.findIndex(blog => blog.id === id);
  if (index > -1) {
    blogs[index] = { ...updatedBlog, id };
    return blogs[index];
  }
  return null;
}