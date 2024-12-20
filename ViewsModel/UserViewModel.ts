import { useState, useEffect } from "react";
import { getUser } from "../models/UserData";

export const useUserViewModel = (username: string, password: string) => {
  const [user, setUser] = useState<any>(null);  // Set kiểu dữ liệu cho user
  const [loading, setLoading] = useState<boolean>(false);  // Thêm trạng thái loading
  const [error, setError] = useState<string | null>(null);  // Thêm trạng thái lỗi

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);  // Reset lỗi trước khi gọi lại API
        const userData = await getUser(username, password);  // Lấy dữ liệu người dùng
        if (userData) {
          setUser(userData);  // Nếu tìm thấy, set user
        } else {
          setError("User not found!");  // Nếu không có user, set lỗi
        }
      } catch (err) {
        setError("Error fetching user data!");  // Nếu có lỗi trong quá trình fetch
      } finally {
        setLoading(false);  // Đặt trạng thái loading thành false khi kết thúc
      }
    };

    if (username && password) {
      fetchUser();  // Chỉ gọi fetchUser nếu username và password không rỗng
    }
  }, [username, password]);  // Hook chạy lại khi username hoặc password thay đổi

  return { user, loading, error };  // Trả về user, loading, error
};
