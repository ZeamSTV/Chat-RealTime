import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../firebase/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { getDoc, doc, setDoc } from "firebase/firestore";
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
  const login = async () => {
    const response = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    console.log("response:", response);
    try {
    } catch (error) {}
  };
  const logOut = async (email, password) => {
    try {
    } catch (error) {}
  };
  const register = async (name, email, password, gender, address) => {
    try {
      const response = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      console.log("response:", response?.user);

      if (response?.user) {
        //   setUser(response?.user);
        //   setIsAuthenticated(true);
        await doc(doc(firestoreDB, "users", response?.user.uid), {
          name,
          gender,
          address,
          userId: response?.user.uid,
        });
        return {
          success: true,
          data: response?.user,
          message: "Account created successfully!",
        };
      }
    } catch (error) {
      return {
        success: false,
        data: error.message,
        message: "Account created failed!",
      };
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logOut, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("UseAuth must be wrapped inside AuthContextProvider");
  }
  return value;
};
