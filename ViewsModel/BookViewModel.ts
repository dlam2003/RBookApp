import { useState, useEffect } from "react";
import { getBooks, Book } from "../models/BookDB";

export const useBookViewModel = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const booksData = await getBooks();
      if (booksData) {
        setBooks(Object.values(booksData));
      }
    };

    fetchBooks();
  }, []);

  return books;
};
