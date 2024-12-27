import { set, ref, get } from "firebase/database";
import { database } from "./FireBase";

export interface Book {
  BookID: string;
  title: string;
  author: string;
  latest_chapter_number : number;
  genre : string[];
  description : string;
  img_link : string;
}

export const getBooks = async () : Promise<Record<string, Book> | null> => {
  try {
    const snapshot = await get(ref(database, 'book/'));
    if (snapshot.exists()) {
      return snapshot.val() as Record<string, Book>;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error getting books: ", error);
    return null;
  }
};

export const getBookInfor = async (BookID : number) => {
  try {
    const path = `/book/${BookID}`
    const snapshot = await get(ref(database, path));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error getting books: ", error);
    return null;
  }
};