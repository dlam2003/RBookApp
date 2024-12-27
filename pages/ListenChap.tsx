import React, { useState, useRef } from "react";
import {
      Text,
      View,
      ActivityIndicator,
      StyleSheet,
      Alert,
      TouchableOpacity,
      TouchableWithoutFeedback,
      ScrollView
} from "react-native";
import { useUserData } from "../Context/UserContext";
import { AddRecentlyRead, getLastestChapterNumber } from "../models/ChapterDB";
import { Ionicons as Icon } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { ReadChapterViewModel } from "../ViewsModel/ReadChapVM";

export const ListenScreen = ({ navigation }: any) => {
      const { userData, BookID, ChapNumber } = useUserData();
      const [isAtEnd, setIsAtEnd] = useState<boolean>(false);
      const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(false);

      const {
            content,
            chapterTitle,
            currentChapter,
            lastSentenceIndex,
            loading,
            setCurrentChapter,
            updateRecentlyRead,
      } = ReadChapterViewModel(BookID, userData, ChapNumber);

      const [lastListenIndex, SetlastListenIndex] = useState(lastSentenceIndex)
      const [isSpeaking, setIsSpeaking] = useState(false);
      const speakingRef = useRef<boolean>(false);
      const [isScrolling, setIsScrolling] = useState<boolean>(false);
      const timeoutRef = useRef<NodeJS.Timeout | null>(null);

      
      const handleScroll = ({ nativeEvent }: any) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

            if (isEndReached && !isAtEnd) {
                  setIsAtEnd(true);
                  handleNextChapter();
            }
            setIsScrolling(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => setIsScrolling(false), 200); 
      };

      const handleNextChapter = async () => {
            if (isSpeaking) stopSpeaking();
            setTimeout(() => setIsAtEnd(false), 200);

            const lastestChapterNumber = await getLastestChapterNumber(BookID);
            if (currentChapter < lastestChapterNumber) {
                  setCurrentChapter(currentChapter + 1);
                  await AddRecentlyRead(BookID, userData, currentChapter + 1, 0);
            } else {
                  Alert.alert("Thông báo", "Đã đọc hết truyện!");
            }
      };

      const handlePreviousChapter = async () => {
            if (isSpeaking) stopSpeaking();
            if (currentChapter > 1) {
                  setCurrentChapter(currentChapter - 1);
                  await AddRecentlyRead(BookID, userData, currentChapter - 1, 0);
            } else {
                  Alert.alert("Thông báo", "Đây là chương đầu tiên!");
            }
      };

      const toggleToolbar = () => {
            setIsToolbarVisible((prev) => !prev);
      };

      const startSpeaking = () => {
            speakingRef.current = true;
            setIsSpeaking(true);

            const sentences = (content || "Không có nội dung")
                  .replace(/-/, "")
                  .split(/([.!?]+)/)
                  .filter((sentence) => sentence.trim() !== "");
            let currentIndex = lastListenIndex;

            const speakNextSentence = () => {
                  if (currentIndex < sentences.length && speakingRef.current) {
                        const sentence = sentences[currentIndex].replace(/[.!?]$/, "").trim();

                        Speech.speak(sentence, {
                              language: "vi",
                              rate: 1.05,
                              pitch: 1.0,
                              onDone: () => {
                                    if (speakingRef.current) {
                                          currentIndex++;
                                          SetlastListenIndex(currentIndex)
                                          speakNextSentence();
                                    }
                              },
                        });
                  }
            };

            speakNextSentence();
      };

      const stopSpeaking = async () => {
            Speech.stop();
            speakingRef.current = false;
            setIsSpeaking(false);
            updateRecentlyRead(lastListenIndex);
            await AddRecentlyRead(BookID, userData, currentChapter, lastSentenceIndex);
      };

      const goToChapterList = () => {
            Speech.stop();
            speakingRef.current = false;
            setIsSpeaking(false);
            navigation.navigate("ListOfChapter");
      };

      if (loading) {
            return (
                  <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#39B78D" />
                        <Text style={styles.loadingText}>Loading chapter content...</Text>
                  </View>
            );
      }

      const toggleSpeaking = () => {
            if (isSpeaking) {
                  stopSpeaking();
            } else {
                  startSpeaking();
            }
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
                                    <TouchableOpacity onPress={goToChapterList} style={styles.toolbarButton}>
                                          <Icon name="list" size={24} color="#fff" />
                                    </TouchableOpacity>
                              </View>
                        )}

                        <ScrollView style={styles.scrollView} onScroll={handleScroll} scrollEventThrottle={16}>
                              <Text style={styles.chapterTitle}>{chapterTitle}</Text>
                              <Text style={styles.textContent}>{content}</Text>
                        </ScrollView>

                        <TouchableOpacity
                              style={[styles.fixedButton, { opacity: isScrolling ? 0.5 : 1 }]}
                              onPress={toggleSpeaking}
                        >
                              <Icon name={isSpeaking ? "volume-mute" : "volume-high"} size={24} color="#fff" />
                        </TouchableOpacity>
                  </View>
            </TouchableWithoutFeedback>
      );
};

const styles = StyleSheet.create({
      container: { 
            flex: 1, 
            backgroundColor: "#fff" 
      },
      loadingContainer: { 
            flex: 1, 
            justifyContent: "center", 
            alignItems: "center", 
            backgroundColor: "#f8f9fa" 
      },
      loadingText: { 
            marginTop: 16, 
            fontSize: 16, 
            color: "#555" 
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
            paddingTop: 40,
      },
      toolbarButton: {
            flexDirection: "row",
            alignItems: "center"
      },
      toolbarText: {
            marginLeft: 4,
            color: "#fff",
            fontSize: 16
      },
      scrollView: {
            flex: 1,
            padding: 16,
            paddingTop: 40,
            backgroundColor: "#FFFFCC"
      },
      chapterTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#222",
            marginBottom: 16,
            textAlign: "center"
      },
      textContent: {
            fontSize: 18,
            lineHeight: 28,
            color: "#444",
            textAlign: "justify",
            marginBottom: 16
      },
      fixedButton: {
            position: "absolute",
            bottom: 16,
            top : "5%",
            width : 50,
            height : 50,
            right: 16,
            backgroundColor: "#39B78D",
            padding: 12,
            borderRadius: 50,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
      }
});