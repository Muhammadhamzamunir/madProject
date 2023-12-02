// CakeDetailPage.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../assets/Colors';

const CakeDetailPage = ({ route }) => {
  console.log(route.params.item.productName);
  const { item } = route.params;
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Add logic to add the cake to the cart
    // You can use a state management solution or dispatch an action here
    console.log('Cake added to cart:', item);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/300' }} style={styles.cakeImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.cakeName}>{item.productName}</Text>
        <View style={styles.cakeInfoRow}>
          <Icon name="fire" size={16} color="#ff66b2" />
          <Text style={styles.cakeCalories}>{item.category}</Text>
        </View>
        <Text style={styles.cakeDescription}>{item.description}</Text>
        <Text style={styles.cakePrice}>${item.price}</Text>
      </View>
      <View style={styles.interactiveContainer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => setQuantity(quantity - 1)}>
            <Icon name="minus" size={20} color={Colors.primaryColor} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
            <Icon name="plus" size={20} color={Colors.primaryColor} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cakeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  cakeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cakeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cakeCalories: {
    fontSize: 16,
    color: '#777',
    marginLeft: 5,
  },
  cakeDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  cakePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  interactiveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  addToCartButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CakeDetailPage;
