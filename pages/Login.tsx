import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useUserViewModel } from "../ViewsModel/UserViewModel";
import { useUserData } from "../Context/UserContext";

export const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUserData } = useUserData(); // Lấy setUserData từ context
  
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
        const chapter = null
        setUserData(user.username, BookID, chapter);
        navigation.replace('Inapp');
      } else {
        // Nếu mật khẩu sai
        Alert.alert("Error", "Incorrect password!");
      }
    } else {
      // Nếu không tìm thấy người dùng
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
        <TextInput
          placeholder="Password"
          placeholderTextColor="#a9a9a9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible} // Hiển thị mật khẩu nếu passwordVisible là true
          style={styles.input}
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setPasswordVisible(!passwordVisible)} // Đổi trạng thái hiển thị mật khẩu
          >
            <View style={[styles.checkboxBox, passwordVisible && styles.checkboxChecked]} />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Show Password</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />  // Hiển thị spinner khi đang load
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <Text 
            style={styles.registerLink} 
            onPress={() => navigation.navigate('Register')}
          >
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
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxBox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    checkboxChecked: {
        backgroundColor: '#46cdfa',
        borderColor: '#46cdfa',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#46cdfa',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    registerText: {
        fontSize: 14,
        color: '#666',
    },
    registerLink: {
        fontSize: 14,
        color: '#46cdfa',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});