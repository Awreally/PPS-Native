import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Pressable,
  Keyboard,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/formatTime";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const INITIAL_TIME = 25 * 60;

function Timer() {
  const [duration, setDuration] = useState<number>(INITIAL_TIME);
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inputMinutes, setInputMinutes] = useState<string>(
    String(INITIAL_TIME / 60),
  );
  const [warning, setWarning] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const timerId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      pauseTimer();
    }
  }, [timeLeft, isRunning]);

  useEffect(() => {
    return () => {
      if (timerId.current !== null) {
        clearInterval(timerId.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (timerId.current !== null) return;
    setIsRunning(true);
    timerId.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerId.current !== null) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
    setIsRunning(false);
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(duration);
  };

  const handleSetTimer = () => {
    const parsed = parseInt(inputMinutes, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setWarning("Timer must be set for at least 1 minute!");
      return;
    }
    setWarning("");
    const newDuration = parsed * 60;
    pauseTimer();
    setDuration(newDuration);
    setTimeLeft(newDuration);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={inputMinutes}
        onChangeText={setInputMinutes}
        keyboardType="numeric"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSetTimer}
        returnKeyType="done"
        placeholder="Minutes"
        style={[styles.input, isFocused && styles.inputFocused]}
      />
      {warning ? <Text style={styles.warning}>{warning}</Text> : null}

      <Pressable style={styles.button} onPress={handleSetTimer}>
        <Text style={styles.buttonText}>Set time</Text>
      </Pressable>

      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

      <Pressable
        style={[styles.button, timeLeft === 0 && styles.buttonDisabled]}
        onPress={isRunning ? pauseTimer : startTimer}
        disabled={timeLeft === 0}
      >
        <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={resetTimer}>
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    color: "fff",
  },
  inputFocused: {
    borderColor: "#0077ff",
  },
  timer: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#34353d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.35)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  warning: {
    color: "red",
    textAlign: "center",
  },
});

export default Timer;
