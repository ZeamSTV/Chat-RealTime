import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileButton from "../components/ProfileButton";
import UserList from "../components/UserList";
import { AuthConstext } from "../context/AuthProvider";
import { onSnapshot, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { useTheme } from '../context/ThemeProvider';

export default function Home({ navigation }) {
  const { logOut, user, currentUser, acceptFriendRequest, friends } = useContext(AuthConstext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const { theme } = useTheme();
  const [friendData, setFriendData] = useState([]); // State to store friend data

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

    if (currentUser?.friendRequests) {
      setFriendRequests(currentUser.friendRequests);
    }

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const fetchFriendData = async () => {
      const friendInfo = [];

      for (const friendId of friends) {
        const friendDocRef = doc(db, "users", friendId);
        const friendSnapshot = await getDoc(friendDocRef);
        const friend = friendSnapshot.data();
        friendInfo.push(friend);
      }

      setFriendData(friendInfo);
    };

    fetchFriendData();
  }, [friends]); // Fetch friend data whenever friends change

  const handleAcceptFriendRequest = async (requestUserId) => {
    await acceptFriendRequest(requestUserId);
    setFriendRequests((prevRequests) => prevRequests.filter(id => id !== requestUserId)); // Remove the accepted friend request from the list
    alert("Friend request accepted!");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
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
              <Text style={[styles.title, { color: theme.textColor }]}>{currentUser?.name}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{currentUser?.address}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{currentUser?.gender}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{currentUser?.email}</Text>
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
            <ProfileButton bg="#0d0d0d" title="View Profile" onPress={() => navigation.navigate('Profile')} />

            <ProfileButton title="Friend List" onPress={() => navigation.navigate('FriendList')} />
          </View>
        </View>

        {/*============== Friend Requests =======================*/}
        <View style={{ paddingVertical: 5 }}>
          <Text style={[styles.title, { color: theme.textColor }]}>Friend Requests</Text>
          {friendRequests.length > 0 ? (
            friendRequests.map((requestId) => {
              const requester = users.find((user) => user.id === requestId);
              return (
                <View key={requestId} style={styles.friendRequest}>
                  <Text style={{ color: theme.textColor }}>{requester?.name}</Text>
                  <TouchableOpacity onPress={() => handleAcceptFriendRequest(requestId)}>
                    <Text style={{ color: "blue" }}>Accept</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={{ color: theme.textColor }}>No friend requests</Text>
          )}
        </View>

        {/*============== User List =======================*/}
        <View style={{ flex: 1, paddingVertical: 5 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {users &&
              users.map((x) => (
                <View key={x?.id}>
                  <UserList users={x} />
                </View>
              ))}
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
  friendRequest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
});
