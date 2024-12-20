import { addComment, loadComments } from "../models/CommentDB";
import React, { useEffect, useState } from "react";

export  const useCommentsViewModel = (BookID: string) => {
      
      const [comments, setComments] = useState<any[]>([]);
      const [loading, setLoading] = useState<boolean>(false);
      const [error, setError] = useState<string | null>(null);

      const fetchComments = async () => {
            setLoading(true);
            try {
                  const loadedComments = await loadComments(BookID);
                  setComments(loadedComments);
            } catch (err) {
                  setError("Failed to load comments.");
            } finally {
                  setLoading(false);
            }
      };

      const submitComment = async (userID: string, commentText: string) => {
            try {
                  await addComment(BookID, userID, commentText);
                  fetchComments(); // Refresh comments after adding
            } catch (err) {
                  setError("Failed to add comment.");
            }
      };

      useEffect(() => {
            fetchComments();
      }, [BookID]);

      return {
            comments,
            loading,
            error,
            fetchComments,
            submitComment,
      };
};