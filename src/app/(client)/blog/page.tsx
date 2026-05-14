"use client";
import Link from "next/link";
import { menu_client } from "../../../utills/contants";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/authContext/AuthContext";
import ModalPost, { type PostFormData } from "../../../helpers/ModalPost";

interface newpost {
  _id: string;
  title: string;
  content: string;
  image?: string; // Legacy
  images?: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
}
interface users {
  _id: string;
  name: string;
  email: string;
  image: string;
}

type NewPaperReq = {
  results: newpost[];
  TotalPages: number;
};
type UsersReq = {
  results: users[];
  TotalPages: number;
};

const Blog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [listNewpaper, setListNewpaper] = useState<newpost[]>([]);
  const [listUsers, setListUsers] = useState<users[]>([]);
  const [editingPost, setEditingPost] = useState<PostFormData | null>(null);

  const authContext = useContext(AuthContext);
  const currentUserId = authContext?.auth?.userId;
  const token = authContext?.auth?.token;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchs = async () => {
      await getAllPost();
      await getAllUsers();
    };
    fetchs();
  }, []);

  useEffect(() => {
    const syncSearch = (event?: Event) => {
      const customEvent = event as CustomEvent<string> | undefined;
      const value =
        customEvent?.detail ??
        new URLSearchParams(window.location.search).get("q") ??
        "";

      setSearchQuery(value.trim().toLowerCase());
    };

    syncSearch();
    window.addEventListener("story-search-change", syncSearch);
    window.addEventListener("popstate", syncSearch);

    return () => {
      window.removeEventListener("story-search-change", syncSearch);
      window.removeEventListener("popstate", syncSearch);
    };
  }, []);

  const getAllPost = async () => {
    try {
      const res = await axios.get<NewPaperReq>("http://localhost:7777/api/posts/");
      console.log("Danh sách bài viết Trang Blog:", res.data.results);
      setListNewpaper(res.data.results.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get<UsersReq>("http://localhost:7777/api/users/");
      setListUsers(res.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserDetails = (authorId: string) => {
    const user = listUsers.find((u) => u._id === authorId);
    return user || { name: "Admin", image: "https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png" };
  };

  const getImageUrl = (post: newpost) => {
    const baseUrl = "http://localhost:7777";
    let imgPath = "";

    if (post.images && post.images.length > 0) {
      imgPath = post.images[0];
    } else if (post.image) {
      imgPath = post.image;
    }

    if (!imgPath) return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
    
    // Nếu là đường dẫn tương đối (bắt đầu bằng / hoặc không có http)
    const finalUrl = imgPath.startsWith("/") || (!imgPath.startsWith("http") && !imgPath.startsWith("https"))
      ? `${baseUrl}${imgPath.startsWith("/") ? imgPath : `/${imgPath}`}`
      : imgPath;
    
    console.log(`Bài viết Blog "${post.title}" -> Ảnh gốc: "${imgPath}" -> URL cuối: "${finalUrl}"`);
    return finalUrl;
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (post: newpost) => {
    setEditingPost({
      _id: post._id,
      title: post.title,
      content: post.content,
      image: post.image || "",
      images: post.images || (post.image ? [post.image] : []),
    });
    setIsOpen(true);
  };

  const handleSubmit = async (data: PostFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);

      if (data.images && data.images.length > 0) {
        data.images.forEach((img) => {
          if (img instanceof File) {
            formData.append("images", img);
          } else {
            formData.append("existingImages", img);
          }
        });
      }

      if (data._id) {
        await axios.patch(`http://localhost:7777/api/posts/${data._id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      } else {
        await axios.post(`http://localhost:7777/api/posts/`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      }
      await getAllPost();
    } catch (error) {
      console.error("Failed to save post", error);
    }
    setIsOpen(false);
  };

  const filteredPosts = searchQuery
    ? listNewpaper.filter((post) =>
        `${post.title} ${post.content}`.toLowerCase().includes(searchQuery)
      )
    : listNewpaper;

  return (
    <div className="bg-[#F7F5F0] min-h-screen text-[#1A1A1A] font-sans">

      {/* Main Editorial Feed */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Main List (8 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-16">
            <h2 className="font-serif text-4xl font-bold border-b border-black pb-4">All Editorials</h2>
            
            {filteredPosts.map((item, index) => {
              const authorData = getUserDetails(item.author);
              return (
                <article key={item._id || index} className="group cursor-pointer flex flex-col sm:flex-row gap-8 items-start">
                  <div className="w-full sm:w-2/5 shrink-0 overflow-hidden aspect-[4/3] relative">
                    <img
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      src={getImageUrl(item)}
                      alt={item.title}
                    />
                    {currentUserId === item.author && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }} 
                        className="absolute top-2 left-2 bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <i className="fa-solid fa-pen-to-square text-xs"></i>
                      </button>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-xs text-gray-500 font-medium">{authorData.name}</span>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 leading-tight mb-4">
                      {item.title}
                    </h1>
                    <p className="text-gray-600 line-clamp-3 text-justify leading-relaxed mb-6">
                      {item.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                       <button className="border-b border-black pb-1 text-xs font-semibold uppercase tracking-widest hover:text-gray-500 hover:border-gray-500 transition-colors">
                         Read More
                       </button>
                       <div className="flex gap-4 text-gray-400">
                         <i className="fa-regular fa-heart hover:text-black transition-colors cursor-pointer"></i>
                         <i className="fa-regular fa-bookmark hover:text-black transition-colors cursor-pointer"></i>
                       </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Sidebar (4 columns) */}
          <aside className="lg:col-span-4 sticky top-10 flex flex-col gap-12 border-l border-gray-300 pl-8 hidden lg:flex">
            
            <div className="flex flex-col items-center text-center">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                alt="Editor"
                className="w-full h-auto aspect-square object-cover mb-6"
              />
              <h3 className="font-serif text-2xl font-bold mb-3">About the Editor</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Consulted perpetual of pronounce me delivered. Too months nay end change relied who beauty wishes matter. Shew of john real park so rest we on.
              </p>
              <button className="border border-black px-6 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                Read More
              </button>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold border-b border-black pb-3 mb-6">Trending</h3>
              <div className="flex flex-col gap-6">
                {filteredPosts.slice(0, 4).map((post, i) => (
                  <div key={i} className="flex gap-4 items-center group cursor-pointer">
                    <span className="font-serif text-3xl font-bold text-gray-300 group-hover:text-[#F8B195] transition-colors">0{i+1}</span>
                    <div>
                      <h4 className="font-serif text-lg font-bold leading-tight group-hover:text-gray-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white mt-20 py-20 px-6 border-t-[16px] border-[#F8B195]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">The Chronicle.</h1>
          <ul className="flex flex-wrap justify-center gap-8 text-xs font-medium uppercase tracking-widest">
            {menu_client.map((item) => (
              <Link href={item.path} key={item.path} className="hover:text-gray-400 transition-colors">
                {item.title}
              </Link>
            ))}
          </ul>
        </div>
      </footer>
      
      <ModalPost
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingPost}
      />
    </div>
  );
};

export default Blog;

