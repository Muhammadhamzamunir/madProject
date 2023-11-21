import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthContextApi = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUserJSON = await AsyncStorage.getItem('user');
        if (storedUserJSON) {
          const storedUser = JSON.parse(storedUserJSON);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error loading user from AsyncStorage:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Store user in AsyncStorage
        AsyncStorage.setItem('user', JSON.stringify(authUser));
      } else {
        setUser(null);
        // Remove user from AsyncStorage
        AsyncStorage.removeItem('user');
      }
    });

    // Load user from AsyncStorage on component mount
    loadUserFromStorage();

    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
