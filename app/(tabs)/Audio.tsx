import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
    const [recording, setRecording] = React.useState<Audio.Recording | null>(null);
    const [recordings, setRecordings] = React.useState<RecordingItem[]>([]);
    const [transcriptions, setTranscriptions] = React.useState<string[]>([]);

    async function startRecording() {
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                const recordingOptions = {
                    android: {
                        extension: ".wav",
                        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WAVE,
                        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
                        sampleRate: 16000,
                        numberOfChannels: 1,
                        bitRate: 128000,
                    },
                    ios: {
                        extension: ".wav",
                        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
                        sampleRate: 16000,
                        numberOfChannels: 1,
                        bitRate: 128000,
                        linearPCMBitDepth: 16,
                        linearPCMIsBigEndian: false,
                        linearPCMIsFloat: false,
                    },
                };
                const { recording } = await Audio.Recording.createAsync(recordingOptions);
                setRecording(recording);
            }
        } catch (err) {
            console.error('Failed to start recording:', err);
        }
    }

    async function sendAudioToAPI(uri) {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri,
                name: 'recording.wav',
                type: 'audio/wav',
            });
            formData.append('model', 'base');
            formData.append('language', 'fr');
            formData.append('initial_prompt', 'string');

            const response = await fetch('http://10.9.65.3:8000/v1/transcriptions', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer dummy_api_key',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();
            console.log(data);

            if (data && data.text) {
                setTranscriptions(prev => [...prev, data.text]);
            }
        } catch (error) {
            console.error("Error sending audio to API:", error);
        }
    }

    async function stopRecording() {
        setRecording(undefined);

        if (recording) {
            try {
                await recording.stopAndUnloadAsync();

                const uri = recording.getURI();
                console.log('Recording saved at:', uri);

                await sendAudioToAPI(uri);

                const { sound, status } = await recording.createNewLoadedSoundAsync();
                const duration = getDurationFormatted(status.durationMillis);

                setRecordings(prev => [
                    ...prev,
                    {
                        sound: sound,
                        duration: duration,
                        file: uri,
                    },
                ]);
            } catch (error) {
                console.error('Error stopping recording:', error);
            }
        }
    }

    function getDurationFormatted(milliseconds: number) {
        const minutes = Math.floor(milliseconds / 1000 / 60);
        const seconds = Math.round((milliseconds / 1000) % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function renderRecordingCards() {
        return recordings.map((recordingLine, index) => (
            <View key={index} style={styles.card}>
                <Text style={styles.cardText}>File: {recordingLine.file.split('/').pop()}</Text>
                <Text style={styles.cardText}>Duration: {recordingLine.duration}</Text>
                {transcriptions[index] && (
                    <Text style={styles.cardText}>Transcription: {transcriptions[index]}</Text>
                )}
                <Pressable
                    style={[styles.button, styles.playButton]}
                    onPress={() => recordingLine.sound.replayAsync()}
                >
                    <Text style={styles.buttonText}>Play</Text>
                </Pressable>
            </View>
        ));
    }

    function clearRecordings() {
        setRecordings([]);
        setTranscriptions([]);
    }

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.button, recording ? styles.stopButton : styles.startButton]}
                onPress={recording ? stopRecording : startRecording}
            >
                <Text style={styles.buttonText}>
                    {recording ? 'Stop Recording' : 'Start Recording'}
                </Text>
            </Pressable>
            {renderRecordingCards()}
            {recordings.length > 0 && (
                <Pressable style={[styles.button, styles.clearButton]} onPress={clearRecordings}>
                    <Text style={styles.buttonText}>Clear All</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardText: {
        marginBottom: 10,
        fontSize: 16,
        color: '#333',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        backgroundColor: '#6200EE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    playButton: {
        backgroundColor: '#03DAC5',
    },
    clearButton: {
        backgroundColor: '#F44336',
    },
    startButton: {
        backgroundColor: '#4CAF50',
    },
    stopButton: {
        backgroundColor: '#F44336',
    },
});