import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserData } from "../Context/UserContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useBookInfoViewModel } from "../ViewsModel/BookInforVM";
import { useCommentsViewModel } from "../ViewsModel/CommentVM";

export const BookInfo = () => {
  const { BookID, userData } = useUserData();
  const navigation = useNavigation();
  const { bookData, loading, fetchBookData } = useBookInfoViewModel();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [commentText, setCommentText] = useState<string>("");
  const { comments, loadingComment, error, submitComment } = useCommentsViewModel(BookID);
  
  // Tạo ref cho ScrollView để cuộn tới cuối
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchBookData(BookID);
  }, [BookID]);

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
  const truncatedDescription = description.length > 100 ? description.substring(0, 100) + "..." : description;

  const handleAddComment = () => {
    if (commentText.trim()) {
      submitComment(userData, commentText);
      setCommentText("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace("Inapp")} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* ScrollView container */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollViewRef} // Thêm ref vào ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingBottom: 100 }} // Thêm khoảng trống để cuộn thoải mái
        >
          <View style={styles.bookInfoContainer}>
            <Image source={{ uri: img_link }} style={styles.bookImage} />
            <View style={styles.textInfoContainer}>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Tác giả:</Text> {author}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Thể loại:</Text> {Array.isArray(genres) ? genres.join(", ") : genres}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Số chương:</Text> {latest_chapter_number}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ReadChapter")}>
              <Text style={styles.buttonText}>Đọc Truyện</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ListOfChapter")}>
              <Text style={styles.buttonText}>DS Chương</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            {showFullDescription ? description : truncatedDescription}
          </Text>
          {description.length > 100 && (
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.showMore}>
                {showFullDescription ? "Thu gọn" : "Xem thêm"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Bình luận */}
          <View style={styles.commentHeader}>
            <Text style={styles.commentHeaderText}>Bình Luận</Text>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
          {loadingComment ? (
            <Text style={styles.errorText}>Loading comments...</Text>
          ) : (
            comments.map((item, index) => (
              <View key={index} style={styles.commentItem}>
                <Text style={styles.commentUser}>{item.userID}</Text>
                <Text style={styles.commentContent}>{item.content}</Text>
                <Text style={styles.commentTimestamp}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Input comment section */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="Viết bình luận..."
              value={commentText}
              onChangeText={setCommentText}
              onFocus={() => {
                // Cuộn tới cuối ngay khi người dùng nhấn vào TextInput
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
              <Text style={styles.sendButtonText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    flex: 1,
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
    marginRight: 16,
  },
  textInfoContainer: {
    flex: 1,
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
  showMore: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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

  // Styles for KeyboardAvoidingView
  keyboardAvoidingContainer: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  commentHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  commentContent: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
    marginBottom: 10,
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#999",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#1a73e8",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookInfo;