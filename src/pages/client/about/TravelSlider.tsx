import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
const img: { img: string; alt?: string }[] = [
  {
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    alt: "Beautiful beach at sunset",
  },
  {
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    alt: "Snowy mountain landscape",
  },
  {
    img: "https://preview.redd.it/the-temple-bar-one-of-dublins-most-celebrated-landmarks-v0-mt5qw913yymb1.jpg?width=640&crop=smart&auto=webp&s=6c61f66a227687b663d88be6e30587b2faf31069",
    alt: "Coffee shop in old town",
  },
  {
    img: "https://images.unsplash.com/photo-1518684079-3c830dcef090",
    alt: "Trail through the forest",
  },
  {
    img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba",
    alt: "Boat on turquoise water",
  },
];

export default function TravelSlider() {
  return (
    <div className="w-full max-w-5xl mx-auto p-5">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
      >
        {img.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              src={item.img}
              alt={item.alt || `travel-image-${index}`}
              className="w-full h-60 object-cover rounded-lg shadow-md"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
