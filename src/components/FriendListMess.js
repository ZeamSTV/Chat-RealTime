import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { AuthConstext } from '../context/AuthProvider';

export default function UserList({ users, latestMessage }) {
  const navigation = useNavigation();
  const { sendFriendRequest, friends } = useContext(AuthConstext);

  const chatHandler = () => {
    navigation.navigate('Chat', { users });
  };

  const handleSendFriendRequest = async () => {
    try {
      await sendFriendRequest(users.id);
      Alert.alert('Thành công', 'Đã gửi yêu cầu kết bạn thành công');
    } catch (error) {
      Alert.alert('Lỗi', 'Gửi yêu cầu kết bạn thất bại');
    }
  };

  const isFriend = friends.includes(users.id);

  return (
    <TouchableOpacity onPress={chatHandler}>
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <View style={styles.imgContainer}>
            <Image
              source={require('../img/account.jpg')}
              style={styles.img}
              resizeMode='contain'
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.userName}>
              {users?.name}
            </Text>
            <Text style={styles.latestMessage}>
              {latestMessage ? latestMessage.text : 'Chưa có tin nhắn'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    backgroundColor: '#e8e8f1',
    marginVertical: 5,
    borderRadius: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 100,
    overflow: 'hidden',
    marginRight: 10,
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  latestMessage: {
    color: 'grey',
    fontSize: 14,
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  iconButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
