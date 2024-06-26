// Home.js

import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, Image, ScrollView, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileButton from "../components/ProfileButton";
import UserList from "../components/UserList";
import { AuthConstext } from "../context/AuthProvider";
import { getStorage, ref, uploadBytes, getDownloadURL, onSnapshot, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { useTheme } from '../context/ThemeProvider';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from "../firebase/firebaseStorage";

export default function Home({ navigation }) {
  const { logOut, currentUser, acceptFriendRequest, friends } = useContext(AuthConstext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const { theme } = useTheme();
  const [friendData, setFriendData] = useState([]);

  const logOutHandler = async () => {
    try {
      setLoading(true);
      await logOut();
      Alert.alert("Log out", "Logged out successfully!");
    } catch (error) {
      Alert.alert("Sign out", error.message);
    } finally {
      setLoading(false);
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
  }, [friends]);

  const handleAcceptFriendRequest = async (requestUserId) => {
    await acceptFriendRequest(requestUserId);
    setFriendRequests((prevRequests) => prevRequests.filter(id => id !== requestUserId));
    alert("Friend request accepted!");
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      console.log('Selected image URI: ', pickerResult.uri);
      try {
        const downloadURL = await uploadImage(pickerResult.uri, currentUser.uid);
        console.log('Download URL: ', downloadURL);
        Alert.alert("Success", "Avatar updated successfully!");
      } catch (error) {
        console.error('Error selecting image or uploading: ', error);
        Alert.alert("Error", "Failed to update avatar.");
      }
    } else {
      console.log('User cancelled image selection');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <View style={styles.header}>
          <View style={styles.headerBox}>
            <View style={styles.imgContainer}>
              <TouchableOpacity onPress={selectImage}>
                <Image
                  source={currentUser?.avatar ? { uri: currentUser.avatar } : require("../img/account.jpg")}
                  style={styles.img}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: theme.textColor }]}>{currentUser?.name}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{currentUser?.address}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{currentUser?.gender}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{currentUser?.email}</Text>
              <View style={{ marginVertical: 10 }}>
                <ProfileButton
                  onPress={logOutHandler}
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
