import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard } from "react-native";
import { useCommentsViewModel } from "../ViewsModel/CommentVM";
import { useUserData } from "../Context/UserContext";
import { Ionicons } from "@expo/vector-icons";  // Use Ionicons for the close (X) icon

const CommentScreen = ({ navigation }: { navigation: any }) => {
      const { userData, BookID } = useUserData();
      const { comments, loading, error, submitComment } = useCommentsViewModel(BookID);
      const [commentText, setCommentText] = useState<string>("");

      const handleAddComment = () => {
            if (commentText.trim()) {
                  submitComment(userData, commentText);
                  setCommentText("");
            }
      };

      return (
            <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                  <View style={styles.container}>
                        {/* Close button on the header */}
                        <View style={styles.headerContainer}>
                              <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Ionicons name="close" size={24} color="black" />
                              </TouchableOpacity>
                              <Text style={styles.header}>Comments</Text>
                        </View>

                        {error && <Text style={styles.error}>{error}</Text>}
                        {loading ? (
                              <Text style={styles.loading}>Loading comments...</Text>
                        ) : (
                              <FlatList
                                    data={comments}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                          <View style={styles.commentItem}>
                                                <Text style={styles.commentUser}>{item.userID}</Text>
                                                <Text style={styles.commentContent}>{item.content}</Text>
                                                <Text style={styles.commentTimestamp}>
                                                      {new Date(item.timestamp).toLocaleString()}
                                                </Text>
                                          </View>
                                    )}
                              />
                        )}

                        <View style={styles.inputContainer}>
                              <TextInput
                                    style={styles.input}
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChangeText={setCommentText}
                                    // Removed the Keyboard.dismiss() here
                              />
                              <Button title="Send" onPress={handleAddComment} />
                        </View>
                  </View>
            </KeyboardAvoidingView>
      );
};

const styles = StyleSheet.create({
      container: {
            flex: 1,
            padding: 16,
            backgroundColor: "#f9f9f9",
      },
      headerContainer: {
            paddingTop: 40,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
      },
      header: {
            flex: 1,
            fontSize: 24,
            fontWeight: "bold",
            color: "#333",
      },
      loading: {
            fontSize: 16,
            color: "#888",
      },
      error: {
            fontSize: 14,
            color: "red",
            marginBottom: 16,
      },
      commentItem: {
            marginBottom: 12,
            padding: 8,
            backgroundColor: "#fff",
            borderRadius: 8,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
      },
      commentUser: {
            fontWeight: "bold",
            color: "#333",
      },
      commentContent: {
            marginVertical: 4,
            color: "#555",
      },
      commentTimestamp: {
            fontSize: 12,
            color: "#aaa",
      },
      inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 16,
      },
      input: {
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 8,
            marginRight: 8,
            backgroundColor: "#fff",
      },
});

export default CommentScreen;