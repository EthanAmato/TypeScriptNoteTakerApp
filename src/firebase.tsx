import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider, getAuth, signInWithPopup,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail,
  signOut,
  updateProfile
} from "firebase/auth"
import { getFirestore, query, getDocs, collection, where, addDoc, doc, getDoc, limit, setDoc, updateDoc, } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { NoteData } from "./App";
import {firebaseConfig} from '../secrets'


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        userNotes: [],
        userTags: [],
      });
    }
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};
const logInWithEmailAndPassword = async (email: string, password: string, setIsError: any) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    setIsError(true);
    console.error(err);
  }
};
const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    console.log(name,email,password)
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await updateProfile(user, {displayName:name}).catch((err)=>{console.log(err)})
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      userNotes: [],
      userTags: [],
    });
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordReset = async (email: string) => {
  console.log(email)
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset link sent!")
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};
const logout = () => {
  signOut(auth);
};

const updateUserNotes = async (id: string | undefined, key:string, data:any) => {
  const q = query(collection(db, "users"), where("uid", "==", id)); 
  const userRef = await getDocs(q);
  const docId = userRef.docs[0].id;
  const docRef = doc(db, "users", docId);
  switch(key) {
    case "TAGS":
      await updateDoc(docRef, {
        userTags: data
      })
      break
    case "NOTES":
      await updateDoc(docRef, {
        userNotes: data
      })
      break
    default:
      break;
  }
}

const getUserNotes = async (id: string | null | undefined) => {
  const q = query(collection(db, "users"), where("uid", "==", id)); 
  const userRef = await getDocs(q);
  const docData = userRef.docs[0].data();
  const userData = {
    userNotes: docData['userNotes'],
    userTags: docData['userTags']
  }
  return userData;
}



export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  updateUserNotes,
  getUserNotes
};