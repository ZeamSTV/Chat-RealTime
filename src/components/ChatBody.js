import { View, Text, StyleSheet, Image } from "react-native";

export default function ChatBody({ own, message }) {
  //  console.log("message:", message);
  return (
    <View
      style={[
        styles.container,
        { alignItems: own ? "flex-end" : "flex-start" },
      ]}
    >
      <View
        style={[
          styles.box,
          { flexDirection: own ? "row-reverse" : "row", gap: 5 },
        ]}
      >
        <View style={styles.imgContainer}>
          <Image
            source={require("../img/account.jpg")}
            style={styles.img}
            resizeMode="contain"
          />
        </View>
        <View style={styles.messageContainer}>
          <Text
            style={[
              styles.text,
              {
                backgroundColor: own ? "#007bff" : "#e4e5e0",
                color: own ? "white" : "black",
              },
            ]}
          >
            {message?.text}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  box: {
    maxWidth: "70%",
    borderRadius: 10,
    padding: 5,
  },
  messageContainer: {
    flex: 1,
    // marginLeft: 10,
  },
  text: {
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  imgContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "gray",
  },
  img: {
    width: "100%",
    height: "100%",
  },
});
