import axios from "axios";
import { FindAuthor } from "../../../helpers/FindAuthor";

type Post = {
  _id: string;
  title: string;
  content: string;
  author: string;
  // image: string;
  createdAt: string;
  updatedAt: string;
};

interface TableProps {
  listPost: Post[];
  handleEdit: (user: Post) => void;
  page: number;
  limit: number;
  setDele: React.Dispatch<React.SetStateAction<string | null>>;
  setOpenDele: React.Dispatch<React.SetStateAction<boolean>>;
}
const findAuthor = async (id: string) => {
  try {
    const authorObject = await axios.get(
      `http://localhost:7777/api/users/show/${id}`
    );
    console.log(authorObject);

    return {};
  } catch (error) {
    console.log(error);
  }
};
function Table({ listPost, handleEdit, page, limit, setDele,setOpenDele }: TableProps) {
  return (
    <table className="min-w-full bg-white text-sm text-left text-gray-700 rounded-2xl overflow-hidden">
      <thead className="bg-gradient-to-r from-indigo-200 to-indigo-400 text-gray-900 font-bold rounded-t-2xl">
        <tr>
          <th className="px-6 py-3 text-center rounded-tl-2xl">#</th>
          <th className="px-6 py-3 text-center">_id</th>
          <th className="px-6 py-3 text-center">Title</th>
          <th className="px-6 py-3 text-center">Content</th>
          <th className="px-6 py-3 text-center">Author</th>
          <th className="px-6 py-3 text-center">createdAt</th>
          <th className="px-6 py-3 text-center">updatedAt</th>

          <th className="px-6 py-3 text-center rounded-tr-2xl">Action</th>
        </tr>
      </thead>
      <tbody>
        {listPost?.map((row, index) => (
          <tr
            key={index}
            className="hover:bg-indigo-50 transition duration-200"
          >
            <td className="px-6 py-3 text-center">
              {(page - 1) * limit + index + 1}
            </td>
            <td className="px-6 py-3 text-center">{row._id}</td>
            <td className="px-6 py-3 text-left">
              <div className="line-clamp-2 max-w-[200px]">{row.title}</div>
            </td>
            <td className="px-6 py-3 text-left">
              <div className="line-clamp-2 max-w-[300px]">{row.content}</div>
            </td>
            <td className="px-6 py-3 text-center">
              <FindAuthor authorId={row.author} />
            </td>

            <td className="px-6 py-3 text-center">
              {new Date(row.createdAt).toLocaleDateString("vi-VN")}
            </td>
            <td className="px-6 py-3 text-center">
              {new Date(row.updatedAt).toLocaleDateString("vi-VN")}
            </td>
            <td className="px-6 py-3 flex gap-2.5 justify-center">
              {/* edit */}
              <button
                onClick={() => handleEdit(row)}
                className="group w-11 h-11 rounded-full flex items-center justify-center bg-[#e0f2fe] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white transition-all duration-300 shadow"
              >
                <i className="fas fa-pen transform transition-transform duration-300"></i>
              </button>
              {/* delete */}
              <button
                onClick={() => {
                  setOpenDele(true);
                  setDele(row._id);
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
  );
}

export default Table;
