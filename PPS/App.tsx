import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Timer from "./components/Timer";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Timer />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34353d',
    
  },
});
