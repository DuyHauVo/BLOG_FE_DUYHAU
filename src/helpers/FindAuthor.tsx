"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export function FindAuthor({ authorId }: { authorId: string }) {
  const [author, setAuthor] = useState<string>("Loading...");

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/users/show/${authorId}`
        );
        setAuthor(res.data?.name || "Unknown"); // tùy theo dữ liệu bạn trả về
      } catch (error) {
        setAuthor("Error");
        console.error(error);
      }
    };

    fetchAuthor();
  }, [authorId]);

  return <span>{author}</span>;
}

