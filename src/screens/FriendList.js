import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AuthConstext } from '../context/AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

const FriendList = () => {
    const { currentUser } = useContext(AuthConstext);
    const [friendsDetails, setFriendsDetails] = useState([]);
    const [users, setUsers] = useState([]);
    const [friendData, setFriendData] = useState([]);

    useEffect(() => {
        const fetchFriendsDetails = async () => {
            const friendsInfo = [];
            const uniqueFriendIds = new Set(currentUser?.friends || []); // Use Set to ensure uniqueness

            for (const friendId of uniqueFriendIds) {
                const friendDocRef = doc(db, 'users', friendId);
                const friendSnapshot = await getDoc(friendDocRef);
                if (friendSnapshot.exists()) {
                    friendsInfo.push({ id: friendSnapshot.id, ...friendSnapshot.data() });
                }
            }
            setFriendsDetails(friendsInfo);
        };

        if (currentUser?.friends) {
            fetchFriendsDetails();
        }
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
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Friend List</Text>
            <FlatList
                data={friendsDetails}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.friendContainer}>
                        <Text>{item.name}</Text>
                    </View>
                )}
            />
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    friendContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default FriendList;
