import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const ads = [
  {
    img: "https://www.vinaprint.vn/wp-content/uploads/2023/01/poster-quang-cao-san-pham-65.jpg",
    title: "Summer Sale",
    description: "Giảm 40% toàn bộ áo thun cho mùa hè!",
    button: "Mua ngay",
  },
  {
    img: "https://i.pinimg.com/originals/a0/07/43/a0074328f3d3aba9fe15c9ec8250cdf6.jpg",
    title: "Laptop Deal",
    description: "Ưu đãi cực sốc cho học sinh – laptop từ 4tr9!",
    button: "Xem ngay",
  },
  {
    img: "https://cdn.s99.vn/ss1/prod/product/b196f0c05f02b6ab8b5b242b6a93b327.jpg",
    title: "Back to School",
    description: "Tặng balo khi mua bất kỳ sản phẩm học tập",
    button: "Khám phá",
  },
  {
    img: "https://cdn.s99.vn/ss2/prod/product/2ba31dd95555d6162f8eaac3278d12e7_1699264657.jpg?at=1701811573",
    title: "Đồng hồ thời trang",
    description: "Đồng hồ đeo tay giảm 20% - chỉ hôm nay!",
    button: "Xem bộ sưu tập",
  },
  {
    img: "https://intemnhandecal.net/wp-content/uploads/2019/07/cac-mau-in-poster-quang-cao.jpg",
    title: "Giảm giá đồ điện tử",
    description: "Loa bluetooth, tai nghe, sạc dự phòng giảm đến 50%",
    button: "Mua ngay",
  },
  {
    img: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1600&q=80",
    title: "Du lịch hè",
    description: "Đặt tour du lịch sớm - nhận ưu đãi 30%",
    button: "Đặt tour",
  },
];

function SlidePro() {
  return (
    <div className="w-full max-w-7xl mx-auto p-5">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
      >
        {ads.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-96 rounded-xl overflow-hidden group shadow-lg">
              <img
                src={item.img}
                alt={item.title || `image-${index}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-15 z-10" />

              <div className="absolute bottom-0 left-0 w-full px-5 py-4 text-white z-20 transition-all duration-500 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-gradient-to-t from-black/70 to-transparent">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="text-sm mt-1">{item.description}</p>
                <button className="mt-2 px-4 py-1 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-200 transition">
                  {item.button}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default SlidePro;
