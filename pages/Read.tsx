import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, StyleSheet, Alert, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { useUserData } from "../Context/UserContext";
import { AddRecentlyRead, getChapter, getContentFromChapterNumber, getCurrentChap, getLastestChapterNumber } from "../models/ChapterDB";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons as Icon } from "@expo/vector-icons";

export const ReadScreen = ({ navigation }: any) => {
  const { userData, BookID , ChapNumber, setUserData} = useUserData();
  const [content, setContent] = useState<string | null>(null);
  const [chapterTitle, setChapterTitle] = useState<string | null>(null);
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(false);

  const fetchChapterContent = async () => {
    if (!BookID) {
      console.error("BookID is not available");
      setContent("BookID is missing. Cannot fetch chapter content.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      let chapterData;
      if(ChapNumber === null){
        chapterData = await getChapter(BookID, userData);
        const CurrentChapter = await getCurrentChap(BookID, userData);
        setCurrentChapter(CurrentChapter);
      } else{
        chapterData = await getContentFromChapterNumber(BookID, userData, ChapNumber);
        setCurrentChapter(ChapNumber);
        setUserData(userData, BookID , null);
      }
      
      if (chapterData) {
        const formattedContent = (chapterData.content || "No content available.")
          .replace(/\.{3}/g, "{ELLIPSIS}") // Thay thế "..." bằng một placeholder
          .replace(/\.\s*/g, ".\n\n") // Thay thế dấu "." thông thường
          .replace(/{ELLIPSIS}/g, "...") // Thay thế placeholder thành "..."
          .replace(/:-/g, ": \n\n -")
          .replace(/!/g, "! \n\n")
          .replace(/\?/g, "? \n\n");
      
        setContent(formattedContent);
        setChapterTitle(chapterData.Chapter_Title || "Untitled Chapter");
      }      
    } catch (error) {
      console.error("Error fetching chapter content: ", error);

      setContent("Failed to load content. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterContent();
  }, [currentChapter]);

  const handleScroll = ({ nativeEvent }: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isEndReached && !isAtEnd) {
      setIsAtEnd(true);
      handleNextChapter();
    }
  };

  const handleNextChapter = async () => {
    setTimeout(() => setIsAtEnd(false), 200);
    const lastest_chapter_number = await getLastestChapterNumber(BookID);
    
    if (currentChapter < lastest_chapter_number) {
      setCurrentChapter(currentChapter + 1);
      await AddRecentlyRead(BookID, userData, currentChapter + 1);
    } else {
      Alert.alert("Thông báo", "Đã đọc hết truyện!");
    }
  };

  const handlePreviousChapter = async () => {
    if (currentChapter > 1) {
      const previousChapter = currentChapter - 1;
      setCurrentChapter(previousChapter);
      await AddRecentlyRead(BookID, userData, previousChapter);
    } else {
      Alert.alert("Thông báo", "Đây là chương đầu tiên!");
    }
  };

  const toggleToolbar = () => {
    setIsToolbarVisible((prev) => !prev);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#39B78D" />
        <Text style={styles.loadingText}>Loading chapter content...</Text>
      </View>
    );
  }

  const NextToListChap = () => {
    // Lưu thông tin người dùng và BookID trước khi điều hướng
    navigation.navigate("ListOfChapter", {
      userData : userData,
      BookID: BookID,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={toggleToolbar}>
      <View style={styles.container}>
        {isToolbarVisible && (
          <View style={styles.toolbar}>
            <TouchableOpacity onPress={() => navigation.navigate("Read")} style={styles.toolbarButton}>
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePreviousChapter} style={styles.toolbarButton}>
              <Icon name="chevron-back" size={24} color="#fff" />
              <Text style={styles.toolbarText}>Chương trước</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => NextToListChap()} style={styles.toolbarButton}>
              <Icon name="list" size={24} color="#fff" />
              <Text style={styles.toolbarText}>Danh sách chương</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Text style={styles.chapterTitle}>{chapterTitle}</Text>
          <Text style={styles.textContent}>{content}</Text>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  toolbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1000,
    paddingTop: 40
  },
  toolbarButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbarText: {
    marginLeft: 4,
    color: "#fff",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
    paddingTop : 40,
    backgroundColor: "#FFFFCC",
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
    textAlign: "center",
  },
  textContent: {
    fontSize: 18,
    lineHeight: 28,
    color: "#444",
    textAlign: "justify",
    marginBottom: 16,
  },
});