import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserData } from "../Context/UserContext";

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userData } = useUserData(); 
  console.log("UserData in Profile:", userData);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    navigation.replace("Auth");
  };

  // Hàm chuyển đến HomeScreen khi bấm vào mục danh sách truyện
  const handleNavigateHome = () => {
    navigation.navigate("Home");
  };

  // Hàm chuyển đến màn hình truyện vừa đọc
  const handleNavigateReading = () => {
    navigation.navigate("ShowListChapter");
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={require("C:/Users/Tung Lam/RN/RBookApp/img/user.png")}
          style={styles.avatar}
        />
        <Text style={styles.username}>{userData}</Text>
        {/* Nút Đăng xuất */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Story Shelf */}
      <View style={styles.storyShelf}>
        <TouchableOpacity onPress={handleNavigateHome}>
          <Text style={styles.shelfTitle}>Danh Sách Truyện</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Tủ Truyện</Text>

        <TouchableOpacity style={styles.shelfItem} onPress={handleNavigateReading}>
          <Text style={styles.shelfItemText}>Truyện Vừa Đọc</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#87CEEB", // Nền xanh dương nhạt
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ff4444",
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  storyShelf: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  shelfTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  shelfItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  shelfItemText: {
    fontSize: 18,
    color: "#1E90FF",
  },
});