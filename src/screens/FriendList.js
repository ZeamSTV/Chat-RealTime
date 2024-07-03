import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { AuthConstext } from '../context/AuthProvider';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import UserList from '../components/FriendListMess';
import { getRoomId } from '../utils/common';

const FriendList = ({ navigation }) => {
  const { currentUser } = useContext(AuthConstext);
  const [friendsDetails, setFriendsDetails] = useState([]);

  useEffect(() => {
    const fetchFriendsDetails = async () => {
      const friendsInfo = [];
      const uniqueFriendIds = new Set(currentUser?.friends || []);

      for (const friendId of uniqueFriendIds) {
        const friendDocRef = doc(db, 'users', friendId);
        const friendSnapshot = await getDoc(friendDocRef);
        if (friendSnapshot.exists()) {
          const friendData = { id: friendSnapshot.id, ...friendSnapshot.data() };

          // Fetch the latest message
          const roomId = getRoomId(currentUser?.userId, friendId);
          const messagesRef = collection(db, 'rooms', roomId, 'messages');
          const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
          const messagesSnapshot = await getDocs(messagesQuery);
          const latestMessage = messagesSnapshot.docs.length > 0 ? messagesSnapshot.docs[0].data() : null;

          friendsInfo.push({ ...friendData, latestMessage });
        }
      }
      setFriendsDetails(friendsInfo);
    };

    if (currentUser?.friends) {
      fetchFriendsDetails();
    }
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Friend List</Text>
      <FlatList
        data={friendsDetails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserList users={item} latestMessage={item.latestMessage} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff', // Thêm màu nền để phân biệt với nội dung
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 30, // Để căn giữa so với các phần tử khác
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
});

export default FriendList;
