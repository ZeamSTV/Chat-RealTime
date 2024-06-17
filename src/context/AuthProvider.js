import { arrayUnion, updateDoc, doc, arrayRemove, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db, firebaseAuth } from "../firebase/firebase.config";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const AuthConstext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [friends, setFriends] = useState([]); // Added friends state

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

  const sendFriendRequest = async (requestUserId) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const requestUserDocRef = doc(db, "users", requestUserId);

      // Add the user's ID to the request user's friend requests list
      await updateDoc(requestUserDocRef, {
        friendRequests: arrayUnion(user.uid),
      });
    }
  };

  const acceptFriendRequest = async (requestUserId) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const requestUserDocRef = doc(db, "users", requestUserId);

      // Add the requester to the user's friends list
      await updateDoc(userDocRef, {
        friends: arrayUnion(requestUserId),
        friendRequests: arrayRemove(requestUserId),
      });

      // Add the user to the requester's friends list
      await updateDoc(requestUserDocRef, {
        friends: arrayUnion(user.uid),
      });

      // Update the current user and friends state
      setFriends((prev) => [...prev, requestUserId]);
      setCurrentUser((prev) => ({
        ...prev,
        friends: [...(prev.friends || []), requestUserId],
        friendRequests: (prev.friendRequests || []).filter((id) => id !== requestUserId),
      }));
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
          const userData = doc.data();
          setCurrentUser({ id: doc.id, ...userData });
          setFriends(userData.friends || []);
        } else {
          setCurrentUser(null);
          setFriends([]);
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
    updateUser,
    sendFriendRequest, // Export the function
    acceptFriendRequest, // Export the function
    friends,
  };

  return (
    <AuthConstext.Provider value={authInfo}>{children}</AuthConstext.Provider>
  );
}
