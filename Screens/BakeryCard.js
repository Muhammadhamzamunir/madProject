// BakeryCard.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Colors from "../assets/Colors";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import app from "../firebase/config";
import { useNavigation } from "@react-navigation/native";


const BakeryCard = (onRefresh) => {
  const [allBakeries, setAllBakeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getAllBakeries = async () => {
    setLoading(true)
    const db = getFirestore(app);
    const usersCollection = collection(db, "users");
  
    const usersQuery = query(usersCollection);
  
    try {
      const usersSnapshot = await getDocs(usersQuery);
  
      const allBakeries = [];
  
      // Iterate through all users and their bakeries
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const bakeriesCollection = collection(db, `users/${userId}/bakery`);
        const bakeriesQuery = query(bakeriesCollection);
        const bakeriesSnapshot = await getDocs(bakeriesQuery);
  
        bakeriesSnapshot.forEach((bakeryDoc) => {
          const bakeryData = bakeryDoc.data();
          allBakeries.push({
            userId,
            bakeryId: bakeryDoc.id,
            ...bakeryData,
          });
        });
      }
     
  
      setAllBakeries(allBakeries);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bakeries:", error);
      throw error;
    }
  };


  useEffect(() => {
    getAllBakeries().catch((error) =>
      console.error("Error fetching bakeries:", error)
    );
  }, [onRefresh]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color={Colors.primaryColor} />
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      
      {allBakeries.map((bakery) => (
        <TouchableOpacity
          key={bakery.bakeryId}
          style={styles.cardContainer}
           onPress={() => navigation.navigate('BakeryDetail', { bakery })}
        >
          <Image source={{ uri: bakery.image }} style={styles.bakeryImage} />
          <View style={styles.textContainer}>
            <Text style={styles.bakeryName}>{bakery.bakeryname}</Text>
            <Text style={styles.ownerName}>{bakery.ownername}</Text>
          </View>
        </TouchableOpacity>
      ))}
     
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
   
    borderWidth:1,
    marginHorizontal:15,borderColor:"lightgrey"
  },
  bakeryImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
    // backgroundColor: Colors.lightGray,
  },
  textContainer: {
    padding: 10,
  },
  bakeryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  ownerName: {
    fontSize: 14,
    color: Colors.primaryColor,
  },
});

export default BakeryCard;
