import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const LoginScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://192.168.8.145:8000/auth/login/", { username, password });
            await AsyncStorage.setItem("jwtToken", response.data.token);
            alert("Login successful");
            router.push("/Alcool");
        } catch (error) {
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888"
                onChangeText={setUsername}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/RegisterScreen")}>
                <Text style={styles.linkText}>Create an account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
    input: { width: "90%", height: 50, marginBottom: 15, borderWidth: 1, paddingHorizontal: 16 },
    button: { width: "70%", height: 50, justifyContent: "center", alignItems: "center", backgroundColor: "black" },
    buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
    linkText: { color: "blue", marginTop: 20, textDecorationLine: "underline" },
});

export default LoginScreen;
