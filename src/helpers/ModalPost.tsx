import React, { useState } from "react";

type ModalPostProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; image: string }) => void;
};

function ModalPost({ isOpen, onClose, onSubmit }: ModalPostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, image });
    setTitle("");
    setContent("");
    setImage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">New Post</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            className="p-3 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            className="p-3 border rounded resize-none h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <input
            type="file"
            placeholder="Image URL"
            className="p-3 border rounded"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          {image && (
            <img
              src={image}
              alt="preview"
              className="rounded w-full h-40 object-cover"
            />
          )}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalPost;
