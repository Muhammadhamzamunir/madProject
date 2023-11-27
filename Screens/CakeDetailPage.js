import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const CakeDetailPage = ({route}) => {
  return (
    <View style={styles.container}>
      {/* Top Left Corner */}
      <View style={styles.topLeftContainer}>
        <Text style={styles.currentTime}>10:30 AM</Text>
        <Text style={styles.videoTitle}>Chocolate Truffle Cake</Text>
      </View>

      {/* Cake Image */}
      <Image
        source={require('../assets/cake2.jpg')}
        style={styles.cakeImage}
      />

      {/* Cake Details */}
      <View style={styles.cakeDetailsContainer}>
        <Text style={styles.cakePrice}>$25.00</Text>
        <Text style={styles.calories}>Calories: 300</Text>
        <Text style={styles.cakeType}>Cake Type: Eggless</Text>
        <Text style={styles.cakeSize}>Cake Size: 6" (Serves 6-8)</Text>
        <Text style={styles.glutenFreeOption}>Gluten-Free Option: +$10.00</Text>

        {/* Cake Description */}
        <Text style={styles.cakeDescription}>
          A decadent chocolate truffle cake made with the finest cocoa and rich
          chocolate ganache. Indulge in the velvety texture and intense flavor
          of this exquisite dessert. Perfect for any celebration or to satisfy
          your chocolate cravings!
        </Text>

        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Shopping Cart Icon */}
      <TouchableOpacity style={styles.shoppingCartIcon}>
        {/* Insert shopping cart icon image here */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topLeftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  currentTime: {
    fontSize: 16,
    color: '#777',
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  cakeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  cakeDetailsContainer: {
    marginBottom: 20,
  },
  cakePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  calories: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  cakeType: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
  cakeSize: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
  glutenFreeOption: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
  cakeDescription: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  addToCartButton: {
    backgroundColor: '#E44D26',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addToCartButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  shoppingCartIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default CakeDetailPage;
