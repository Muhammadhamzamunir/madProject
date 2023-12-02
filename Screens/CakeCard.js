// CakeCard.js
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const CakeCard = (props) => {
  const navigation = useNavigation();

  const handleCakePress = (cakeId) => {
    // Navigate to the CakeDetailPage with the cake ID
    navigation.navigate('CakeDetailPage', { item: cakeId });
  };

  const renderPopularCakeItem = ({ item }) => (
    <TouchableOpacity style={styles.cakeCard} onPress={() => handleCakePress(item)}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.cakeImage} />
      <Text style={styles.cakeName}>{item.productName}</Text>
      <View style={styles.cakeInfoRow}>
        <Icon name="fire" size={16} color="#ff66b2" />
        <Text style={styles.cakeCalories}>{item.category}</Text>
      </View>
      <Text style={styles.cakePrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={props.data}
        keyExtractor={(item) => item.id}
        renderItem={renderPopularCakeItem}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cakeCard: {
    width: '48%',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f4f6f9',
    marginRight: 20,
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
    fontWeight: 'bold',
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

export default CakeCard;
