import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
  getDatabase,
} from "firebase/database";
import app from "../firebase/config";

const CakesByCategory = ({ route }) => {
  const { category } = route.params;
  const [cakes, setCakes] = useState([]);
  const database = getDatabase(app);

  
  useEffect(() => {
    const fetchCakesByCategory = async () => {
      try {
        if (!category) {
          console.error("Category is undefined");
          return;
        }

        const productsRef = ref(database, "products");
        const categoryQuery = query(productsRef, orderByChild("category"), equalTo(category));

        onValue(categoryQuery, (snapshot) => {
          const data = snapshot.val();
          const cakesArray = data ? Object.values(data) : [];

          setCakes(cakesArray);
        });
      } catch (error) {
        console.error("Error fetching cakes by category:", error.message);
      }
    };

    fetchCakesByCategory();
  }, [category]);

  const renderCakeItem = ({ item }) => (
    <TouchableOpacity style={styles.cakeCard}>
      <Image source={{ uri: item.image || "https://via.placeholder.com/150" }} style={styles.cakeImage} />
      <Text style={styles.cakeName}>{item.productName}</Text>
      <Text style={styles.cakePrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.categoryHeading}>{category}</Text>
      <FlatList
        data={cakes}
        keyExtractor={(item) => item.id}
        renderItem={renderCakeItem}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  categoryHeading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  cakeCard: {
    width: "48%",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    marginRight: 20,
  },
  cakeImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  cakeName: {
    fontSize: 16,
    color: "#000",
    marginTop: 10,
    paddingHorizontal: 10,
    fontWeight: "bold",
  },
  cakePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default CakesByCategory;
