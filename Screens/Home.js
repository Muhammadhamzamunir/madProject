import React, { useState, useEffect,useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../assets/Colors";
import { SliderBox } from "react-native-image-slider-box";
import { useAuth } from "../AuthContextApi";
import ImageSlider from "./ImageSlider";
import  BakeryCard from "./BakeryCard";
import CakeList from "./CakeList";
const Home = () => {
  const { user, updateUserInContext } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryColor}  />
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

     
        <ImageSlider/>
      {/* Categories */}
      {/* <View style={styles.categoryContainer}>
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ margin: 10 }}
        >
          <TouchableOpacity style={styles.categoryButton}>
            <Icon name="birthday-cake" size={20} color="white" />
            <Text style={styles.categoryButtonText}>Birthday</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Icon name="gift" size={20} color="white" />
            <Text style={styles.categoryButtonText}>Anniversary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Icon name="heart" size={20} color="white" />
            <Text style={styles.categoryButtonText}>Wedding</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Icon name="gift" size={20} color="white" />
            <Text style={styles.categoryButtonText}>Anniversary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Icon name="birthday-cake" size={20} color="white" />
            <Text style={styles.categoryButtonText}>Birthday</Text>
          </TouchableOpacity>
        </ScrollView>
      </View> */}
      <CakeList/>
      {/* popularCakesContainer */}
      {/* <View style={styles.popularCakesContainer}>
        <Text style={styles.popularCakesHeading}>Popular Cakes</Text>
        <View style={styles.cakeRow}>
          <TouchableOpacity style={styles.cakeCard}>
            <Image
              source={require("../assets/cake1.jpg")}
              style={styles.cakeImage}
            />
            <Text style={styles.cakeName}>Cake Name</Text>
            <View style={styles.cakeInfoRow}>
              <Icon name="fire" size={16} color="#ff66b2" />
              <Text style={styles.cakeCalories}>200 Calories</Text>
            </View>
            <Text style={styles.cakePrice}>$50.00</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cakeCard}>
            <Image
              source={require("../assets/cake2.jpg")}
              style={styles.cakeImage}
            />
            <Text style={styles.cakeName}>Cake Name</Text>
            <View style={styles.cakeInfoRow}>
              <Icon name="fire" size={16} color="#ff66b2" />
              <Text style={styles.cakeCalories}>200 Calories</Text>
            </View>
            <Text style={styles.cakePrice}>$50.00</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cakeCard}>
            <Image
              source={require("../assets/splash.png")}
              style={styles.cakeImage}
            />
            <Text style={styles.cakeName}>Cake Name</Text>
            <View style={styles.cakeInfoRow}>
              <Icon name="fire" size={16} color="#ff66b2" />
              <Text style={styles.cakeCalories}>200 Calories</Text>
            </View>
            <Text style={styles.cakePrice}>$50.00</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Bakeries Section */}
      <View style={styles.bakeriesContainer}>
        <Text style={styles.bakeriesHeading}>All Registered Bakeries</Text>
        <BakeryCard  onRefresh={onRefresh}/>
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
    placeholderTextColor: Colors.primaryColor,
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
