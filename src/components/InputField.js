import { View, StyleSheet, TextInput } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

export default function InputField({
  placeholder,
  secureTextEntry,
  onChangeText,
  autoCapitalize,
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="gray"
        style={[styles.input, { color: colors.text }]}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        autoFocus
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 48,
  },
  input: {
    height: 48,
    width: "100%",
    // borderWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 5,
    fontSize: 20,
    paddingHorizontal: 5,
    textDecorationColor: "red",
  },
});
