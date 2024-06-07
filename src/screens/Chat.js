import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "react-native-elements";
import ChatBody from "../components/ChatBody";
import { AuthConstext } from "../context/AuthProvider";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { getRoomId } from "../utils/common";

export default function Chat({ route }) {
  const navigation = useNavigation();
  const { currentUser } = useContext(AuthConstext);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(null);
  const { users } = route.params; // second user
  // create chatRoom start
  useEffect(() => {
    createRoomIfNotExists();
    let roomId = getRoomId(currentUser?.userId, users?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    let unSub = onSnapshot(q, (snapShot) => {
      let allMessages = snapShot.docs.map((doc) => {
        return doc.data();
      });
      setMessages([...allMessages]);
    });
    return unSub;
  }, []);
  const createRoomIfNotExists = async () => {
    let roomId = getRoomId(currentUser?.userId, users?.userId);
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };
  // create chatRoom end
  //=====================Send Message===================
  const sendHandler = async () => {
    if (text.trim() === "") return;

    try {
      let roomId = getRoomId(currentUser?.userId, users?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      const newDoc = await addDoc(messagesRef, {
        userId: currentUser?.userId,
        text: text,
        createdAt: Timestamp.fromDate(new Date()),
      });
      // console.log("new message Id:", newDoc.id);
    } catch (error) {
      Alert.alert("Error", error.message);
    }

    setText("");
  };
  // console.log("messages:", messages);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/*============ Header ==============*/}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Icon name="arrow-back" size={24} color="black" />
              <View style={styles.imgContainer}>
                <Image
                  source={require("../img/account.jpg")}
                  style={styles.img}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={{ color: "black", fontSize: 18, fontWeight: "bold" }}
              >
                {users.name}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <View
              style={{
                // width: 10,
                // height: 10,
                // borderRadius: 100,
                // backgroundColor: "green",
                flexDirection: "row",
                gap: 20,
                paddingRight: 10,
              }}
            >
              {/* <TouchableOpacity>
                <Icon name="call" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="videocam" size={24} color="black" />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
        {/*============ Body ==============*/}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, backgroundColor: "white" }}>
            {messages?.map((message, index) => (
              <View key={index}>
                <ChatBody
                  message={message}
                  own={currentUser?.userId === message?.userId}
                />
              </View>
            ))}
          </View>
        </ScrollView>
        {/*======= message Send =========*/}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              // backgroundColor: "orange",
              // justifyContent: "flex-end",
              width: "85%",
              height: 50,
              //  alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 100,
              marginHorizontal: 5,
              marginBottom: 5,
              flexDirection: "row",
              overflow: "hidden",
              marginVertical: 10,
            }}
          >
            <TextInput
              multiline
              placeholder="Type a message..."
              style={[styles.input, { color: "black" }]}
              value={text}
              onChangeText={(value) => setText(value)}
            // onChangeText={(value) => (textRef.current = value)}
            />
            {/* <View
              style={{
                alignSelf: "center",
                // backgroundColor: "red",
                height: 35,
                overflow: "hidden",
                // marginRight: 15,
              }}
            >
              <Text style={{ fontSize: 24 }}></Text>
            </View> */}
          </View>
          <TouchableOpacity onPress={sendHandler}>
            <Icon name="send" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
// "#e8e8f1" || "#691292"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // paddingTop: 10,
  },
  header: {
    height: 60,
    backgroundColor: "#e8e8f1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    // marginHorizontal: 10,
    // borderRadius: 5,
  },
  imgContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "gray",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  input: {
    height: 40,
    width: "94%",
    // borderWidth: 1,

    fontSize: 16,
    // paddingHorizontal: 5,
    paddingVertical: 1,
    textDecorationColor: "red",
    overflow: "hidden",
  },
});