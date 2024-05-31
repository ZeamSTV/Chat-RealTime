import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import InputField from "../components/InputField";
import PrimaryBtn from "../components/PrimaryBtn";
import { useTheme } from "@react-navigation/native";
import { AuthConstext } from "../context/AuthProvider";

export default function Login({ navigation }) {
  const { signInUser } = useContext(AuthConstext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Sign in", "Please fill all the fields!");
      return;
    }

    try {
      setLoading(true);
      await signInUser(email, password);
      setLoading(false);
      Alert.alert("Sign in", "Login successfully!");
    } catch (error) {
      setLoading(false);
      Alert.alert("Sign in", error.message);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.imgContainer}>
          <Image
            source={require("../img/login.jpg")}
            style={styles.img}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Log in</Text>
        <InputField
          onChangeText={(value) => setEmail(value)}
          placeholder="Email"
        />
        <InputField
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
        />
        <PrimaryBtn
          disabled={loading}
          title={loading ? "Loading..." : "Login"}
          onPress={handleLogin}
        />
        {/*========= footer ========*/}
        <View style={styles.buttomText}>
          <Text style={[styles.text, { color: colors.text }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity>
            <Text
              onPress={() => {
                navigation.navigate("Signup");
              }}
              style={[styles.text, { color: "blue" }]}
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    width: "100%",
    alignItems: "center",
    // backgroundColor: "blue",
    paddingHorizontal: 20,
  },
  imgContainer: {
    width: "90%",
    height: "40%",
    // backgroundColor: "white",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "orange",
  },
  buttomText: {
    // flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
    gap: 5,
  },
  text: {
    fontSize: 18,
  },
});
