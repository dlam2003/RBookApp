import React, { createContext, useContext, useState, ReactNode } from "react";

// Tạo Context với kiểu dữ liệu cho phép `userData` là string và `BookID` là string | null
interface UserContextType {
  userData: string | null;
  BookID: string | null;
  ChapNumber : string | null;
  setUserData: (userData: string, BookID: string | null, ChapNumber : string | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom Hook để truy cập Context
export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
};

// Provider để bao bọc các thành phần của ứng dụng
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<string | null>(null);
  const [BookID, setBookID] = useState<string | null>(null);
  const [ChapNumber, setChapNumber] = useState <string | null>(null);

  const updateUserData = (username: string, bookID: string | null, chapNumber : string | null) => {
    setUserData(username);
    setBookID(bookID);
    setChapNumber(chapNumber);
  };

  return (
    <UserContext.Provider value={{ userData, BookID, ChapNumber, setUserData: updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};
