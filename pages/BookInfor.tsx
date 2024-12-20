import React from "react";
import { Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserData } from "../Context/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useBookInfoViewModel } from "../ViewsModel/BookInforVM";

export const BookInfo = () => {
  const { BookID } = useUserData();
  const navigation = useNavigation();
  const { bookData, loading, fetchBookData } = useBookInfoViewModel();
  React.useEffect(() => {
    fetchBookData(BookID);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#39B78D" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!bookData) {
    return (
      <View style={styles.container}>
        <Text>No book data available</Text>
      </View>
    );
  }

  const { title, author, genres, description, latest_chapter_number, img_link } = bookData;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace("Inapp")} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      <ScrollView style={styles.body}>
        <View style={styles.bookInfoContainer}>
          <Image
            source={{ uri: img_link }}
            style={styles.bookImage}
          />
          <View style={styles.textInfoContainer}>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Tác giả:</Text> {author}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Thể loại:</Text>{" "}
              {Array.isArray(genres) ? genres.join(", ") : genres}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Số chương:</Text> {latest_chapter_number}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ReadChapter")}
          >
            <Text style={styles.buttonText}>Đọc Truyện</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ListOfChapter")}
          >
            <Text style={styles.buttonText}>DS Chương</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CommentScreen")}
          >
            <Text style={styles.buttonText}>Bình Luận</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{description}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a73e8",
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  body: {
    padding: 16,
  },
  bookInfoContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  bookImage: {
    width: 150,
    height: 200,
    marginBottom: 10,
    marginRight: 16,  // Add space between image and text
  },
  textInfoContainer: {
    flex: 1,  // Make the text section take up the remaining space
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    lineHeight: 22,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  button: {
    backgroundColor: "#1a73e8",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});