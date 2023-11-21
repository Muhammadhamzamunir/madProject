import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, getFirestore,collection } from "firebase/firestore";
import app from "./firebase/config";
const AuthContext = createContext();

export const AuthContextApi = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(async () => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = () => {
    AsyncStorage.getItem("user").then((user) => {
      setUser(user);
      console.log("user from storage: ", user);
    });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const db = getFirestore(app);
        const usersCollection = collection(db, "users");
        const authUserDoc = doc(usersCollection, userId);
        getDoc(authUserDoc)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              const userDataString = JSON.stringify(userData);
              setUser(userData);
              AsyncStorage.setItem('user', userDataString).then(() => {
                console.log('User stored in local storage');
              });
             
            } 
          })
        
      } else {
       
        AsyncStorage.removeItem('user').then(() => {
          console.log('User removed from local storage');
        });
  
        setUser(null); 
       
      }
    });
  
     return () => {
      unsubscribe();
    };
  }, [auth]);
  
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
