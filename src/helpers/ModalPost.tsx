"use client";
import React, { useState, useEffect } from "react";

export type PostFormData = {
  _id?: string;
  title: string;
  content: string;
  image?: string;
  images?: (string | File)[];
};

type ModalPostProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void;
  initialData?: PostFormData | null;
};

function ModalPost({ isOpen, onClose, onSubmit, initialData }: ModalPostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // images sẽ chứa cả URL (ảnh cũ) và đối tượng File (ảnh mới chọn)
  const [images, setImages] = useState<(string | File)[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      const existingImages = initialData.images?.length
        ? initialData.images
        : initialData.image
          ? [initialData.image]
          : [];
      setImages(existingImages);
      // Chỉ lấy các chuỗi URL để hiển thị preview ban đầu
      const initialPreviews = existingImages.filter((img) => typeof img === "string") as string[];
      setPreviewImages(initialPreviews);
    } else {
      setTitle("");
      setContent("");
      setImages([]);
      setPreviewImages([]);
    }
  }, [initialData, isOpen]);

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Tạo bản xem trước (base64)
    const previews = await Promise.all(files.map(fileToDataUrl));

    // Lưu file thật vào images và base64 vào previewImages
    setImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...previews]);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      _id: initialData?._id,
      title,
      content,
      // Lưu ý: images ở đây có thể chứa cả File object
      images: images as any, 
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 transition-opacity duration-300 px-4">
      <div className="bg-[#F7F5F0] p-8 w-[780px] max-w-[95vw] shadow-2xl border border-gray-300 rounded-none">
        <h2 className="text-3xl font-serif mb-8 text-center text-[#1A1A1A] font-bold border-b border-black pb-4">
          {initialData ? "Edit Story" : "New Story"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter post title..."
                  className="w-full p-3 bg-transparent border-b border-gray-400 focus:border-black focus:outline-none transition-colors"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  placeholder="What's your story?"
                  className="w-full p-3 bg-transparent border-b border-gray-400 focus:border-black focus:outline-none transition-colors resize-none h-32"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-gray-700 mb-2">
                  Images
                </label>
                <input
                  type="file"
                  multiple
                  name="images"
                  className="w-full p-3 bg-transparent border-b border-gray-400 focus:border-black focus:outline-none transition-colors file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-white"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="w-full lg:w-80">
              <style>{`
                .image-scroll-container::-webkit-scrollbar {
                  width: 0;
                  height: 0;
                }
                .image-scroll-container {
                  scrollbar-width: none;
                  -ms-overflow-style: none;
                }
              `}</style>
              {previewImages.length > 0 && (
                <div className="image-scroll-container overflow-y-auto flex flex-col gap-3 h-[22rem] w-full pr-2">
                  {previewImages.map((preview, index) => (
                    <div
                      key={`${preview}-${index}`}
                      className="relative overflow-hidden border border-gray-300 w-full h-40"
                    >
                      <img
                        src={preview}
                        alt={`preview-${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black text-white hover:bg-red-600"
                        aria-label="Remove image"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-400 text-gray-700 uppercase tracking-widest text-xs font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white uppercase tracking-widest text-xs font-semibold hover:bg-gray-800 shadow-md transition-all"
            >
              {initialData ? "Save Changes" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalPost;
