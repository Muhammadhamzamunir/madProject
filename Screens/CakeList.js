import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import app from '../firebase/config';

const CakeList = () => {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);

        const allCakes = [];

        for (const userDoc of usersSnapshot.docs) {
          const bakeryCollectionRef = collection(userDoc.ref, 'bakery');
          const bakerySnapshot = await getDocs(bakeryCollectionRef);

          for (const bakeryDoc of bakerySnapshot.docs) {
            const productsCollectionRef = collection(bakeryDoc.ref, 'products');
            const productsSnapshot = await getDocs(productsCollectionRef);

            productsSnapshot.forEach((productDoc) => {
              const productData = { ...productDoc.data(), id: productDoc.id };
              allCakes.push(productData);
            });
          }
        }

        setCakes(allCakes);
      } catch (error) {
        console.error('Error getting all products:', error);
      } finally {
        setLoading(false);
      }
    };

    getAllProducts();
  }, []);

  const renderCakeItem = ({ item }) => (
    <TouchableOpacity style={styles.cakeCard}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.cakeImage} />
      <Text style={styles.cakeName}>{item.productName}</Text>
      <View style={styles.cakeInfoRow}>
        <Text style={styles.cakeCalories}>{item.description}</Text>
      </View>
      <Text style={styles.cakePrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cakeCard: {
    width: '48%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  cakeImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  cakeName: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  cakeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  cakeCalories: {
    fontSize: 14,
    color: '#777',
    marginLeft: 5,
  },
  cakePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default CakeList;
