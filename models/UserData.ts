import { set, ref, get } from "@firebase/database";
import { database } from "./FireBase";

export const addUser = async (username : string,password : string) => {
    try {
      await set(ref(database, 'User/' + username), {
        username: username,
        password: password,
      });
        console.log("User added successfully!");
    } catch (error) {
        console.error("Error adding User: ", error);
        throw error;
    }
};

export const getUser = async (username : string, password : string) => {
    try {
        const snapshot = await get(ref(database, 'User/' + username));
        if (snapshot.exists()) {
            const user = snapshot.val();
            if(user.password === password){
                console.log("User authenticated successfully:", user);
                return user;
            } else {
                console.log("Pass is Incorrect");
                return null;
            }
        } else {
            console.log("No user found with username:", username);
            return null; // Không tìm thấy người dùng
        }
      } catch (error) {
      console.error("Error getting user: ", error);
    }
};