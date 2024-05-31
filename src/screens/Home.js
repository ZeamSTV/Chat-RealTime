import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileButton from "../components/ProfileButton";
import UserList from "../components/UserList";
import { useContext, useEffect, useState } from "react";
import { AuthConstext } from "../context/AuthProvider";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
export default function Home({ navigation }) {
  const { logOut, user, currentUser } = useContext(AuthConstext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const logOuthandler = async () => {
    try {
      setLoading(true);
      await logOut();
      Alert.alert("Log out", "Log out successfully!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Sign in", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/*================ header ====================*/}
        <View style={styles.header}>
          <View style={styles.headerBox}>
            <View style={styles.imgContainer}>
              <Image
                source={require("../img/account.jpg")}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{currentUser?.name}</Text>
              <Text style={styles.text}>{currentUser?.address}</Text>
              <Text style={styles.text}>{currentUser?.gender}</Text>
              <Text style={styles.text}>{currentUser?.email}</Text>
              <View style={{ marginVertical: 10 }}>
                <ProfileButton
                  onPress={logOuthandler}
                  title={loading ? "Loading..." : "Log out"}
                  bg="#bb180a"
                  disabled={loading}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 5,
              paddingTop: 20,
            }}
          >
            <ProfileButton bg="#0d0d0d" title="View Profile" />
            <ProfileButton title="Add User" />
          </View>
        </View>
        {/*============== User List =======================*/}
        <View
          style={{
            height: "auto",
            flex: 1,
            paddingVertical: 5,
          }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {users &&
              users.map((x) => (
                <View key={x?.userId}>
                  <UserList users={x} />
                </View>
              ))}
            {/* <UserList users={users} /> */}
          </ScrollView>
        </View>
        {/*================ header ====================*/}
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
    // paddingTop: 10,
    paddingTop: 2,
  },
  header: {
    width: "100%",
    height: 230,
    backgroundColor: "#e8e8f1",
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBox: {
    width: "100%",
    height: 150,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  imgContainer: {
    width: 130,
    height: 130,
    backgroundColor: "white",
    borderRadius: 100,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  headerText: {},
  title: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "black",
  },
});
