import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function ChuckNorrisJokes() {
    const [joke, setJoke] = useState(null);

    async function fetchJoke() {
        const url = 'https://api.chucknorris.io/jokes/random';
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setJoke(data.value);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chuck Norris Jokes</Text>

            <TouchableOpacity style={styles.button} onPress={fetchJoke}>
                <Text style={styles.buttonText}>Get a Joke</Text>
            </TouchableOpacity>

            {joke && (
                <View style={styles.jokeContainer}>
                    <Text style={styles.joke}>{joke}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    jokeContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#ecf0f1',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    joke: {
        fontSize: 16,
        color: '#34495e',
        textAlign: 'center',
    },
});
