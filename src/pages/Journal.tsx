import { Link } from 'react-router-dom';

export default function Journal() {
  const articles = [
    {
      id: 1,
      title: "Sự Trở Lại Của Vật Liệu Thô Mộc Trong Không Gian Đương Đại",
      date: "15 Tháng 10, 2023",
      category: "Xu Hướng",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&fit=crop",
      excerpt: "Bê tông trần, gỗ tự nhiên và thép không gỉ không còn bị giấu đi mà trở thành ngôn ngữ chính của kiến trúc hiện đại, tôn vinh vẻ đẹp nguyên bản."
    },
    {
      id: 2,
      title: "Ánh Sáng: Vật Liệu Vô Hình Định Hình Cảm Xúc",
      date: "02 Tháng 11, 2023",
      category: "Góc Nhìn",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80&fit=crop",
      excerpt: "Cách chúng tôi sử dụng ánh sáng tự nhiên và nhân tạo để điêu khắc không gian, tạo ra những lớp lang cảm xúc khác nhau trong cùng một căn phòng."
    },
    {
      id: 3,
      title: "Kiến Trúc Bền Vững: Hơn Cả Một Xu Hướng",
      date: "28 Tháng 11, 2023",
      category: "Phát Triển Bền Vững",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&fit=crop",
      excerpt: "Tích hợp các giải pháp năng lượng xanh và vật liệu tái chế vào thiết kế cao cấp mà không làm giảm đi sự sang trọng và tinh tế."
    }
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-10">
        <div className="mb-20 text-center">
          <p className="text-[#d2b06f] font-medium tracking-[0.4em] uppercase text-2xl md:text-3xl mb-4">Góc Nhìn & Cảm Hứng</p>
          <h1 className="font-headline text-7xl md:text-8xl lg:text-9xl text-white tracking-tight">TẠP CHÍ</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {articles.map((article) => (
            <article key={article.id} className="group">
              <Link to={`/journal/${article.id}`} className="block overflow-hidden aspect-[4/3] mb-6">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[#d2b06f] text-base tracking-widest uppercase">{article.category}</span>
                <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                <span className="text-on-surface-variant text-base tracking-[0.1em] uppercase">{article.date}</span>
              </div>
              <Link to={`/journal/${article.id}`}>
                <h2 className="font-headline text-2xl md:text-3xl text-white mb-4 group-hover:text-[#d2b06f] transition-colors leading-snug">{article.title}</h2>
              </Link>
              <p className="text-on-surface-variant font-light text-xl leading-relaxed mb-6">
                {article.excerpt}
              </p>
              <Link to={`/journal/${article.id}`} className="text-[#d2b06f] tracking-widest uppercase text-base font-bold border-b border-[#d2b06f]/30 pb-1 hover:border-[#d2b06f] transition-all">
                Đọc Tiếp
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
