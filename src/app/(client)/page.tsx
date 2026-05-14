"use client";
import { useEffect, useState, useContext } from "react";
import ModalPost, { type PostFormData } from "../../helpers/ModalPost";
import Link from "next/link";
import axios from "axios";
import { AuthContext } from "../../context/authContext/AuthContext";
import { menu_client } from "../../utills/contants";
import SlidePro from "./SlidePro";

interface newpost {
  _id: string;
  title: string;
  content: string;
  image?: string;
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

function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [listNewpaper, setListNewpaper] = useState<newpost[]>([]);
  const [listUsers, setListUsers] = useState<users[]>([]);
  const [editingPost, setEditingPost] = useState<PostFormData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeHeroPostId, setActiveHeroPostId] = useState<string | null>(null);

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
      setCurrentPage(1);
      setActiveHeroPostId(null);
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
      const res = await axios.get<NewPaperReq>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/posts/`);
      console.log("Danh sách bài viết Trang chủ:", res.data.results);
      setListNewpaper(res.data.results.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get<UsersReq>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/users/`);
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
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}`;
    let imgPath = "";

    if (post.images && post.images.length > 0) {
      imgPath = post.images[0];
    } else if (post.image) {
      imgPath = post.image;
    }

    if (!imgPath) return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
    
    const finalUrl = imgPath.startsWith("/") || (!imgPath.startsWith("http") && !imgPath.startsWith("https"))
      ? `${baseUrl}${imgPath.startsWith("/") ? imgPath : `/${imgPath}`}`
      : imgPath;
    
    console.log(`Bài viết "${post.title}" -> Ảnh gốc: "${imgPath}" -> URL cuối: "${finalUrl}"`);
    return finalUrl;
  };


  const handleOpenAdd = () => {
    setEditingPost(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (post: newpost, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
            // Keep track of existing images if the backend supports it (optional)
            formData.append("existingImages", img);
          }
        });
      }

      if (data._id) {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/posts?id=${data._id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/posts/`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      }
      // Always re-fetch to get the actual URLs from the server
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

  const activeHeroPost =
    filteredPosts.find((post) => post._id === activeHeroPostId) ||
    filteredPosts[0] ||
    null;
  const heroPost = activeHeroPost;
  const sidePosts = searchQuery
    ? filteredPosts.slice(0, 5)
    : filteredPosts.slice(1, 2);
  const restPosts = searchQuery
    ? filteredPosts.filter((post) => post._id !== heroPost?._id)
    : filteredPosts.slice(3);
  
  const postsPerPage = 12;
  const totalPages = Math.ceil(restPosts.length / postsPerPage);
  const currentRestPosts = restPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <div className="mx-auto bg-[#F7F5F0] min-h-screen text-[#1A1A1A] w-full">


      {heroPost && (
        <section className="max-w-[1600px] mx-auto px-6 py-10">
          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${
              searchQuery ? "lg:h-[620px]" : ""
            }`}
          >
            
            <div
              onWheel={(e) => {
                if (searchQuery) {
                  e.stopPropagation();
                }
              }}
              className={`lg:col-span-3 flex flex-col gap-8 ${
                searchQuery ? "scrollbar-hidden overscroll-contain lg:h-full lg:overflow-y-auto lg:pr-3" : ""
              }`}
            >
              {searchQuery && filteredPosts.length > 0 && (
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Search Results ({filteredPosts.length})
                </p>
              )}
              {sidePosts.map((sidePost) => (
                <article
                  key={sidePost._id}
                  onMouseEnter={() => setActiveHeroPostId(sidePost._id)}
                  onClick={() => setActiveHeroPostId(sidePost._id)}
                  onFocus={() => setActiveHeroPostId(sidePost._id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveHeroPostId(sidePost._id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`group cursor-pointer block border-l-2 pl-4 transition-colors ${
                    sidePost._id === heroPost._id
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <div className="overflow-hidden aspect-[4/3] mb-4">
                    <img 
                      src={getImageUrl(sidePost)} 
                      alt={sidePost.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-serif text-2xl font-bold leading-tight mb-3 group-hover:text-gray-600 transition-colors">
                    {sidePost.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {sidePost.content}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-300 pt-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {new Date(sidePost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/blog/${sidePost._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold uppercase tracking-widest border-b border-black hover:text-gray-500 hover:border-gray-500"
                      >
                        Detail
                      </Link>
                      {currentUserId === sidePost.author && (
                        <button onClick={(e) => handleOpenEdit(sidePost, e)} className="text-gray-400 hover:text-black">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <Link
              href={`/blog/${heroPost._id}`}
              className={`lg:col-span-6 relative group cursor-pointer block overflow-hidden ${
                searchQuery ? "h-[420px] lg:h-full" : "h-[500px]"
              }`}
            >
              <div className="w-full h-full absolute inset-0 overflow-hidden">
                <img 
                  src={heroPost.images?.[0] || heroPost.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb"} 
                  alt={heroPost.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </Link>

            <div
              className={`lg:col-span-3 flex flex-col justify-center py-8 ${
                searchQuery ? "scrollbar-hidden lg:h-full lg:overflow-y-auto" : "h-full"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src={getUserDetails(heroPost.author).image} 
                  alt="author" 
                  className="w-10 h-10 rounded-full grayscale"
                />
                <div>
                  <p className="text-sm font-medium">{getUserDetails(heroPost.author).name}</p>
                  <p className="text-xs text-gray-500">{new Date(heroPost.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <Link href={`/blog/${heroPost._id}`} className="block">
                <h2 className="font-serif text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 hover:text-gray-700 transition-colors">
                  {heroPost.title}
                </h2>
                <p className="text-base text-gray-700 line-clamp-4 leading-relaxed mb-8">
                  {heroPost.content}
                </p>
              </Link>
              <div className="flex items-center justify-between">
                <Link href={`/blog/${heroPost._id}`} className="border-b border-black pb-1 text-sm font-semibold uppercase tracking-widest hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Read Full Story
                </Link>
                {currentUserId === heroPost.author && (
                  <button onClick={(e) => handleOpenEdit(heroPost, e)} className="text-gray-400 hover:text-black p-2 border border-gray-300 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                )}
              </div>
            </div>

          </div>
        </section>
      )}

      {!searchQuery && (
        <>
          <hr className="border-t border-gray-300 max-w-7xl mx-auto my-10" />

          <section className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-4xl font-bold">Latest Headlines</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {currentRestPosts.map((item, index) => {
                const authorData = getUserDetails(item.author);
                return (
                  <Link href={`/blog/${item._id}`} key={item._id || index} className="group cursor-pointer flex flex-col">
                    <div className="overflow-hidden aspect-video mb-5 relative">
                      <img 
                        src={getImageUrl(item)} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {currentUserId === item.author && (
                        <button 
                          onClick={(e) => handleOpenEdit(item, e)} 
                          className="absolute top-2 right-2 bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                        >
                          <i className="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <h3 className="font-serif text-xl font-bold leading-snug mb-3 group-hover:text-gray-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                        {item.content}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{authorData.name}</span>
                        </div>
                        <div className="flex gap-3 text-gray-400">
                          <i className="fa-regular fa-heart hover:text-black transition-colors" onClick={(e)=>e.preventDefault()}></i>
                          <i className="fa-regular fa-bookmark hover:text-black transition-colors" onClick={(e)=>e.preventDefault()}></i>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-5 py-2 border border-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors uppercase text-xs tracking-widest font-semibold"
                >
                  Prev
                </button>
                <span className="font-serif text-lg font-medium mx-4">
                  {currentPage} / {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-5 py-2 border border-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors uppercase text-xs tracking-widest font-semibold"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </>
      )}

      <footer className="bg-[#1A1A1A] text-white mt-20 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Stay Informed.</h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            Get the latest breaking news, deep dive editorials, and business insights delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-transparent border-b border-gray-500 px-4 py-3 focus:outline-none focus:border-white text-white flex-1"
            />
            <button className="bg-white text-black px-8 py-3 uppercase tracking-widest text-sm font-semibold hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>
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
}

export default Home;
