import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import type { User } from "../../../helpers/Types";
import axios from "axios";
import Paginations from "../layouts/Pagination";
function Users() {
  const [listUsers, setListUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [TotalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  interface DichVu {
    maloaidv: string;
    tenloaidv: string;
  }
  const listDichVu = [
    { maloaidv: "DV001", tenloaidv: "Khám tổng quát" },
    { maloaidv: "DV002", tenloaidv: "Xét nghiệm máu" },
    { maloaidv: "DV003", tenloaidv: "Chụp X-quang" },
    { maloaidv: "DV004", tenloaidv: "Nội soi dạ dày" },
    { maloaidv: "DV005", tenloaidv: "Siêu âm ổ bụng" },
    { maloaidv: "DV006", tenloaidv: "Đo điện tim" },
    { maloaidv: "DV007", tenloaidv: "Khám tai - mũi - họng" },
    { maloaidv: "DV008", tenloaidv: "Khám mắt" },
    { maloaidv: "DV009", tenloaidv: "Khám da liễu" },
    { maloaidv: "DV010", tenloaidv: "Tiêm phòng" },
  ];
  const handleEdit = (row: DichVu): void => {
    console.log(row);
  };
  useEffect(() => {
    getAllUser();
  }, []);
  const getAllUser = async () => {
    try {
      const responsive = await axios.get<User[]>(
        `http://localhost:7777/api/users/?name=${search}&Page=${page}&currenPage=${limit}`
      );
      console.log(responsive.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="flex justify-between px-28">
        <h1 className="text-3xl font-semibold">Manager User</h1>
        <Button variant="outlined">Thêm User</Button>
      </div>
      <div className="overflow-y-auto h-[450px] rounded-2xl shadow-lg border border-gray-200 mt-2">
        <table className="min-w-full bg-white text-sm text-left text-gray-700 rounded-2xl overflow-hidden">
          <thead className="bg-gradient-to-r from-indigo-200 to-indigo-400 text-gray-900 font-bold rounded-t-2xl">
            <tr>
              <th className="px-6 py-3 text-center rounded-tl-2xl">#</th>
              <th className="px-6 py-3 text-center">Mã</th>
              <th className="px-6 py-3 text-center">Tên Dịch Vụ</th>
              <th className="px-6 py-3 text-center rounded-tr-2xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {listDichVu?.map((row, index) => (
              <tr
                key={row.maloaidv}
                className="hover:bg-indigo-50 transition duration-200"
              >
                <td className="px-6 py-3 text-center">{index + 1}</td>
                <td className="px-6 py-3 text-center">{row.maloaidv}</td>
                <td className="px-6 py-3 text-center">{row.tenloaidv}</td>
                <td className="px-6 py-3 flex gap-2.5 justify-center">
                  <button
                    onClick={() => handleEdit(row)}
                    className="group w-11 h-11 rounded-full flex items-center justify-center bg-[#e0f2fe] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white transition-all duration-300 shadow"
                  >
                    <i className="fas fa-pen transform transition-transform duration-300"></i>
                  </button>
                  <button
                    onClick={() => {
                      // setOpenDele(true);
                      // setDele(row.maloaidv);
                    }}
                    className="group w-11 h-11 rounded-full flex items-center justify-center bg-[#fee2e2] text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-all duration-300 shadow"
                  >
                    <i className="fas fa-trash transform transition-transform duration-300"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
