"use client";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { AuthContext } from "../../../../context/authContext/AuthContext";
import { useNotification } from "../../../../context/layoutContext/Alerts";
import ModalConfirmDelete from "../../../admin/post/modalDelete";
import ModalPost, { type PostFormData } from "../../../../helpers/ModalPost";
interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string; // Legacy
  images?: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
}

function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [otherPosts, setOtherPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDele, setOpenDele] = useState<boolean>(false);
  const [deleId, setDeleId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<PostFormData | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const authContext = useContext(AuthContext);
  const token = authContext?.auth?.token;
  const currentUserId = authContext?.auth?.userId;
  const alerts = useNotification();
  const router = useRouter();

  const handleOpenEdit = (post: Post, e?: React.MouseEvent) => {
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
    setIsOpenEdit(true);
  };

  const handleSubmitEdit = async (data: PostFormData) => {
    try {
      if (data._id) {
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

        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/posts?id=${data._id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
        alerts("Post updated successfully!", "success");
        setRefreshKey(prev => prev + 1);
      }
    } catch (error: any) {
      alerts(error?.response?.data?.message || "Failed to update post", "error");
    }
    setIsOpenEdit(false);
  };

  const handleDelete = async () => {
    if (!deleId) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/posts?id=${deleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alerts("Post deleted successfully!", "success");
      setOpenDele(false);
      router.push('/my-blog');
    } catch (error: any) {
      alerts(error?.response?.data?.message || "Failed to delete post", "error");
      setOpenDele(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, refreshKey]);

  const fetchData = async () => {
    try {
      // Fetch post details
      const postRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/posts/${id}`);
      const postData = postRes.data;
      setPost(postData);

      // Fetch other posts for the top slider
      try {
        const othersRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/posts?currenPage=100&Page=1`);
        // Filter out current post
        const filtered = othersRes.data.results.filter((p: Post) => p._id !== id);
        setOtherPosts(filtered);
      } catch (err) {
        console.error("Failed to fetch other posts", err);
      }

      // Fetch author details
      if (postData?.author) {
        try {
          const authorRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/users/show/${postData.author}`);
          setAuthor(authorRes.data);
        } catch (err) {
          console.error("Failed to fetch author", err);
          setAuthor({
            _id: postData.author,
            name: "Admin",
            email: "admin@example.com",
            image: "https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png"
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch post", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string | undefined) => {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}`;
    if (!path) return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
    
    if (path.startsWith("/") || (!path.startsWith("http") && !path.startsWith("https"))) {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${baseUrl}${cleanPath}`;
    }
    return path;
  };

  // Combine legacy image and new images array
  const displayImages = post?.images && post.images.length > 0 
    ? post.images.map(img => getImageUrl(img))
    : post?.image 
      ? [getImageUrl(post.image)] 
      : [getImageUrl(undefined)];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex(prev => prev !== null ? (prev === 0 ? displayImages.length - 1 : prev - 1) : null);
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex(prev => prev !== null ? (prev === displayImages.length - 1 ? 0 : prev + 1) : null);
      } else if (e.key === "Escape") {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, displayImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-xl font-serif">Loading story...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7]">
        <h1 className="text-4xl font-serif mb-4">Story Not Found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#1A1A1A] w-full pb-20 overflow-x-hidden">
      
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <Link href="/" className="text-sm uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-10 inline-block border-b border-transparent hover:border-black">
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Feed
        </Link>

        {/* Main Content Area using flow-root for clearfix */}
        <div className="lg:flow-root">
          
          {/* Gallery Section - Floated Left on Desktop */}
          <div className="lg:float-left lg:w-[55%] lg:mr-12 lg:mb-10 w-full mb-8 flex flex-col gap-4">
            {/* First Image (Large) */}
            <figure 
              className="w-full relative group cursor-pointer overflow-hidden aspect-[4/3] rounded-md shadow-sm"
              onClick={() => setSelectedImageIndex(0)}
            >
              <img 
                src={displayImages[0]} 
                alt={`${post.title} - Main Image`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <i className="fa-solid fa-expand text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"></i>
              </div>
            </figure>

            {/* Remaining Images (Grid) */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {displayImages.slice(1).map((imgSrc, idx) => (
                  <figure 
                    key={idx + 1} 
                    className="w-full relative group cursor-pointer overflow-hidden aspect-square rounded-md shadow-sm"
                    onClick={() => setSelectedImageIndex(idx + 1)}
                  >
                    <img 
                      src={imgSrc} 
                      alt={`${post.title} - Image ${idx + 2}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <i className="fa-solid fa-expand text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"></i>
                    </div>
                  </figure>
                ))}
              </div>
            )}
          </div>

          {/* Article Header & Body - Wrapping around the Gallery */}
          <div className="prose prose-lg prose-gray max-w-none leading-relaxed text-gray-800">
            <div className="flex justify-between items-start mb-4 group/header">
              <h1 className="font-sans text-3xl md:text-5xl font-bold leading-tight mb-2 tracking-tight">
                {post.title}
              </h1>
              
              {currentUserId === post.author && (
                <div className="relative flex flex-col items-end ml-4">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === post._id ? null : post._id);
                    }}
                    className="text-gray-400 hover:text-black w-10 h-10 rounded-full transition-colors flex items-center justify-center bg-white shadow-sm border border-gray-100"
                    title="Options"
                  >
                    <i className="fa-solid fa-ellipsis-vertical text-xl"></i>
                  </button>

                  {openDropdownId === post._id && (
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden flex flex-col">
                      <button 
                        onClick={(e) => {
                          setOpenDropdownId(null);
                          handleOpenEdit(post, e);
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors flex items-center gap-3 border-b border-gray-100"
                      >
                        <i className="fa-solid fa-pen-to-square w-4"></i> Edit
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          setOpenDropdownId(null);
                          setDeleId(post._id); 
                          setOpenDele(true); 
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-3"
                      >
                        <i className="fa-solid fa-trash w-4"></i> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200 not-prose font-sans">
              <img 
                src={author?.image || "https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png"} 
                alt={author?.name || "Author"} 
                className="w-10 h-10 rounded-full grayscale object-cover"
              />
              <div className="text-sm">
                <span className="font-bold text-gray-900">{author?.name || "Unknown Author"}</span>
                <span className="mx-2 text-gray-400">|</span>
                <time className="text-gray-500">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
              </div>
            </div>

            {/* Content Paragraphs */}
            {post.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              )
            ))}

            <div className="flex gap-6 text-2xl text-gray-400 mt-12 pt-10 border-t border-gray-200 not-prose">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-bold self-center">Share:</span>
              <i className="fa-brands fa-twitter hover:text-[#1DA1F2] cursor-pointer transition-colors"></i>
              <i className="fa-brands fa-facebook hover:text-[#4267B2] cursor-pointer transition-colors"></i>
              <i className="fa-regular fa-bookmark hover:text-black cursor-pointer transition-colors ml-auto"></i>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Other Posts Slider */}
      {otherPosts.length > 0 && (
        <section className="w-full bg-black py-16 mt-20">
          <div className="max-w-7xl mx-auto px-6 mb-10">
            <h2 className="text-white font-serif text-3xl uppercase tracking-widest border-b border-gray-800 pb-4">More Stories</h2>
          </div>
          <div className="w-full px-6">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }
              }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full"
            >
              {otherPosts.map((op) => (
                <SwiperSlide key={op._id}>
                  <Link href={`/blog/${op._id}`} className="block aspect-[4/3] relative group overflow-hidden">
                    <img 
                      src={getImageUrl(op.images?.[0] || op.image)} 
                      alt={op.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-white font-serif text-xl font-bold leading-snug line-clamp-2">{op.title}</h3>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}
      <ModalPost
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        onSubmit={handleSubmitEdit}
        initialData={editingPost}
      />
      <ModalConfirmDelete
        isOpen={openDele}
        onClose={() => setOpenDele(false)}
        onConfirm={handleDelete}
        handleClose={() => setOpenDele(false)}
      />

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition-colors z-50"
            onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(null); }}
          >
            &times;
          </button>

          {/* Prev Button */}
          <button 
            className="absolute left-4 md:left-10 text-white text-3xl md:text-5xl hover:text-gray-300 transition-colors z-50 p-4"
            onClick={(e) => { 
              e.stopPropagation(); 
              setSelectedImageIndex(prev => prev !== null ? (prev === 0 ? displayImages.length - 1 : prev - 1) : null);
            }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <img 
            src={displayImages[selectedImageIndex]} 
            alt="Enlarged view" 
            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking on image
          />

          {/* Next Button */}
          <button 
            className="absolute right-4 md:right-10 text-white text-3xl md:text-5xl hover:text-gray-300 transition-colors z-50 p-4"
            onClick={(e) => { 
              e.stopPropagation(); 
              setSelectedImageIndex(prev => prev !== null ? (prev === displayImages.length - 1 ? 0 : prev + 1) : null);
            }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogDetail;
