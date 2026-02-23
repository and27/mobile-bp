import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function ProductsSearch() {
  const [query, setQuery] = useState("");

  return (
    <View>
      <TextInput
        placeholder="Search..."
        value={query}
        onChangeText={setQuery}
        style={styles.searchInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 4,
    minWidth: 200,
  },
});
