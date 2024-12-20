import { database } from "./FireBase";
import { set, ref, get, push } from "firebase/database";

// export const addComment = async (BookID, userdata, commentText) => {
//       try {
//         // Define the path using the userID
//         const commentsPath = `comments/${BookID}/${userdata}`;
    
//         // Prepare the new comment data
//         const newComment = {
//           userID : userdata,
//           content: commentText,
//           timestamp: new Date().toISOString(),
//         };
    
//         // Save the new comment under the user's ID
//         await set(ref(database, commentsPath), newComment); // Using set to directly set the comment data
//         console.log("Comment added successfully:", newComment);
//       } catch (error) {
//         console.error("Error adding comment:", error);
//       }
// };
export const addComment = async (BookID, userdata, commentText) => {
  try {
    // Get a reference to the comments node for the specific book and user
    const commentsPath = `comments/${BookID}/${userdata}`;

    // Prepare the new comment data
    const newComment = {
      userID: userdata,
      content: commentText,
      timestamp: new Date().toISOString(),
    };

    // Use push() to add a new comment without overwriting existing ones
    const commentRef = push(ref(database, commentsPath));  // Push generates a unique ID for each comment
    await set(commentRef, newComment);  // Set the new comment at the generated reference

    console.log("Comment added successfully:", newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

export const loadComments = async (BookID) => {
  try {
    // Đường dẫn đến các bình luận của cuốn sách
    const commentsPath = `comments/${BookID}`;
    
    // Lấy dữ liệu bình luận từ Firebase
    const snapshot = await get(ref(database, commentsPath));
    
    if (snapshot.exists()) {
      const commentsData = snapshot.val();
      let allComments = [];
      
      // Duyệt qua các người dùng và lấy tất cả các bình luận của mỗi người
      Object.keys(commentsData).forEach((userID) => {
        const userComments = commentsData[userID];  // Bình luận của người dùng cụ thể
        Object.values(userComments).forEach((comment) => {
          allComments.push(comment);  // Thêm từng bình luận vào mảng
        });
      });

      return allComments; // Trả về tất cả các bình luận
    } else {
      console.log("No comments found for this book.");
      return [];
    }
  } catch (error) {
    console.error("Error loading comments:", error);
    return [];
  }
};

    