import { useState, useEffect } from 'react';
import { DelChapFRecent, GetRecentlyListBook } from '../models/ChapterDB';

export interface Book {
  BookID: string;
  title: string;
  latest_chapter_number: number;
  lastReadChapter: number;
  img_link: string;
}

export const useRecentReadsViewModel = (userData: string | null) => {
  const [recentReads, setRecentReads] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

  const fetchRecentReads = async () => {
    if (!userData) return;
    try {
      setLoading(true);
      const result = await GetRecentlyListBook(userData);
      if (result) {
        setRecentReads(result);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sách vừa đọc: ', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (bookID: string) => {
    if (!userData) return;
    try {
      setRecentReads((prev) => prev.filter((book) => book.BookID !== bookID));
      await DelChapFRecent(userData, bookID);
    } catch (error) {
      console.error('Lỗi khi xóa sách: ', error);
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
  };

  useEffect(() => {
    fetchRecentReads();
  }, [userData]);

  return {
    recentReads,
    loading,
    isDeleteMode,
    fetchRecentReads,
    deleteBook,
    toggleDeleteMode,
  };
};