import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/InputField";
import PrimaryBtn from "../components/PrimaryBtn";
import { doc, setDoc } from "firebase/firestore";
import { AuthConstext } from "../context/AuthProvider";
import { db } from "../firebase/firebase.config";

export default function Signup() {
  const { createUser } = useContext(AuthConstext);
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const HandleSignUp = async () => {
    if (!name || !email || !password || !gender || !address) {
      Alert.alert("Sign up", "Please fill all the fields!");
      return;
    }

    try {
      setLoading(true);
      const response = await createUser(email, password);
      setLoading(false);
      await setDoc(doc(db, "users", response.user.uid), {
        name,
        email,
        gender,
        address,
        userId: response.user.uid,
      });
      // await setDoc(doc(db, "userChats", response.user.uid), {});
      // navigation.navigate("Login");
      Alert.alert("Sign up", "Account created successfully!");
    } catch (error) {
      setLoading(false);
      Alert.alert("Sign up", error.message);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/*============ Body ==============*/}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/*============ Header ==============*/}

          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
          >
            <View>
              <View style={styles.header}>
                <Image
                  source={require("../img/account.jpg")}
                  style={styles.img}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 24,
                  color: "black",
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                Create accounts
              </Text>
            </View>
            <InputField
              placeholder="Name"
              onChangeText={(value) => setName(value)}
            />
            <InputField
              placeholder="Email"
              onChangeText={(value) => setEmail(value)}
              autoCapitalize="none"
            />
            <InputField
              placeholder="Password"
              onChangeText={(value) => setPassword(value)}
              autoCapitalize="none"
              secureTextEntry={true}
            />
            <InputField
              placeholder="Gender"
              onChangeText={(value) => setGender(value)}
            />
            <InputField
              placeholder="Address"
              onChangeText={(value) => setAddress(value)}
            />
            <PrimaryBtn
              disabled={loading}
              title={loading ? "Loading..." : "Submit"}
              onPress={HandleSignUp}
            />
            {/*========= footer ========*/}
            <View style={styles.buttomText}>
              <Text style={[styles.text, { color: "black" }]}>
                Have an account?
              </Text>
              <TouchableOpacity>
                <Text
                  onPress={() => {
                    navigation.navigate("Login");
                  }}
                  style={[styles.text, { color: "blue" }]}
                >
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
// "#e8e8f1" || "#691292"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10,
    height: "100%",
  },
  header: {
    height: 200,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  buttomText: {
    justifyContent: "flex-end",
    flexDirection: "row",
    marginVertical: 5,
    width: "100%",
    gap: 5,
  },
  text: {
    fontSize: 18,
  },
});
