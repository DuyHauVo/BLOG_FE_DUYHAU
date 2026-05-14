"use client";

import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { useNotification } from "../../../context/layoutContext/Alerts";

type Account = {
  _id: string;
  name: string;
  email: string;
  age?: number;
  image?: string;
  role?: string;
};

type PostCount = {
  count: number;
};

function About() {
  const authContext = useContext(AuthContext);
  const alerts = useNotification();
  const token = authContext?.auth?.token;
  const userId = authContext?.auth?.userId;

  const [account, setAccount] = useState<Account | null>(null);
  const [postCount, setPostCount] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    image: "",
  });
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!userId || !token) {
        setLoading(false);
        return;
      }

      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get<Account>(`http://localhost:7777/api/users/show/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<{ results: any[]; TotalPages: number }>(
            `http://localhost:7777/api/posts/my-posts?Page=1&currenPage=1`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ]);

        setAccount(userRes.data);
        setForm({
          name: userRes.data.name || "",
          email: userRes.data.email || "",
          age: userRes.data.age ? String(userRes.data.age) : "",
          image: userRes.data.image || "",
        });

        // Calculate total posts count from TotalPages
        const totalPostCount = postsRes.data.TotalPages * 1;
        setPostCount(totalPostCount || 0);
        setAvatarChanged(false);
      } catch (error: any) {
        alerts(
          error?.response?.data?.message || "Failed to load account",
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [userId, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    try {
      const payload: {
        name: string;
        age?: number;
        image?: string;
      } = {
        name: form.name.trim(),
        age: form.age ? Number(form.age) : undefined,
      };

      if (avatarChanged) {
        payload.image = form.image.trim();
      }

      await axios.patch("http://localhost:7777/api/users/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAccount((prev) =>
        prev
          ? {
              ...prev,
              name: form.name.trim(),
              age: form.age ? Number(form.age) : undefined,
              image: avatarChanged ? form.image.trim() : prev.image,
            }
          : prev,
      );
      setAvatarChanged(false);
      alerts("Account updated successfully", "success");
    } catch (error: any) {
      alerts(
        error?.response?.data?.message ||
          "Email already exists or update failed",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const resizeImageFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          const maxSize = 480;
          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);

          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error("Cannot resize image"));
            return;
          }

          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.72));
        };

        img.onerror = reject;
        img.src = String(reader.result);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const image = await resizeImageFile(file);
      setForm({ ...form, image });
      setAvatarChanged(true);
      e.target.value = "";
    } catch {
      alerts("Cannot read this image file", "error");
    }
  };

  if (!userId || !token) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-bold mb-4">Account</h1>
        <p className="text-gray-600 mb-8">
          Please log in to view your account.
        </p>
        <Link
          href="/login"
          className="inline-block bg-black text-white px-6 py-3 text-xs uppercase tracking-widest"
        >
          Go to Login
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="font-serif text-xl">Loading account...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] px-6 py-16">
      <section className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
            Account
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold">
            About Me
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <aside className="lg:col-span-4 bg-white border border-gray-200 p-8">
            <div className="aspect-square overflow-hidden bg-gray-100 mb-6">
              <img
                src={
                  form.image ||
                  account?.image ||
                  "https://assets.dryicons.com/uploads/icon/svg/5609/00c2616e-3746-48be-ac80-a4b8add412b5.svg"
                }
                alt={account?.name || "Account avatar"}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-2">
              {account?.name}
            </h2>
            <p className="text-gray-600 break-all">{account?.email}</p>
            <div className="mt-6 border-t border-gray-200 pt-6 text-sm text-gray-600 space-y-2">
              <p>Posts: {postCount}</p>
              <p>Age: {account?.age || "Not set"}</p>
            </div>
          </aside>

          <section className="lg:col-span-8 bg-white border border-gray-200 p-8">
            <h2 className="font-serif text-3xl font-bold mb-8">Edit Account</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="block text-xs uppercase tracking-widest font-semibold mb-2">
                  Name
                </span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  required
                />
              </label>

              <label className="block">
                <span className="block text-xs uppercase tracking-widest font-semibold mb-2">
                  Email
                </span>
                <input
                  type="email"
                  value={form.email}
                  className="w-full border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 outline-none"
                  required
                  disabled
                />
                <span className="block text-xs text-gray-500 mt-2">
                  Email is unique and cannot be changed here.
                </span>
              </label>

              <label className="block">
                <span className="block text-xs uppercase tracking-widest font-semibold mb-2">
                  Age
                </span>
                <input
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </label>

              <div className="block">
                <span className="block text-xs uppercase tracking-widest font-semibold mb-2">
                  Avatar Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-white"
                />
                {form.image && (
                  <div className="relative mt-4 w-48 overflow-hidden border border-gray-300">
                    <img
                      src={form.image}
                      alt="Avatar preview"
                      className="h-48 w-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, image: "" });
                        setAvatarChanged(true);
                      }}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black text-white hover:bg-red-600"
                      aria-label="Remove avatar"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}

export default About;
