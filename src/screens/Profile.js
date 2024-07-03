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
            <View style={styles.header}>
                <View style={styles.headerBox}>
                    <TouchableOpacity>
                        <Image
                            source={require("../img/account.jpg")}
                            style={styles.img}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View style={styles.headerText}>
                        <Text style={[styles.title1, { color: theme.textColor }]}>Profile User</Text>
                        <Text style={[styles.title, { color: theme.textColor }]}>{name}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.formContainer}>
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
                <Button title="Save" onPress={handleSave} color={theme.buttonBackgroundColor} />
            </View>
            <TouchableOpacity style={styles.colorButton} onPress={toggleTheme}>
                <Text style={[styles.buttonText, { color: theme.textColor }]}>Toggle Theme</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    formContainer: {
        marginTop: 20,
    },
    header: {
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    img: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    headerText: {},
    title1: {
        fontSize: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 18,
        marginVertical: 5,
        fontWeight: 'bold',
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
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
    },
});
