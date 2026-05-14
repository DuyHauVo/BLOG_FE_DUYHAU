"use client";
import Button from "@mui/material/Button";
import { Dialog } from "@headlessui/react";
import React from "react";

interface FormType {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
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

function ModalUser({ isOpen, onClose, form, setForm, onSubmit, isEdit }: ModalProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
          <Dialog.Title className="text-xl font-bold">
            {isEdit ? "Edit User" : "Add User"}
          </Dialog.Title>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password || ""}
                onChange={handleChange}
                required={!isEdit}
                placeholder={isEdit ? "Leave blank to keep unchanged" : ""}
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                name="role"
                value={form.role || "USERS"}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border p-2"
              >
                <option value="USERS">USERS</option>
                <option value="ADMIN">ADMIN</option>
              </select>
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

export default ModalUser;
