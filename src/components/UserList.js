import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { AuthConstext } from '../context/AuthProvider'; // Adjust the import if necessary

export default function UserList({ users }) {
  const navigation = useNavigation();
  const { sendFriendRequest, friends } = useContext(AuthConstext);
  const [message, setMessage] = useState('');

  const chatHandler = () => {
    navigation.navigate('Chat', { users });
  };

  const handleSendFriendRequest = async () => {
    try {
      await sendFriendRequest(users.id);
      setMessage('Friend request sent successfully');
      Alert.alert('Success', 'Friend request sent successfully');
    } catch (error) {
      setMessage('Failed to send friend request');
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const isFriend = friends.includes(users.id);

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: users })}> */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={styles.imgContainer}>
          <Image
            source={require('../img/account.jpg')}
            style={styles.img}
            resizeMode='contain'
          />
        </View>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {users?.name}
        </Text>
      </View>
      {/* </TouchableOpacity> */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {isFriend && (
          <TouchableOpacity onPress={chatHandler}>
            <View style={styles.iconButton}>
              <Icon raised reverse name='comments-o' type='font-awesome' color='#000' />
            </View>
          </TouchableOpacity>
        )}
        {!isFriend && (
          <TouchableOpacity onPress={handleSendFriendRequest}>
            <View style={styles.iconButton}>
              <Icon name='user-plus' type='font-awesome' color='black' />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    backgroundColor: '#e8e8f1',
    marginVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
    borderRadius: 5,
  },
  imgContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 100,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  iconButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 10,
    color: 'green',
    fontSize: 16,
  },
});