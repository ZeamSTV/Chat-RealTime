import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { AuthConstext } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeProvider';

export default function Profile({ navigation }) {
    const { currentUser, updateUser } = useContext(AuthConstext);
    const { theme, toggleTheme } = useTheme();
    const [name, setName] = useState(currentUser?.name || '');
    const [address, setAddress] = useState(currentUser?.address || '');
    const [gender, setGender] = useState(currentUser?.gender || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [themeColor, setThemeColor] = useState(theme.backgroundColor);

    const handleSave = async () => {
        try {
            await updateUser({ name, address, gender, email, themeColor });
            Alert.alert('Profile updated', 'Your profile information has been updated.');
        } catch (error) {
            Alert.alert('Update failed', error.message);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.header} color={theme.headerColor}>
                <View style={styles.headerBox}>
                    <View style={styles.imgContainer}>
                    <TouchableOpacity>
                        <Image
                        source={require("../img/account.jpg")}
                        style={styles.img}
                        resizeMode="contain"
                        />
                    </TouchableOpacity>
                    </View>
                    <View style={styles.headerText}>
                        <Text style={[styles.title1, { color: theme.textColor }]}>Profile User</Text>
                        <Text style={[styles.title, { color: theme.textColor }]}>{name}</Text>
                    </View>
                </View>
            </View>
            <Text style={[styles.label, { color: theme.textColor }]}>Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.inputTextColor }]}
            />
            <Text style={[styles.label, { color: theme.textColor }]}>Address</Text>
            <TextInput
                value={address}
                onChangeText={setAddress}
                style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.inputTextColor }]}
            />
            <Text style={[styles.label, { color: theme.textColor }]}>Gender</Text>
            <TextInput
                value={gender}
                onChangeText={setGender}
                style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.inputTextColor }]}
            />
            <Text style={[styles.label, { color: theme.textColor }]}>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.inputTextColor }]}
            />
            <Button title="Save" onPress={handleSave} style={styles.button} color={theme.buttonBackgroundColor}/>
            <Text style={[styles.label, { color: theme.textColor }]}>Theme Color</Text>

            <Button title="Night Mode" onPress={toggleTheme} style={styles.button}  color={theme.buttonBackgroundColor} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginVertical: 5,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
        marginBottom: 10,
    },
    colorButton: {
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
    },
    header: {
        width: "100%",
        height: 160,
        paddingHorizontal: 5,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
      },
    headerBox: {
        width: "100%",
        height: 100,
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
      },
    imgContainer: {
        width: 120,
        height: 120,
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
      title1: {
        color: "black",
        fontSize: 15,
      },
      title: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
      },
      text: {
        color: "black",
        fontSize: 10,
      },
      button: {
        width: "100px",
        height: "200px",
        objectFit: "contain",
      },
});
