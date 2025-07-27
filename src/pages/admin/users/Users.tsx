import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import Paginations from "../layouts/Pagination";
import ModalUser from "./ModalUser";
import Table from "./Table";
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
    email: "",
    password: "",
    role: "USERS",
    image:
      "https://assets.dryicons.com/uploads/icon/svg/5609/00c2616e-3746-48be-ac80-a4b8add412b5.svg",
  };

  interface FormType {
    email: string;
    password: string;
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const handleClose = () => setIsOpen(false);
  const today: string = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<FormType>({
    ...Form,
    createdAt: today,
    updatedAt: today,
  });
  const resetForm = () => {
    setForm({
      ...Form,
      createdAt: today,
      updatedAt: today,
    });
  };

  const handleEdit = (row: User): void => {
    console.log(row);
  };

  useEffect(() => {
    getAllUser();
  }, [reload]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //   await axios.post("http://localhost:7777/api/users/", form);
      console.log("lạhsdo");

      setReload((prev) => !prev);
      resetForm();
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };
  const handleOpen = (e: React.FormEvent): void => {
    e.preventDefault();
    setIsOpen(true);
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
        <Table listUsers={listUsers} handleEdit={handleEdit} />
        <ModalUser
          isOpen={isOpen}
          onClose={handleClose}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
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
