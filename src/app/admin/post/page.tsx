"use client";
import Button from "@mui/material/Button";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import Table from "./Table";
import Paginations from "../layouts/Pagination";
import ModalConfirmDelete from "./modalDelete";
import ModalPost from "./ModalPost";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { useNotification } from "../../../context/layoutContext/Alerts";

function Posts() {
  type Post = {
    _id: string;
    title: string;
    content: string;
    author: string;
    // image: string;
    createdAt: string;
    updatedAt: string;
  };

  type PostsResponse = {
    results: Post[];
    TotalPages: number;
  };

  interface FormType {
    _id?: string;
    title: string;
    content: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
  }

  const Form: FormType = {
    title: "",
    content: "",
    image: "",
  };

  const [listPost, setListPost] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [TotalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  
  // Modals state
  const [openDele, setOpenDele] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [dele, setDele] = useState<string | null>("");
  const [reload, setReload] = useState<boolean>(false);

  const handleCloseDele = () => setOpenDele(false);
  const handleCloseModal = () => setIsOpen(false);

  const today: string = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<FormType>({
    ...Form,
    createdAt: today,
    updatedAt: today,
  });

  const authContext = useContext(AuthContext);
  const token = authContext?.getAccess_Token();
  const alerts = useNotification();

  const resetForm = () => {
    setForm({
      ...Form,
      createdAt: today,
      updatedAt: today,
    });
  };

  useEffect(() => {
    getAllPost();
  }, [limit, page, reload]);

  const getAllPost = async () => {
    try {
      const responsive = await axios.get<PostsResponse>(
        `http://localhost:7777/api/posts/role?name=${search}&currenPage=${limit}&Page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setListPost(responsive.data.results);
      setTotalPages(responsive.data.TotalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!dele) return;
    try {
      await axios.delete(`http://localhost:7777/api/posts?id=${dele}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alerts("Xóa bài viết thành công!", "success");
      setReload((prev) => !prev);
    } catch (error: any) {
      alerts(error?.response?.data?.message || "Lỗi khi xóa", "error");
      console.error(error);
    }
    handleCloseDele();
  };

  const handleEdit = (row: Post): void => {
    setIsEdit(true);
    setForm({
      _id: row._id,
      title: row.title,
      content: row.content,
      image: "", // Adjust if image property is exposed by Post
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
    setIsOpen(true);
  };

  const handleOpen = (e: React.FormEvent): void => {
    e.preventDefault();
    setIsEdit(false);
    resetForm();
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        // Update post
        const payload = {
          title: form.title,
          content: form.content,
          image: form.image,
        };
        await axios.patch(`http://localhost:7777/api/posts?id=${form._id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alerts("Cập nhật bài viết thành công!", "success");
      } else {
        // Create post
        await axios.post("http://localhost:7777/api/posts", form, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alerts("Thêm bài viết thành công!", "success");
      }
      setReload((prev) => !prev);
      resetForm();
      handleCloseModal();
    } catch (error: any) {
      alerts(error?.response?.data?.message || "Có lỗi xảy ra", "error");
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center px-28 pb-5">
        <h1 className="text-3xl font-semibold">Manager Post</h1>
        <Button
          type="button"
          variant="outlined"
          onClick={(e) => handleOpen(e)}
        >
          Thêm Post
        </Button>
      </div>
      <Table
        listPost={listPost}
        handleEdit={handleEdit}
        page={page}
        limit={limit}
        setDele={setDele}
        setOpenDele={setOpenDele}
      />
      <ModalConfirmDelete
        isOpen={openDele}
        onClose={handleCloseDele}
        onConfirm={handleDelete}
        handleClose={handleCloseDele}
      />
      <ModalPost
        isOpen={isOpen}
        onClose={handleCloseModal}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        isEdit={isEdit}
      />
      <Paginations
        totalPages={TotalPages}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </div>
  );
}

export default Posts;
