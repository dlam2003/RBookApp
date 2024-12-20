import { useState } from "react";
import { getBookInfor } from "../models/BookDB";

export const useBookInfoViewModel = () => {
  const [bookData, setBookData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookData = async (BookID: string) => {
    try {
      setLoading(true);
      const data = await getBookInfor(BookID);
      setBookData(data);
    } catch (error) {
      console.error("Error fetching book data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { bookData, loading, fetchBookData };
};