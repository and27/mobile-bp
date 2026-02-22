import { StyleSheet } from "react-native";
import { AppRoot } from "./src/AppRoot";

export default function App() {
  return <AppRoot></AppRoot>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
