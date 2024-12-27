import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { addUser } from "../models/UserData";
import { Ionicons as Icon } from "@expo/vector-icons";

export const RegisterScreen = () => {
    const navigation = useNavigation();

    // State để lưu thông tin đăng ký
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert("Error", "All fields are required!");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match!");
            return;
        }

        try {
            await addUser(username, password);
            
            Alert.alert("Success", "Account created successfully!", [
                { text: "OK", onPress: () => navigation.navigate("Login") },
            ]);
        } catch (error) {
            console.error("Error during registration:", error);
            Alert.alert("Error", "Failed to register account. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Create an Account</Text>

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
                        secureTextEntry={true}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                        <Icon name={passwordVisible ? "eye-off" : "eye"} size={24} color="#a9a9a9" />
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer} >
                    <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor="#a9a9a9"
                        secureTextEntry={true}
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                        <Icon name={passwordVisible ? "eye-off" : "eye"} size={24} color="#a9a9a9" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>

                <View style={styles.loginRedirect}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <Text
                        style={styles.loginLink}
                        onPress={() => {
                            navigation.navigate("Login");
                        }}
                    >
                        Login
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
    registerButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#46cdfa",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 10,
    },
    registerButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    loginRedirect: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    loginText: {
        fontSize: 14,
        color: "#666",
    },
    loginLink: {
        fontSize: 14,
        color: "#46cdfa",
        fontWeight: "bold",
        marginLeft: 5,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    eyeIcon: {
        position: "absolute",
        right: 10,
        paddingBottom : 15
    }
});
