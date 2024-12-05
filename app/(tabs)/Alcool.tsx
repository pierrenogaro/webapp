import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";

export default function AlcoolList() {
    const [alcools, setAlcools] = useState([]);

    const fetchAlcools = async () => {
        try {
            const response = await fetch("http://192.168.8.145:8000/alcools/all");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            setAlcools(data);
        } catch (err) {
            Alert.alert("Error", err.message);
        }
    };

    useEffect(() => {
        fetchAlcools();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={alcools}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.degree}>Degree: {item.degree}</Text>
                        <Text style={styles.description}>{item.description || "No description available"}</Text>
                        {item.ingredients && item.ingredients.length > 0 && (
                            <Text style={styles.ingredients}>
                                Ingredients: {item.ingredients.join(", ")}
                            </Text>
                        )}
                        {item.author && typeof item.author === "object" && item.author.username ? (
                            <Text style={styles.author}>Author: {item.author.username}</Text>
                        ) : (
                            <Text style={styles.author}>Author: Unknown</Text>
                        )}
                    </View>
                )}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("CreateAlcool")}
            >
                <Text style={styles.addButtonText}>Add Alcool</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f0f4f8",
    },
    card: {
        backgroundColor: "#e3f2fd",
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#90caf9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1e88e5",
    },
    degree: {
        fontSize: 14,
        color: "#6c757d",
    },
    description: {
        fontSize: 14,
        marginTop: 8,
        color: "#424242",
    },
    ingredients: {
        fontSize: 14,
        color: "#2e7d32",
        marginTop: 8,
    },
    author: {
        fontSize: 12,
        color: "#ff7043",
        marginTop: 8,
    },
    addButton: {
        backgroundColor: "#1e88e5",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
