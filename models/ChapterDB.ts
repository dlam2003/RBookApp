import { set, ref, get, remove } from "firebase/database";
import { database } from "./FireBase";

export interface Chapter {
  BookID: string;
  ChapterNumber : number,
  content : string
}

export const AddRecentlyRead = async (BookID: string, userData: string, ChapterNumber: number) => {
  try {
    // Đường dẫn đến nhánh RecentlyRead trong Firebase
    const chapterPath = `/RecentlyRead/${userData}/${BookID}`;

    // Thêm dữ liệu vào Firebase
    await set(ref(database, chapterPath), {
      lastReadChapter: ChapterNumber,
    });

    console.log("Successfully added RecentlyRead:", { BookID, userData, ChapterNumber });
  } catch (error) {
    console.error("Error adding recently read data: ", error);
  }
};

export const getCurrentChap = async (BookID: string, userData: string) : Promise<number | null> => {
  const RecentlyPath = `RecentlyRead/${userData}/${BookID}`;
  const snapshot = await get(ref(database, RecentlyPath));
  if (snapshot.exists()) 
    return snapshot.val().lastReadChapter;
  else 
    return null;
}

export const getLastestChapterNumber = async (BookID: string) => {
  if (!BookID) {
    console.error("BookID is missing or invalid.");
    return null;
  }

  try {
    const RecentlyPath = `book/${BookID}`;
    const snapshot = await get(ref(database, RecentlyPath));

    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data && typeof data.latest_chapter_number === "string") {
        console.log("Latest chapter number:", data.latest_chapter_number);
        return parseInt(data.latest_chapter_number, 10);
      } else {
        console.error("Invalid data structure or missing latest_chapter_number:", data);
        return null;
      }
    } else {
      console.error("No data found for BookID:", BookID);
      return null;
    }
  } catch (error) {
    console.error("Error fetching latest chapter number:", error);
    return null;
  }
};



export const getChapter = async (BookID: string, userData: string): Promise<string | null> => {
  try {
    const snapshot = await getCurrentChap(BookID, userData);
    
    if (snapshot != null) {
      const lastReadChapter = snapshot;
      const chapterPath = `Chapter/${BookID}/Chương-${lastReadChapter}`;
      const result = await get(ref(database, chapterPath));

      return result.exists() ? result.val() : null;
    } else {

      await AddRecentlyRead(BookID, userData, 1);
      
      const chapterPath = `Chapter/${BookID}/Chương-1`;
      const result = await get(ref(database, chapterPath));

      return result.exists() ? result.val() : null;
    }
  } catch (error) {
    console.error("Error getting chapter content: ", error);
    return null;
  }
};

export const getContentFromChapterNumber = async (
  BookID: string, 
  userData: string, 
  ChapterNumber : string) : Promise<string | null> => {
  try {
    const chapterPath = `Chapter/${BookID}/Chương-${ChapterNumber}`;
    const result = await get(ref(database, chapterPath));
    const chapterNumberAsNumber = parseInt(ChapterNumber, 10);
    await AddRecentlyRead(BookID, userData, chapterNumberAsNumber);

    return result.exists() ? result.val() : null;
  } catch (error) {
    console.error("Error getting chapter content: ", error);
    return null;
  }
};

export const GetRecentlyListBook = async (userData: string) => {
  try {
    const recentlyPath = `RecentlyRead/${userData}`;
    const recentlySnapshot = await get(ref(database, recentlyPath));

    if (!recentlySnapshot.exists()) {
      console.log("Không tìm thấy dữ liệu RecentlyRead cho người dùng:", userData);
      return [];
    }

    const recentlyData = recentlySnapshot.val();
    const bookIDs = Object.keys(recentlyData);

    const result = [];

    for (const BookID of bookIDs) {
      const lastReadChapter = recentlyData[BookID]?.lastReadChapter || 0;

      const bookPath = `book/${BookID}`;
      const bookSnapshot = await get(ref(database, bookPath));

      if (bookSnapshot.exists()) {
        const bookData = bookSnapshot.val();

        result.push({
          BookID,
          title: bookData?.title || "Tiêu đề không xác định",
          latest_chapter_number: bookData?.latest_chapter_number || 0,
          lastReadChapter,
          img_link : bookData?.img_link
        });
      } else {
        console.warn(`Không tìm thấy thông tin sách cho BookID: ${BookID}`);
        result.push({
          BookID,
          title: "Tiêu đề không xác định",
          latest_chapter_number: 0,
          lastReadChapter,
        });
      }
    }
    console.log("Danh sách sách đọc gần đây:", result);
    return result;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách đọc gần đây: ", error);
    return null;
  }
};

export const DelChapFRecent = async (UserName : string , BookID : string) => {
  const path = `RecentlyRead/${UserName}/${BookID}`
  try {
    await remove(ref(database, path));
    console.log(`Đã xóa sách với BookID: ${BookID} của người dùng: ${UserName}`);
  } catch (error) {
    console.error("Lỗi khi xóa sách: ", error);
    throw error; // Ném lỗi nếu có
  }
}