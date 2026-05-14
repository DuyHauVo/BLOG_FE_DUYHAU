"use client";
import Button from "@mui/material/Button";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Paginations from "../layouts/Pagination";
import ModalUser from "./ModalUser";
import Table from "./Table";
import ModalConfirmDelete from "../post/modalDelete";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { useNotification } from "../../../context/layoutContext/Alerts";

function Users() {
  type User = {
    _id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };

  type UserResponse = {
    results: User[];
    TotalPages: number;
  };

  const Form: FormType = {
    name: "",
    email: "",
    password: "",
    role: "USERS",
    image: "https://assets.dryicons.com/uploads/icon/svg/5609/00c2616e-3746-48be-ac80-a4b8add412b5.svg",
  };

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

  const [listUsers, setListUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [TotalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  
  // Modals state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [openDele, setOpenDele] = useState<boolean>(false);
  const [dele, setDele] = useState<string | null>("");
  
  const [reload, setReload] = useState<boolean>(false);

  const today: string = new Date().toISOString().slice(0, 10);
  const handleClose = () => setIsOpen(false);
  const handleCloseDele = () => setOpenDele(false);

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
    getAllUser();
  }, [reload, page, limit]);

  const getAllUser = async () => {
    try {
      const responsive = await axios.get<UserResponse>(
        `http://localhost:7777/api/users/?name=${search}&Page=${page}&currenPage=${limit}`
      );
      setListUsers(responsive.data.results);
      setTotalPages(responsive.data.TotalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (row: User): void => {
    setIsEdit(true);
    setForm({
      _id: row._id,
      name: row.name,
      email: row.email,
      role: row.role,
      image: row.image,
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
        // Update user
        const payload = {
          name: form.name,
          email: form.email,
          role: form.role,
          image: form.image,
          ...(form.password ? { password: form.password } : {}),
        };
        await axios.patch(`http://localhost:7777/api/users/?id=${form._id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alerts("Cập nhật user thành công!", "success");
      } else {
        // Create user
        await axios.post("http://localhost:7777/api/users/", form, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alerts("Thêm user thành công!", "success");
      }
      setReload((prev) => !prev);
      resetForm();
      handleClose();
    } catch (error: any) {
      alerts(error?.response?.data?.message || "Có lỗi xảy ra", "error");
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!dele) return;
    try {
      await axios.delete(`http://localhost:7777/api/users/${dele}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alerts("Xóa user thành công!", "success");
      setReload((prev) => !prev);
    } catch (error: any) {
      alerts(error?.response?.data?.message || "Lỗi khi xóa", "error");
      console.error(error);
    }
    handleCloseDele();
  };

  return (
    <div>
      <div className="flex justify-between px-28">
        <h1 className="text-3xl font-semibold">Manager User</h1>
        <Button type="button" variant="outlined" onClick={(e) => handleOpen(e)}>
          Thêm User
        </Button>
      </div>
      <div className="overflow-y-auto h-[450px] rounded-2xl shadow-lg border border-gray-200 mt-2">
        <Table 
          listUsers={listUsers} 
          handleEdit={handleEdit} 
          setDele={setDele} 
          setOpenDele={setOpenDele} 
        />
        <ModalUser
          isOpen={isOpen}
          onClose={handleClose}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          isEdit={isEdit}
        />
        <ModalConfirmDelete
          isOpen={openDele}
          onClose={handleCloseDele}
          onConfirm={handleDelete}
          handleClose={handleCloseDele}
        />
        <Paginations
          totalPages={TotalPages}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
}

export default Users;
