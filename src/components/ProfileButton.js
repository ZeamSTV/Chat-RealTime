import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function ProfileButton({ title, bg, onPress, disabled }) {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View
        style={[styles.container, { backgroundColor: bg ? bg : "#0d0d0d" }]}
      >
        <Text style={styles.title}>{title ? title : "Button"}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0d0d0d",
    width: 110,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  title: {
    color: "white",
    fontSize: 16,
  },
});
