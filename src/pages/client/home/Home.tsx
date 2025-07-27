import { useState } from "react";
import Slide from "./Slide";
import ModalPost from "../../../helpers/ModalPost";
import SlidePro from "./SlidePro";
import { menu_client } from "../../../utills/contants";
import { Link } from "react-router-dom";

function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const HandleClose = (): void => setIsOpen(false);

  const handleSubmit = (): void => {};
  return (
    <div className="mx-auto">
      <Slide />

      {/* Search bar */}
      <div className="flex justify-center my-8">
        <div className="relative w-[500px]">
          <img
            className="w-10 h-10 object-cover rounded-full absolute left-4 top-1/2 -translate-y-1/2"
            src="https://i.pinimg.com/736x/6f/dc/e0/6fdce0881cc02ee9e3acbe726ee74e85.jpg"
            alt="Avatar"
          />
          <div className=" text-slate-400 p-5 absolute right-1 top-1/2 -translate-y-1/2 text-xl">
            <i className="fa-solid fa-plus"></i>
          </div>
          <input
            onClick={() => setIsOpen(true)}
            type="text"
            placeholder="Thêm Bài Viết..."
            className="w-full pl-16 pr-4 py-4 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Blog posts container */}
      <div className="w-full flex justify-center">
        <div className="max-w-5xl w-full px-10 h-[900px] overflow-y-scroll scrollbar-hide">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex gap-8 items-start py-6 px-4 mb-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
            >
              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  className="w-72 h-48 object-cover rounded-lg shadow-md "
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                  alt={`Travel Image ${index + 1}`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-gray-700">
                <p className="text-xs font-thin font-serif text-gray-500">
                  Tuesday, February 18, 2025
                </p>
                <h1 className="text-2xl font-dancing font-semibold mt-2">
                  Street Style Muse Effortless Looks on the Sidewalk
                </h1>
                <p className="text-sm text-justify mt-4">
                  Consulted perpetual of pronounce me delivered. Too months nay
                  end change relied who beauty wishes matter. Shew of john real
                  park so rest we on. Ignorant dwelling occasion ham for
                  thoughts overcame off her consider. Polite it elinor is
                  depend. His...
                </p>

                {/* Footer: Author & Action buttons */}
                <div className="flex justify-between items-center mt-5">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full hover:scale-110 duration-100"
                      src="https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png"
                      alt=""
                    />
                    <h3 className="font-bold">Join Wick</h3>
                  </div>
                  <button className="bg-slate-500 text-white px-6 py-1 transform -skew-x-12 hover:bg-pink-700  duration-300 transition">
                    <span className="inline-block transform skew-x-12">
                      READ MORE
                    </span>
                  </button>

                  <div className="flex gap-10">
                    <button className="hover:text-red-400 hover:drop-shadow-[0_0_6px_rgba(248,113,113,0.6)] transition duration-200">
                      <i className="fa-regular fa-heart text-xl"></i>
                      <span className="ml-2">190</span>
                    </button>
                    <button className="hover:text-blue-400 hover:drop-shadow-[0_0_6px_rgba(96,165,250,0.6)] transition duration-200">
                      <i className="fa-regular fa-comment text-xl"></i>
                      <span className="ml-2">190</span>
                    </button>
                    <button className="hover:text-pink-400 hover:drop-shadow-[0_0_6px_rgba(244,114,182,0.6)] transition duration-200">
                      <i className="fa-regular fa-share-from-square text-xl"></i>
                      <span className="ml-2">190</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-[400px] overflow-y-scroll scrollbar-hide">
          {[...Array(10)].map((_, index) => (
            <div className="flex justify-between items-center">
              <div key={index} className="flex items-center gap-3 my-5">
                <div className="relative w-10 h-10">
                  <img
                    className="w-10 h-10 rounded-full hover:scale-110 duration-100"
                    src="https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png"
                    alt=""
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
                </div>
                <h3 className="font-bold">Join Wick</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h1 className="font-serif text-4xl text-center mt-3">Services</h1>
      <SlidePro />
      <ul className="flex justify-center gap-10 text-sm p-5">
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
      <ModalPost
        isOpen={isOpen}
        onClose={HandleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Home;
