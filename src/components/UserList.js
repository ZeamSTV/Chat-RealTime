import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Icon } from 'react-native-elements'; // Import Icon from react-native-elements
import { useNavigation } from "@react-navigation/native";

export default function UserList({ users }) {
  const navigation = useNavigation();

  const chatHandler = () => {
    navigation.navigate("Chat", { users });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("UserProfile", { user: users })}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={styles.imgContainer}>
            <Image
              source={require("../img/account.jpg")}
              style={styles.img}
              resizeMode="contain"
            />
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>  {/* Wrap name in <Text> */}
            {users?.name}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity onPress={chatHandler}>
          <View style={styles.iconButton}>
            <Icon raised reverse name='pencil' type='font-awesome' color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.iconButton}>
            <Icon name='user-plus' type='font-awesome' color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    backgroundColor: "#e8e8f1",
    marginVertical: 5,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    flexDirection: "row",
    borderRadius: 5,
  },
  imgContainer: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 100,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",

  },
});
