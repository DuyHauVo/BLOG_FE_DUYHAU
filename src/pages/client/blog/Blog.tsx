import { Link } from "react-router-dom";
import { menu_client } from "../../../utills/contants";

const Blog = () => {
  return (
    <>
      <div className="grid grid-cols-4 items-start justify-center py-10 ">
        {/* Text Section (3/4) */}
        <div className="col-span-3 flex flex-col items-center">
          <h1 className="font-serif text-4xl text-center">Blog Me</h1>
          <hr className="w-[90%] border-t border-gray-400 mt-6" />

          <div className="h-[900px] overflow-y-scroll scrollbar-hide pr-2 pt-25">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-3 w-full max-w-5xl pt-10 gap-4 items-center py-10"
              >
                {/* Image: 1/3 */}
                <div className="col-span-1 flex justify-center p-4">
                  <img
                    className="object-cover rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                    alt={`Travel Image ${index + 1}`}
                  />
                </div>

                {/* Date: 2/3 */}
                <div className="col-span-2 text-center text-gray-700 ">
                  <p className="text-xs font-thin font-serif ">
                    Tuesday, February 18, 2025
                  </p>
                  <h1 className="text-3xl font-dancing font-medium p-2">
                    Street Style Muse Effortless Looks on the Sidewalk
                  </h1>
                  <p className="text-center py-5">
                    Consulted perpetual of pronounce me delivered. Too months
                    nay end change relied who beauty wishes matter. Shew of john
                    real park so rest we on. Ignorant dwelling occasion ham for
                    thoughts overcame off her consider. Polite it elinor is
                    depend.His...
                  </p>
                  <div className="grid grid-cols-2  items-center mt-3">
                    <div className="flex gap-3">
                      <img
                        className="w-10 h-auto rounded-full hover:scale-110 duration-100"
                        src="https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png"
                        alt=""
                      />
                      <h3 className="font-bold my-2">Join Wick</h3>
                    </div>
                    <div className="flex justify-evenly">
                      <button className="hover:text-red-400 hover:drop-shadow-[0_0_6px_rgba(248,113,113,0.6)] transition duration-200">
                        <i className="fa-regular fa-heart text-xl"></i>
                      </button>

                      {/* Comment Icon - xanh nhạt */}
                      <button className="hover:text-blue-400 hover:drop-shadow-[0_0_6px_rgba(96,165,250,0.6)] transition duration-200">
                        <i className="fa-regular fa-comment text-xl"></i>
                      </button>

                      {/* Share Icon - tím Instagram vibe */}
                      <button className="hover:text-pink-400 hover:drop-shadow-[0_0_6px_rgba(244,114,182,0.6)] transition duration-200">
                        <i className="fa-regular fa-share-from-square text-xl"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avatar Image (1/4) — Fixed when scrolling */}
        <div className="col-span-1 sticky top-10 h-fit mx-auto px-3">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            alt="Avatar"
            className="w-80 h-auto object-cover rounded-lg shadow-md"
          />

          <div className="text-center">
            <h1 className="py-5 text-4xl">IMAGE</h1>
            <div className="grid grid-cols-3 gap-2">
              <img
                className="rounded-md object-cover h-40"
                src="https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-viet-nam-cover.jpeg"
                alt=""
              />
              <img
                className="rounded-md object-cover h-40"
                src="https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-viet-nam-cover.jpeg"
                alt=""
              />

              <img
                className="rounded-md object-cover h-40"
                src="https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-viet-nam-cover.jpeg"
                alt=""
              />

              <img
                className="rounded-md object-cover h-40"
                src="https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-viet-nam-cover.jpeg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <ul className="flex justify-center gap-10 text-xs p-5">
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
    </>
  );
};
export default Blog;
