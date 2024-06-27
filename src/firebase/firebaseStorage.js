// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { db } from "../firebase/firebase.config";
// import { doc, updateDoc } from "firebase/firestore";

// export const uploadImage = async (uri, userId) => {
//   const response = await fetch(uri);
//   const blob = await response.blob();

//   const storage = getStorage();
//   const storageRef = ref(storage, `avatars/${userId}`);

//   await uploadBytes(storageRef, blob);

//   const downloadURL = await getDownloadURL(storageRef);

//   const userRef = doc(db, "users", userId);
//   await updateDoc(userRef, {
//     avatar: downloadURL,
//   });

//   return downloadURL;
// };
