import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../assets/Colors";
import { useAuth } from "../AuthContextApi";
import ImageSlider from "./ImageSlider";
import BakeryCard from "./BakeryCard";
import CakeList from "./CakeList";
import {
  collection,
  getDocs,
  getFirestore,
  // query,
  // orderBy,
  // limit,
} from "firebase/firestore";
import app from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import {
  ref,
  orderBy,
  limit,
  query,
  get,
  getDatabase,
  orderByChild,
  exists,
  onValue,
  equalTo,
  limitToFirst,limitToLast
} from "firebase/database";
const Home = () => {
  const { user, updateUserInContext } = useAuth();
  const db = getFirestore(app);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [popularCakes, setPopularCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();
  const database = getDatabase(app);
  useEffect(() => {
    getCategories();
    getPopularCakes();
  }, []);
  const productsRef = ref(database, "products");
  const getCategories = () => {
    try {
      const queryResult = query(productsRef, orderByChild("category"));

      onValue(queryResult, (snapshot) => {
        const data = snapshot.val();
        const categoryArray = [];

        if (data) {
          Object.values(data).forEach((product) => {
            if (!categoryArray.includes(product.category)) {
              categoryArray.push(product.category);
            }
          });
        }
        setCategories(categoryArray);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getPopularCakes = () => {
    const PopularCakesQueryResult = query(
      productsRef,
      orderByChild("averageRating"),
      limitToLast(2)
    );

    onValue(PopularCakesQueryResult, (snapshot) => {
      const data = snapshot.val();
      const popularCakesArray = [];

      if (data) {
        // Object.values(data).forEach((product) => {
        //   popularCakesArray.push({
        //     id: product.id,
        //     ...product,
        //   });
        // });
        Object.keys(data)
        .sort((a, b) => data[b].averageRating - data[a].averageRating)
        .slice(0, 4)
        .forEach((id) => {
          popularCakesArray.push({
            id,
            ...data[id],
          });
        });
      }

      // console.log(popularCakesArray);
      setPopularCakes(popularCakesArray);
      setLoading(false);
    });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryButton} key={item}>
      <Icon
        name={item ? "birthday-cake" : "birthday-cake"}
        size={20}
        color="white"
      />
      <Text style={styles.categoryButtonText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderPopularCakeItem = ({ item }) => (
    <TouchableOpacity style={styles.cakeCard} key={item.id}>
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.cakeImage}
      />
      <Text style={styles.cakeName}>{item.productName}</Text>
      <View style={styles.cakeInfoRow}>
        <Icon name="fire" size={16} color="#ff66b2" />
        <Text style={styles.cakeCalories}>{item.category}</Text>
      </View>
      <Text style={styles.cakePrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primaryColor}
        />
      }
    >
      {/* User Profile  */}
      <View style={styles.header}>
        <View style={styles.userProfileContainer}>
          <Image
            source={require("../assets/splash.png")}
            style={styles.userProfileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user ? user.username : "Unknown"}
            </Text>
            <Text style={styles.userAddress}>
              {user ? user.email : "Not Specified"}
            </Text>
          </View>
        </View>
      </View>
      {/* end user profile */}

      {/* searchBar  */}
      <View
        style={[
          styles.userProfileContainer,
          { justifyContent: "center", alignItems: "center", marginBottom: 10 },
        ]}
      >
        <TextInput
          style={styles.searchContainer}
          placeholder="Search "
          placeholderTextColor={Colors.primaryColor}
        />
        <TouchableOpacity style={styles.filterIcon}>
          <Icon name="bars" size={20} color={Colors.primaryColor} />
        </TouchableOpacity>
      </View>
      {/* end earch bar */}

      <ImageSlider />
      <View style={styles.container}>
        {/* Categories */}
        <View style={styles.categoryContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.categoryHeading}>Categories</Text>
            <TouchableOpacity>
              <Text style={{ color: Colors.primaryColor }}>View all </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={renderCategoryItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ margin: 10 }}
            />
          )}
        </View>

        {/* popularCakesContainer */}
        <View style={styles.popularCakesContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.categoryHeading}>Popular Cakes</Text>
            <TouchableOpacity onPress={() => navigation.navigate("CakeList")}>
              <Text style={{ color: Colors.primaryColor }}>View all </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          ) : (
            <FlatList
              data={popularCakes}
              keyExtractor={(item) => item.id}
              renderItem={renderPopularCakeItem}
              numColumns={2}
            />
          )}
        </View>
      </View>

      {/* Bakeries Section */}
      <View style={styles.bakeriesContainer}>
        <Text style={styles.bakeriesHeading}>All Registered Bakeries</Text>
        <BakeryCard onRefresh={onRefresh} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userProfileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userProfileImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
    borderWidth: 1,
  },
  userInfo: {
    flexDirection: "column",
  },
  userName: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.primaryColor,
  },
  userAddress: {
    fontSize: 13,
    color: "#777",
  },
  bakeriesContainer: {
    padding: 20,
    marginTop: 10,
  },
  bakeriesHeading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  searchContainer: {
    shadowOpacity: 0.6,
    shadowColor: Colors.primaryColor,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    width: "80%",
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    backgroundColor: "white",
    // placeholderTextColor: Colors.primaryColor,
  },
  filterIcon: {
    padding: 6,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.primaryColor,
  },

  productName: {
    fontSize: 16,
    color: "#000",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  categoryContainer: {
    padding: 15,
    marginTop: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderBottomColor: "#ccc",
  },
  categoryHeading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
  },
  categoryButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: Colors.primaryColor,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryButtonText: {
    fontSize: 16,
    color: "white",
    marginLeft: 5,
  },

  popularCakesContainer: {
    padding: 20,
  },
  popularCakesHeading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  popularCakesContainer: {
    padding: 20,
  },
  popularCakesHeading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  cakeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
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
    fontWeight:"bold",
    paddingHorizontal: 10,
  },
  cakeInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    paddingHorizontal: 10,
  },
  cakeCalories: {
    fontSize: 14,
    color: "#777",
    marginLeft: 5,
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

export default Home;

// import { ref, orderBy, limit, query, get, getDatabase } from 'firebase/database';

// const getCategories = async () => {
//   try {
//     const productsRef = ref(getDatabase(), 'products');

//     // Get categories
//     const categories = [];
//     const categoriesSnapshot = await get(productsRef);
//     for (const productId in categoriesSnapshot.val()) {
//       const product = categoriesSnapshot.val()[productId];
//       for (const itemId in product.items) {
//         const itemDetails = product.items[itemId].details;
//         if (itemDetails && itemDetails.category && !categories.includes(itemDetails.category)) {
//           categories.push(itemDetails.category);
//         }
//       }
//     }

//     // Get popular cakes
//     const itemsQuery = query(
//       productsRef,
//       orderBy('items/details/averageRating', 'desc'),
//       limit(4)
//     );
//     const itemsSnapshot = await get(itemsQuery);

//     const cakes = [];
//     itemsSnapshot.forEach((itemSnapshot) => {
//       const itemData = { ...itemSnapshot.val().items, id: itemSnapshot.key };
//       cakes.push(itemData);
//     });

//     setPopularCakes(cakes);
//     setCategories(categories);
//   } catch (error) {
//     console.error('Error getting popular cakes:', error);
//   } finally {
//     setLoading(false);
//   }
// };
