import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import { menu_client } from "../../../utills/contants";
import TravelSlider from "./TravelSlider";

function About() {
  type TravelImage = {
    img: string;
    alt?: string; // tùy chọn: mô tả ảnh
  };
  const img: TravelImage[] = [
    {
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // Biển xanh
      alt: "Beautiful beach at sunset",
    },
    {
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // Núi tuyết
      alt: "Snowy mountain landscape",
    },
    {
      img: "https://preview.redd.it/the-temple-bar-one-of-dublins-most-celebrated-landmarks-v0-mt5qw913yymb1.jpg?width=640&crop=smart&auto=webp&s=6c61f66a227687b663d88be6e30587b2faf31069", // Cà phê phố cổ
      alt: "Coffee shop in old town",
    },
    {
      img: "https://images.unsplash.com/photo-1518684079-3c830dcef090", // Đường mòn leo núi
      alt: "Trail through the forest",
    },
    {
      img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba", // Du lịch thuyền
      alt: "Boat on turquoise water",
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl text-center pt-10">About</h1>
      <img
        className="w-2/3 h-auto mx-auto px-5 py-10"
        src="https://img.freepik.com/premium-photo/portrait-person-using-his-laptop-room-with-desk_1082068-35568.jpg"
        alt=""
      />
      <h1 className="font-serif font-bold text-3xl ml-56 pt-5">ABOUT ME</h1>
      <div className="w-[950px] mx-auto py-10">
        <div className="w-[700px] mx-auto">
          <p>
            Hello and welcome! I'm Duy Hau, the creator and voice behind this
            blog. I started this platform to share my thoughts, experiences, and
            discoveries in the world of web development, design,
            lifestyle,..v.v.
          </p>
          <p className="py-3">
            Over the years, I’ve had the chance to work with amazing people,
            explore new ideas, and grow a vibrant community of readers. Whether
            it’s a detailed tutorial, an honest review, or a personal story, I
            believe in delivering value and connecting with readers in a real,
            human way.
          </p>
          <p className="">
            When I’m not writing or managing this blog, I enjoy writing code,
            taking photos, exploring coffee shops, designing interfaces, and
            learning new technologies. I also spend time collaborating on
            creative projects, learning new skills, and staying updated on the
            latest trends in love sports.
          </p>
        </div>
        <blockquote className="border-l-4 border-gray-400 text-3xl pl-4 italic text-gray-700 my-6 py-10">
          “Writing isn’t just about sharing what you know — it’s about
          connecting with people through honesty, creativity, and a genuine
          voice.”
        </blockquote>
        <div className="w-[700px] mx-auto">
          <p>
            This blog is more than just a collection of posts — it’s a growing
            journey. My goal is to keep it helpful, inspiring, and authentic. If
            something here sparks your interest or helps you, then I’ve done my
            job.
          </p>
          <p className="py-3">
            Have a question, collaboration idea, or just want to say hi? Feel
            free to reach out!
          </p>
        </div>
        <hr className="w-[1000px] border-t border-gray-400 mt-6" />
      </div>
      <div className="flex justify-center gap-10 p-5">
        <TravelSlider />
      </div>
      <ul className="justify-center gap-10 flex text-sm pb-5">
        {menu_client.map(
          (item: { path: string; title: string }, id: number) => (
            <Link
              to={item.path}
              key={item.path}
              className="relative group cursor-pointer"
            >
              {item.title}
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )
        )}
      </ul>
    </div>
  );
}

export default About;
