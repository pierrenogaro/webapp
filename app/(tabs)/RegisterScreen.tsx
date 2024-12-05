import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

const RegisterScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await axios.post("http://192.168.8.145:8000/auth/register/", { username, password });
            alert("Registration successful");
            router.push("/LoginScreen");
        } catch (error) {
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
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
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/LoginScreen")}>
                <Text style={styles.linkText}>Already have an account? Log In</Text>
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

export default RegisterScreen;