import { ref, get } from "firebase/database";
import { database } from "./FireBase";

export const GetTittleBook = async (BookID : number) =>{
      const path = `book/${BookID}/title`;
      const snapshot = await get(ref(database, path));

      if(snapshot.exists())
            return snapshot.val();
      else
            return null;   
}

export const GetLastNumberChap = async (BookID : number) =>{
      const path = `book/${BookID}/latest_chapter_number`;
      const snapshot = await get(ref(database, path));

      if(snapshot.exists())
            return snapshot.val();
      else
            return null;   
}


export const GetListOfChap = async (BookID: number) => {
  // const LastNumberChap = await GetLastNumberChap(BookID);
  const LastNumberChap = 50; // Giả định số chương là 50
  const promises = [];

  for (let i = 1; i <= LastNumberChap; i++) {
    const path = `Chapter/${BookID}/Chương-${i}/Chapter_Title`;
    promises.push(get(ref(database, path))); // Thêm từng truy vấn vào mảng
  }
  
  const snapshots = await Promise.all(promises); // Đợi tất cả truy vấn hoàn thành
  const chapters = snapshots
    .map((snapshot) => (snapshot.exists() ? snapshot.val() : null))
    .filter((chapter) => chapter !== null); // Lọc các chương tồn tại

  return chapters;
};
  

export const getCurrentChap = async (userData: string, BookID: string): Promise<number | null> => {
  const RecentlyPath = `RecentlyRead/${userData}/${BookID}`;
  const snapshot = await get(ref(database, RecentlyPath));
    
  console.log("Data from Firebase:", snapshot.val());  // Log dữ liệu trả về từ Firebase
    
  if (snapshot.exists() && snapshot.val().lastReadChapter !== undefined) {
    console.log("Last read chapter:", snapshot.val().lastReadChapter);  // Log giá trị lastReadChapter
    return snapshot.val().lastReadChapter;
  } else {
    console.log("No data found or 'lastReadChapter' is undefined");
    return null;
  }
};