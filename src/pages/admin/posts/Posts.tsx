import Button from "@mui/material/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import Table from "./Table";
import Paginations from "../layouts/Pagination";

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

  const [listPost, setListPost] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [TotalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = async () => {
    try {
      const responsive = await axios.get<PostsResponse>(
        `http://localhost:7777/api/posts/?name=${search} &currenPage=${limit}&Page=${page}`
      );
      console.log(responsive.data);

      setListPost(responsive.data.results);
      setTotalPages(responsive.data.TotalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (row: Post): void => {
    console.log(row);
  };
  return (
    <div>
      <div className="flex justify-between items-center px-28 pb-5">
        <h1 className="text-3xl font-semibold">Manager Post</h1>
        <Button
          type="button"
          variant="outlined"
          // onClick={(e) => handleOpen(e)}
        >
          Thêm Post
        </Button>
      </div>
      <Table listPost={listPost} handleEdit={handleEdit} />
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
