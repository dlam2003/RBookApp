import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { useBookViewModel } from "../ViewsModel/BookViewModel";
import { Book } from "../models/BookDB";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // You can use any icon library
import { useUserData } from "../Context/UserContext";

const HomeScreen = () => {
  const books = useBookViewModel();
  const navigation = useNavigation();
  const { setUserData } = useUserData();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { userData } = useUserData();

  const handlePressBook = (book: Book) => {
    const chapNumber = null;
    setUserData(userData, book.BookID, chapNumber);
    navigation.navigate("Read");
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(book.genres) && book.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>📚 Book Library</Text>
        <TouchableOpacity onPress={() => setIsSearchVisible(!isSearchVisible)} style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {isSearchVisible && (
        <TextInput
          style={styles.searchBar}
          placeholder="Search books, authors, or genres..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      )}

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.BookID}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.bookItem} onPress={() => handlePressBook(item)}>
            <Image
              source={{ uri: item.img_link || "https://via.placeholder.com/150" }}
              style={styles.bookImage}
            />
            <View style={styles.bookDetails}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookInfo}>
                Author: <Text style={styles.bookDetail}>{item.author}</Text>
              </Text>
              <Text style={styles.bookInfo}>
                Chapters: <Text style={styles.bookDetail}>{item.latest_chapter_number}</Text>
              </Text>
              <Text style={styles.bookInfo}>
                Genres: <Text style={styles.bookDetail}>
                  {Array.isArray(item.genres) ? item.genres.join(", ") : "N/A"}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    paddingTop : 50,
    backgroundColor: "#1e3a8a",
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  searchIcon: {
    backgroundColor: "#3b82f6",
    borderRadius: 50,
    padding: 8,
  },
  searchBar: {
    height: 40,
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  bookItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  bookDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e40af",
  },
  bookInfo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  bookDetail: {
    fontWeight: "bold",
    color: "#333",
  },
});

export default HomeScreen;
