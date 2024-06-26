import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";
import { firebaseAuth, firestoreDB, storage } from "../firebase/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unSubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(firebaseAuth, email, password);
      console.log("response:", response);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logOut = async () => {
    try {
      await firebaseAuth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const register = async (name, email, password, gender, address, image) => {
    try {
      const response = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      console.log("response:", response?.user);

      if (response?.user) {
        // Upload image to Firebase Storage
        const imageRef = ref(storage, `avatars/${response.user.uid}/profile.jpg`);
        const response = await fetch(image.uri);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        const imageUrl = await getDownloadURL(imageRef);

        // Save user data in Firestore
        await setDoc(doc(firestoreDB, "users", response.user.uid), {
          name,
          gender,
          address,
          userId: response.user.uid,
          avatar: imageUrl,  // Save image URL
        });

        return {
          success: true,
          data: response.user,
          message: "Account created successfully!",
        };
      }
    } catch (error) {
      return {
        success: false,
        data: error.message,
        message: "Account creation failed!",
      };
    }
  };

  const deleteAccount = async () => {
    if (firebaseAuth.currentUser) {
      try {
        await deleteUser(firebaseAuth.currentUser);
        alert("Account deleted successfully!");
      } catch (error) {
        alert("Failed to delete account: " + error.message);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logOut, register, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }
  return value;
};
