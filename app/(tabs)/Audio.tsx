import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
    const [recording, setRecording] = React.useState<Audio.Recording | null>(null);
    const [recordings, setRecordings] = React.useState<RecordingItem[]>([]);

    async function startRecording() {
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
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
        } catch (err) {}
    }

    async function stopRecording() {
        setRecording(undefined);

        if (recording) {
            try {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                console.log('Recording saved at:', uri);

                let allRecordings = [...recordings];
                const { sound, status } = await recording.createNewLoadedSoundAsync();
                allRecordings.push({
                    sound: sound,
                    duration: getDurationFormatted(status.durationMillis),
                    file: uri,
                });

                setRecordings(allRecordings);
            } catch (error) {
                console.error('Error stopping recording:', error);
            }
        }
    }
    function getDurationFormatted(milliseconds: number) {
        const minutes = milliseconds / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
    }

    function getRecordingLines() {
        return recordings.map((recordingLine, index) => (
            <View key={index} style={styles.row}>
                <Text style={styles.fill}>
                    Recording #{index + 1} | {recordingLine.duration}
                </Text>
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
            {getRecordingLines()}
            {recordings.length > 0 && (
                <Pressable style={[styles.button, styles.clearButton]} onPress={clearRecordings}>
                    <Text style={styles.buttonText}>Clear Recordings</Text>
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
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 40,
    },
    fill: {
        flex: 1,
        margin: 15,
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