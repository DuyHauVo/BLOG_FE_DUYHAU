"use client";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { useNotification } from "../../../context/layoutContext/Alerts";
import ModalConfirmDelete from "../../admin/post/modalDelete";
import ModalPost, { type PostFormData } from "../../../helpers/ModalPost";

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

function MyBlog() {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [openDele, setOpenDele] = useState<boolean>(false);
  const [deleId, setDeleId] = useState<string | null>(null);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<PostFormData | null>(null);

  const authContext = useContext(AuthContext);
  const token = authContext?.auth?.token;
  const currentUserId = authContext?.auth?.userId;
  const alerts = useNotification();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentUserId && token) {
      fetchMyPosts();
    } else {
      setLoading(false);
    }
  }, [currentUserId, token]);

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

  const getImageUrl = (post: Post) => {
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
    
    console.log(`MyBlog "${post.title}" -> Ảnh gốc: "${imgPath}" -> URL cuối: "${finalUrl}"`);
    return finalUrl;
  };

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      let posts: Post[] = [];

      // Cách 1: Thử lấy qua endpoint dành riêng cho User (cần Token)
      try {
        const myPostsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/posts/my-posts?currenPage=1000&Page=1`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = myPostsRes.data;
        posts = Array.isArray(data) ? data : data?.results || [];
      } catch (err) {
        console.warn("Không thể lấy qua /my-posts, thử cách 2...", err);
      }

      // Cách 2: Nếu cách 1 không có dữ liệu hoặc lỗi, lấy qua endpoint chung với filter author
      if (posts.length === 0 && currentUserId) {
        try {
          const authorPostsRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/posts?currenPage=1000&Page=1&author=${currentUserId}`
          );
          const data = authorPostsRes.data;
          posts = Array.isArray(data) ? data : data?.results || [];
        } catch (err) {
          console.error("Lỗi khi lấy bài viết theo author ID:", err);
        }
      }

      // Sắp xếp
      const sortedPosts = [...posts].sort(
        (a: Post, b: Post) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setMyPosts(sortedPosts);
      console.log("Danh sách bài viết của tôi:", sortedPosts);
    } catch (error) {
      console.error("Lỗi tổng thể:", error);
      alerts("Không thể tải danh sách bài viết. Vui lòng thử lại sau!", "error");
    } finally {
      setLoading(false);
    }
  };

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
        // Sử dụng FormData để gửi kèm file ảnh thật khi update
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);

        if (data.images && data.images.length > 0) {
          data.images.forEach((img) => {
            if (img instanceof File) {
              // Nếu là File mới chọn -> đưa vào mảng để upload
              formData.append("images", img);
            } else {
              // Nếu là URL cũ -> bạn có thể gửi lại để BE biết giữ lại ảnh nào
              // (Ở BE hiện tại đang nối thêm ảnh mới vào list cũ)
              formData.append("existingImages", img);
            }
          });
        }

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/posts?id=${data._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alerts("Post updated successfully!", "success");
        fetchMyPosts(); // Reload lại danh sách sau khi sửa
      }
    } catch (error: any) {
      alerts(
        error?.response?.data?.message || "Failed to update post",
        "error"
      );
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
      setMyPosts((prev) => prev.filter(p => p._id !== deleId));
    } catch (error: any) {
      alerts(error?.response?.data?.message || "Failed to delete post", "error");
    }
    setOpenDele(false);
  };

  const filteredPosts = searchQuery
    ? myPosts.filter((post) =>
        `${post.title} ${post.content}`.toLowerCase().includes(searchQuery)
      )
    : myPosts;

  if (!currentUserId || !token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F5F0]">
        <h1 className="text-3xl font-serif mb-4">Please log in to view your blogs.</h1>
        <Link href="/login" className="text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0]">
        <div className="text-xl font-serif">Loading your stories...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5F0] min-h-screen text-[#1A1A1A] w-full pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-16 mb-12">
        <h1 className="font-serif text-5xl md:text-6xl font-bold leading-[1.1]">
          My Blog
        </h1>
        <p className="text-gray-500 mt-4 text-lg">Manage your personal stories and editorials.</p>
      </div>

      <section className="max-w-7xl mx-auto px-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200">
            <h2 className="text-2xl font-serif mb-4">
              {searchQuery ? "No stories match your search." : "You haven't written any stories yet."}
            </h2>
            <Link href="/" className="bg-black text-white px-6 py-3 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors inline-block">
              {searchQuery ? "Back Home" : "Start Writing"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div key={post._id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={getImageUrl(post)} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <Link href={`/blog/${post._id}`}>
                    <h3 className="font-serif text-2xl font-bold leading-snug mb-3 hover:text-gray-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-6 flex-1">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <Link href={`/blog/${post._id}`} className="text-sm font-semibold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                      View Post
                    </Link>

                    <div className="relative flex flex-col items-end">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === post._id ? null : post._id);
                        }}
                        className="text-gray-400 hover:text-black w-8 h-8 rounded-full transition-colors flex items-center justify-center"
                        title="Options"
                      >
                        <i className="fa-solid fa-ellipsis-vertical text-lg"></i>
                      </button>

                      {openDropdownId === post._id && (
                        <div className="absolute bottom-full right-0 mb-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10 overflow-hidden flex flex-col">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ModalConfirmDelete
        isOpen={openDele}
        onClose={() => setOpenDele(false)}
        onConfirm={handleDelete}
        handleClose={() => setOpenDele(false)}
      />

      <ModalPost
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        onSubmit={handleSubmitEdit}
        initialData={editingPost}
      />
    </div>
  );
}

export default MyBlog;
