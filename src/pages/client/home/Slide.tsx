import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

function Slide() {
  const img: {
    img: string;
    alt?: string;
    title: string;
    date: string;
    desc: string;
  }[] = [
    {
      img: "https://reviewvilla.vn/wp-content/uploads/2023/04/dia-diem-du-lich-lang-son-2.jpg",
      alt: "Beautiful beach at sunset",
      title: "Street Style Muse Effortless Looks on the Sidewalk",
      date: "05 Dec 2024",
      desc: "Consulted perpetual of pronounce me delivered. Too months nay end change relied who beauty wishes matter. Shew of john real park so rest we...",
    },
    {
      img: "https://img.360dalat.com/resize/730x-/2023/02/20/khu-du-lich-thung-lung-tinh-yeu-1-1188.jpg",
      alt: "Snowy mountain landscape",
      title: "Adventure in the Alps: Breathtaking Snowy Peaks",
      date: "20 Jan 2025",
      desc: "Experience the thrill of snowy adventures and cozy mountain escapes. From skiing to serenity, the Alps have it all...",
    },
    {
      img: "https://nld.mediacdn.vn/2020/9/20/ba-na-mo-cua-tro-lai-10-16005678342571877068250.jpg",
      alt: "Snowy mountain landscape",
      title: "Adventure in the Alps: Breathtaking Snowy Peaks",
      date: "20 Jan 2025",
      desc: "Experience the thrill of snowy adventures and cozy mountain escapes. From skiing to serenity, the Alps have it all...",
    },
    {
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      alt: "Snowy mountain landscape",
      title: "Adventure in the Alps: Breathtaking Snowy Peaks",
      date: "20 Jan 2025",
      desc: "Experience the thrill of snowy adventures and cozy mountain escapes. From skiing to serenity, the Alps have it all...",
    },
    {
      img: "https://ototruongdung.vn/public/upload/images/thumb_baiviet/du-lich-can-tho-12-dia-diem-khu-du-lich-noi-tieng-531668396781.jpg",
      alt: "Snowy mountain landscape",
      title: "Adventure in the Alps: Breathtaking Snowy Peaks",
      date: "20 Jan 2025",
      desc: "Experience the thrill of snowy adventures and cozy mountain escapes. From skiing to serenity, the Alps have it all...",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
      >
        {img.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[500px] rounded-xl overflow-hidden group">
              {/* Background Image */}
              <img
                src={item.img}
                alt={item.alt}
                className="w-full h-full object-cover transform duration-500 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Caption Content */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-5 z-10">
                <p className="text-sm mb-2">{item.date}</p>
                <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">
                  {item.title}
                </h2>
                <p className="text-sm max-w-2xl mb-6">{item.desc}</p>
                <button className="bg-white text-black px-5 py-2 rounded-full font-medium hover:bg-pink-600 hover:text-white transition">
                  READ MORE
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Slide;
