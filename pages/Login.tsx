import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useUserViewModel } from "../ViewsModel/UserViewModel";
import { useUserData } from "../Context/UserContext";

export const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUserData } = useUserData();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, error } = useUserViewModel(username, password);

  const handleLogin = async () => {
    if (loading) {
      return;
    }

    if (error) {
      Alert.alert("Error", error);
      return;
    }

    if (!username || !password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }

    if (user) {
      if (user.password === password) {
        const BookID = null;
        const chapter = null;
        setUserData(user.username, BookID, chapter);
        navigation.replace("Inapp");
      } else {
        Alert.alert("Error", "Incorrect password!");
      }
    } else {
      Alert.alert("Error", "User not found!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back!</Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#a9a9a9"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#a9a9a9"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={[styles.input, { flex: 1 }]} // Làm cho ô nhập mật khẩu linh hoạt với chiều rộng
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
            <Icon name={passwordVisible ? "eye-off" : "eye"} size={24} color="#a9a9a9" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <Text style={styles.registerLink} onPress={() => navigation.navigate("Register")}>
            Register
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    paddingBottom: 15
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#46cdfa",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    fontSize: 14,
    color: "#46cdfa",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default LoginScreen;