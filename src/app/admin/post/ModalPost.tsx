"use client";
import Button from "@mui/material/Button";
import { Dialog } from "@headlessui/react";
import React from "react";

interface FormType {
  _id?: string;
  title: string;
  content: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  onSubmit: (e: React.FormEvent) => void;
  isEdit: boolean;
}

function ModalPost({ isOpen, onClose, form, setForm, onSubmit, isEdit }: ModalProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl space-y-4">
          <Dialog.Title className="text-xl font-bold">
            {isEdit ? "Edit Post" : "Add Post"}
          </Dialog.Title>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium">Content</label>
              <textarea
                name="content"
                value={form.content || ""}
                onChange={handleChange}
                required
                rows={5}
                className="mt-1 w-full rounded-lg border p-2 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type="text"
                name="image"
                value={form.image || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Ngày tạo</label>
                <input
                  type="date"
                  name="createdAt"
                  value={form.createdAt || ""}
                  onChange={handleChange}
                  disabled
                  className="mt-1 w-full rounded-lg border p-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Ngày cập nhật</label>
                <input
                  type="date"
                  name="updatedAt"
                  value={form.updatedAt || ""}
                  onChange={handleChange}
                  disabled
                  className="mt-1 w-full rounded-lg border p-2 bg-gray-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outlined" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" variant="contained">Lưu</Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ModalPost;
