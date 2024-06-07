import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { db, firebaseAuth } from "../firebase/firebase.config";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

export const AuthConstext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const logOut = () => {
    return signOut(firebaseAuth);
  };

  const updateUser = async (userInfo) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, userInfo);
      setCurrentUser((prev) => ({ ...prev, ...userInfo }));
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(firebaseAuth, (curtUser) => {
      if (curtUser) {
        setIsAuthenticated(true);
        setUser(curtUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return () => {
      unSubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setCurrentUser({ id: doc.id, ...doc.data() });
        } else {
          setCurrentUser(null);
        }
      });

      return () => unsubscribe();
    }
  }, [user, isAuthenticated]);

  const authInfo = {
    user,
    createUser,
    signInUser,
    isAuthenticated,
    logOut,
    currentUser,
    updateUser, // Add updateUser to the context
  };

  return (
    <AuthConstext.Provider value={authInfo}>{children}</AuthConstext.Provider>
  );
}
