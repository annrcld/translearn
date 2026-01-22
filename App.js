import { ref, set } from "firebase/database";
import { database } from "./firebaseConfig";
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, 
  TextInput, Keyboard, TouchableWithoutFeedback, ScrollView, Alert 
} from 'react-native';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

// --- Configuration ---

const BRAILLE_MAP = {
  A: [1], B: [1, 2], C: [1, 4], D: [1, 4, 5], E: [1, 5],
  F: [1, 2, 4], G: [1, 2, 4, 5], H: [1, 2, 5], I: [2, 4], J: [2, 4, 5],
  K: [1, 3], L: [1, 2, 3], M: [1, 3, 4], N: [1, 3, 4, 5], O: [1, 3, 5],
  P: [1, 2, 3, 4], Q: [1, 2, 3, 4, 5], R: [1, 2, 3, 5], S: [2, 3, 4], T: [2, 3, 4, 5],
  U: [1, 3, 6], V: [1, 2, 3, 6], W: [2, 4, 5, 6], X: [1, 3, 4, 6], Y: [1, 3, 4, 5, 6], Z: [1, 3, 5, 6],
  ' ': [] 
};

// --- Components ---

const BrailleChar = ({ char, size = 'normal' }) => {
  const activeDots = BRAILLE_MAP[char.toUpperCase()] || [];
  
  // Dynamic sizing based on whether it's the Main Display or the Preview
  const dotSize = size === 'large' ? 12 : 6;
  const gapSize = size === 'large' ? 8 : 4;
  
  const Dot = ({ pos }) => {
    const isDotActive = activeDots.includes(pos);
    return (
      <View style={[
        { width: dotSize, height: dotSize, borderRadius: dotSize/2, marginBottom: gapSize }, 
        isDotActive ? styles.dotActive : styles.dotInactive
      ]} />
    );
  };

  return (
    <View style={[styles.brailleCharContainer, { gap: gapSize }]}>
      <View>
        <Dot pos={1} />
        <Dot pos={2} />
        <Dot pos={3} />
      </View>
      <View>
        <Dot pos={4} />
        <Dot pos={5} />
        <Dot pos={6} />
      </View>
    </View>
  );
};

const ConnectionStatus = ({ isConnected, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.statusContainer}>
    <View style={[styles.statusDot, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]} />
    <Text style={styles.statusText}>
      {isConnected ? "Device Connected (3-Cell)" : "Hardware Disconnected"}
    </Text>
    <Feather name="bluetooth" size={16} color="#666" style={{ marginLeft: 5 }} />
  </TouchableOpacity>
);

