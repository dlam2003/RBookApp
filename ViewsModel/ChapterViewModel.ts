import { RouteProp, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Chapter } from "../models/ChapterDB";

interface BookInfoParams {
  title: string;
  author: string;
  genre: string[];
  description: string;
  latest_chapter_number: number;
}

interface BookInfoViewModelData {
  title: string;
  author: string;
  genre: string[];
  description: string;
  chapters: Chapter[];
}

export const useBookInfoViewModel = () => {
  const route = useRoute<RouteProp<{ params: BookInfoParams }, "params">>();
  const [bookData, setBookData] = useState<BookInfoViewModelData | null>(null);

  useEffect(() => {
    const { title, author, genre, description, latest_chapter_number } = route.params;

    const chapters: Chapter[] = Array.from({ length: latest_chapter_number }, (_, i) => ({
      id: `${i + 1}`,
      title: `Chapter ${i + 1}`,
      BookID: "123", // Giá trị mẫu
      ChapterNumber: i + 1,
      contents: `Nội dung chương ${i + 1}`, // Nội dung giả lập
    }));

    setBookData({
      title,
      author,
      genre,
      description,
      chapters,
    });
  }, [route.params]);

  return bookData;
};
