import { Link } from "react-router-dom";
import { menu_client } from "../utills/contants";
import Header from "./Header";

function Navbar() {
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Header />
      <h1 className="font-playwrite text-3xl text-center font-black">
        NEWSPAPER
      </h1>
      <ul className="flex justify-center gap-10 text-xl p-5">
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

export default Navbar;