export default function App() {
  const [inputText, setInputText] = useState('');
  const [displayWord, setDisplayWord] = useState('ARDUINO'); // Default text
  const [startIndex, setStartIndex] = useState(0); // Where the 3-letter chunk starts
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // --- The 3-Letter Logic ---
  // We grab 3 characters starting from the current index
  const currentChunk = [
    displayWord[startIndex] || ' ',
    displayWord[startIndex + 1] || ' ',
    displayWord[startIndex + 2] || ' '
  ];

  // Auto-play Logic (Jumps 3 letters at a time)
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setStartIndex((prev) => {
          const next = prev + 3;
          if (next >= displayWord.length) {
            setIsPlaying(false); // Stop at end
            return 0; // Optional: Loop back to start? Currently stops.
          }
          return next;
        });
      }, 2000); // 2 seconds to read 3 letters
    }
    return () => clearInterval(interval);
  }, [isPlaying, displayWord]);

  const handleTranslate = () => {
    if (inputText.trim().length > 0) {
      const word = inputText.toUpperCase();
      setDisplayWord(word);
      
      // --- SEND TO HARDWARE ---
      // This writes the word to Firebase, which your Arduino is "listening" to
      set(ref(database, 'braille/currentText'), {
        text: word,
        timestamp: Date.now()
      });
      // ------------------------

      setStartIndex(0);
      setIsPlaying(true); 
      Keyboard.dismiss();
    }
  };

  // Manual Navigation
  const nextChunk = () => {
    if (startIndex + 3 < displayWord.length) setStartIndex(startIndex + 3);
  };
  const prevChunk = () => {
    if (startIndex - 3 >= 0) setStartIndex(startIndex - 3);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          
          <ConnectionStatus isConnected={isConnected} onPress={handleConnect} />

          <Text style={styles.headerTitle}>TransLearn</Text>
          <Text style={styles.subHeader}>3-Cell Braille Output</Text>

          {/* INPUT SECTION */}
          <View style={styles.inputSection}>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter text (e.g. CAT)"
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleTranslate}>
              <FontAwesome5 name="arrow-circle-right" size={44} color="#0F1715" />
            </TouchableOpacity>
          </View>

          {/* MAIN DISPLAY CARD (Now holds 3 Cells) */}
          <View style={styles.card}>
            <View style={styles.decorativeDot} />

            <Text style={styles.activeLabel}>ACTIVE HARDWARE OUTPUT</Text>

            {/* The 3-Cell Row */}
            <View style={styles.threeCellRow}>
              {currentChunk.map((char, index) => (
                <View key={index} style={styles.singleCellDisplay}>
                   {/* Braille */}
                   <View style={styles.brailleBox}>
                      <BrailleChar char={char} size="large" />
                   </View>
                   {/* Letter */}
                   <Text style={styles.bigLetter}>{char}</Text>
                   <Text style={styles.cellNumber}>Cell {index + 1}</Text>
                </View>
              ))}
            </View>

            {/* Navigation Controls */}
            <View style={styles.navRow}>
              <TouchableOpacity onPress={prevChunk}>
                 <MaterialIcons name="skip-previous" size={40} color={startIndex === 0 ? "#CCC" : "#333"} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
                <MaterialIcons name={isPlaying ? "pause-circle-filled" : "play-circle-filled"} size={64} color="#0F1715" />
              </TouchableOpacity>

              <TouchableOpacity onPress={nextChunk}>
                 <MaterialIcons name="skip-next" size={40} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Full Sentence Preview */}
          <View style={styles.queueContainer}>
             <Text style={styles.queueLabel}>FULL TEXT PREVIEW:</Text>
             <Text style={styles.previewText}>
               {displayWord.split('').map((char, i) => {
                 // Highlight the currently active chunk in Bold/Color
                 const isActive = i >= startIndex && i < startIndex + 3;
                 return (
                   <Text key={i} style={isActive ? styles.highlightText : styles.dimText}>{char}</Text>
                 );
               })}
             </Text>
          </View>

        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  contentContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  
  statusContainer: { flexDirection: 'row', alignItems: 'center', position: 'absolute', top: 50, padding: 8, backgroundColor: '#F5F5F5', borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, color: '#666', fontWeight: '600' },
  
  headerTitle: { fontSize: 32, fontWeight: '900', letterSpacing: 2, color: '#0F1715', marginTop: 80 },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 20, letterSpacing: 1 },

  // Input
  inputSection: { flexDirection: 'row', width: '100%', marginBottom: 15, alignItems: 'center', gap: 10 },
  inputBox: { flex: 1, height: 60, backgroundColor: '#F0F0F0', borderRadius: 15, paddingHorizontal: 20, fontSize: 18, color: '#000', fontWeight: '600' },
  sendButton: { padding: 5 },

  // Main Card
  card: {
    width: '100%', paddingVertical: 25, backgroundColor: '#E0E0E0', borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, elevation: 5,
  },
  decorativeDot: { position: 'absolute', top: 15, left: 15, width: 12, height: 12, borderRadius: 6, backgroundColor: '#0F1715' },
  activeLabel: { fontSize: 10, fontWeight: '700', color: '#666', marginBottom: 15, letterSpacing: 1 },

  // 3-Cell Layout
  threeCellRow: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 20 },
  singleCellDisplay: { alignItems: 'center', width: 80 }, // Fixed width for alignment
  brailleBox: { backgroundColor: '#D6D6D6', padding: 10, borderRadius: 10, marginBottom: 5 },
  bigLetter: { fontSize: 32, fontWeight: '900', color: '#0F1715' },
  cellNumber: { fontSize: 8, color: '#888', textTransform: 'uppercase', marginTop: 2 },

  // Braille Dots
  brailleCharContainer: { flexDirection: 'row', justifyContent: 'center' },
  dotActive: { backgroundColor: '#222' },
  dotInactive: { backgroundColor: 'rgba(0,0,0,0.05)' },

  // Controls
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 30 },

  // Bottom Preview
  queueContainer: { width: '100%', padding: 20, backgroundColor: '#FAFAFA', borderRadius: 15 },
  queueLabel: { fontSize: 10, fontWeight: '700', color: '#999', marginBottom: 5 },
  previewText: { fontSize: 18, fontWeight: '500', letterSpacing: 2 },
  highlightText: { color: '#000', fontWeight: '900', textDecorationLine: 'underline' },
  dimText: { color: '#CCC' },
});