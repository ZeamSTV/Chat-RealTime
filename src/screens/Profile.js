import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
            <Text style={[styles.label, { color: theme.textColor }]}>Theme Color</Text>

            <Button title="Toggle Theme" onPress={toggleTheme} color={theme.buttonBackgroundColor} />
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
});
