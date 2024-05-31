import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

export default function PrimaryBtn({ title, onPress, disabled }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container} disabled={disabled}>
      <TouchableOpacity>
        <Text style={styles.title} onPress={onPress}>
          {title ? title : "Button"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    width: "100%",
    height: 48,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
