import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { db, firebaseAuth } from "../firebase/firebase.config";
import { doc, onSnapshot } from "firebase/firestore";
export const AuthConstext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    // setLoading(true);
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  };
  const signInUser = (email, password) => {
    // setLoading(true);
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  };
  const logOut = () => {
    // setLoading(true);
    return signOut(firebaseAuth);
  };
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(firebaseAuth, (curtUser) => {
      if (curtUser) {
        setIsAuthenticated(true);
        setUser(curtUser);
        // setLoading(false);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        // setLoading(false);
      }
    });
    return () => {
      unSubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      // Attach a listener to the user document
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setCurrentUser({ id: doc.id, ...doc.data() });
        } else {
          setCurrentUser(null); // Document doesn't exist, set user state to null
        }
      });

      return () => unsubscribe(); // Cleanup function
    }
  }, [user, isAuthenticated]);
  // console.log("currentUser:", currentUser);
  const authInfo = {
    user,
    createUser,
    signInUser,
    isAuthenticated,
    logOut,
    currentUser,
  };
  //loading, setLoading,
  return (
    <AuthConstext.Provider value={authInfo}>{children}</AuthConstext.Provider>
  );
}
