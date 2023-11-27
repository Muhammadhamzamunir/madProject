import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  query,
} from "firebase/firestore";
import { useAuth } from "../AuthContextApi";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Colors from "../assets/Colors";
import app from "../firebase/config";

const MyStore = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [bakeryDetails, setBakeryDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const db = getFirestore(app);

  useEffect(() => {
    fetchBakeryDetails();
    // fetchProducts();
  }, [user.uid, bakeryDetails.id, db]);

  const fetchBakeryDetails = async () => {
    try {
      const bakeryQuery = query(collection(db, "users", user.uid, "bakery"));

      const bakerySnapshot = await getDocs(bakeryQuery);

      if (!bakerySnapshot.empty) {
        const bakeryData = bakerySnapshot.docs[0].data();
        setBakeryDetails({ id: bakerySnapshot.docs[0].id, ...bakeryData });
        fetchProducts()
      } else {
        console.error("No bakery details found.");
      }
    } catch (error) {
      console.error("Error fetching bakery details:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      if (!bakeryDetails) {
        console.error("Bakery details are not available.");
        return;
      }

      const productQuery = query(
        collection(db, "users", user.uid, "bakery", bakeryDetails.id, "products")
      );
      if(productQuery){
        const productSnapshot = await getDocs(productQuery);
        const productList = [];
  
        productSnapshot && productSnapshot.forEach((doc) => {
          const productData = doc.data();
          productList.push({
            id: doc.id,
            ...productData,
          });
        });
  
        setProducts(productList);
      }
  
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchProducts();
  }, [isRefreshing]);

  const navigateToRegisterProduct = () => {
    console.log("bakery id ", bakeryDetails.id);
    navigation.navigate("RegisterProduct",{ bakeryId: bakeryDetails.id });
  };

  const navigateToProductDetails = (product) => {
    // Navigate to the screen where the user can view or edit the details of the selected product
    // You can use navigation.navigate and pass the necessary parameters or use navigation.push if needed
    console.log("Product Details:", product);
  };

  return (
    <View style={styles.container}>
      {/* Bakery Details */}
      <View style={styles.bakeryDetailsContainer}>
            <Image
              source={{ uri: bakeryDetails.image }}
              style={styles.bakeryImage}
            />
            <View style={styles.bakeryTextContainer}>
              <Text style={styles.bakeryName}>{bakeryDetails.bakeryname}</Text>
              <Text style={styles.bakeryLocation}>
                {bakeryDetails.location}
              </Text>
            </View>
            <TouchableOpacity
              // onPress={navigateToEditDetails}
              style={styles.editButton}
            >
              <FontAwesome name="edit" color={Colors.primaryColor} size={20} />
            </TouchableOpacity>
          </View>
      {/* Register Product Button */}
      <TouchableOpacity
        style={styles.registerProductButton}
        onPress={navigateToRegisterProduct}
      >
        <Text style={styles.buttonText}>Register Product</Text>
      </TouchableOpacity>
      <Text style={styles.productListHeading}>Product List</Text>
      {/* Product List */}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productItemContainer}
              onPress={() => navigateToProductDetails(item)}
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productTextContainer}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[Colors.primaryColor]}
            />
          }
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bakeryDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  bakeryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  bakeryTextContainer: {
    flex: 1,
  },
  bakeryName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bakeryLocation: {
    color: "grey",
  },
  editButton: {
    padding: 10,
  },
  registerProductButton: {
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  productListHeading: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
  },
  productItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 10,
  },
  productTextContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    color: "grey",
  },
});

export default MyStore;
