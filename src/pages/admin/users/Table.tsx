interface type {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
interface TableProps {
  listUsers: type[];
  handleEdit: (user: type) => void;
}
function Table({ listUsers, handleEdit }: TableProps) {
  return (
    <table className="min-w-full bg-white text-sm text-left text-gray-700 rounded-2xl overflow-hidden">
      <thead className="bg-gradient-to-r from-indigo-200 to-indigo-400 text-gray-900 font-bold rounded-t-2xl">
        <tr>
          <th className="px-6 py-3 text-center rounded-tl-2xl">#</th>
          <th className="px-6 py-3 text-center">_id</th>
          <th className="px-6 py-3 text-center">Image</th>

          <th className="px-6 py-3 text-center">Email</th>
          <th className="px-6 py-3 text-center">Role</th>

          <th className="px-6 py-3 text-center">createdAt</th>
          <th className="px-6 py-3 text-center">updatedAt</th>

          <th className="px-6 py-3 text-center rounded-tr-2xl">Action</th>
        </tr>
      </thead>
      <tbody>
        {listUsers?.map((row, index) => (
          <tr
            key={index}
            className="hover:bg-indigo-50 transition duration-200"
          >
            <td className="px-6 py-3 text-center">{index + 1}</td>
            <td className="px-6 py-3 text-center">{row._id}</td>
            <td className="px-6 py-3 text-center">
              <img
                className="mx-auto w-10 h-10 rounded-full"
                src={row.image}
                alt=""
              />
            </td>
            <td className="px-6 py-3 text-center">{row.email}</td>
            <td className="px-6 py-3 text-center">{row.role}</td>

            <td className="px-6 py-3 text-center">
              {new Date(row.createdAt).toLocaleDateString("vi-VN")}
            </td>
            <td className="px-6 py-3 text-center">
              {new Date(row.updatedAt).toLocaleDateString("vi-VN")}
            </td>
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
  );
}

export default Table;
