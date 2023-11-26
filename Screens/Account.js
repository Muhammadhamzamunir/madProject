import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  // SafeAreaView,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import Colors from "../assets/Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./Signup";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../firebase/config";
import { useAuth } from "../AuthContextApi";
import { SafeAreaView } from "react-native-safe-area-context";
const Account = () => {
  const { user, updateUserInContext } = useAuth();
 
  const [isModalVisible, setModalVisible] = useState(false);
  const auth = getAuth(app);
  const navigation = useNavigation();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    // <SafeAreaView>
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}></View>
      {!user && (
        <View style={styles.registrationContainer}>
          <Text style={styles.registrationText}>Are You Ready To Join Us?</Text>
          <TouchableOpacity style={styles.regButton} onPress={toggleModal}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 17,
                color: Colors.secondaryColor,
              }}
            >
              Login OR SignUp
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!user ? (
        <View style={customCSS.regbakeryView}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="bullhorn" size={25} color={Colors.primaryColor} />
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                marginLeft: 5,
                // fontFamily: "cursive",
              }}
            >
              Register Your Bakery
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 0.6 }}>
              <Text style={customCSS.regBakeryText}>
                A Good Platform to grow your business. Join us Now!😎 and Enjoy
                lot of Traffic on your website and earn lot of Money.🥳🎉
                {"\n"}
              </Text>
              <Text> Click On The Button Now!👇</Text>
              <TouchableOpacity
                style={customCSS.registerNowButton}
                onPress={() => navigation.navigate("RegisterBakery")}
              >
                <Text style={customCSS.registerNowText}>Register Now</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.4, marginLeft: 10 }}>
              <Image
                source={require("../assets/click.png")}
                style={customCSS.img}
              />
            </View>
          </View>
        </View>
      ) : (
        user &&
        !user.isBakeryRegistered && (
          <View style={customCSS.regbakeryView}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="bullhorn" size={25} color={Colors.primaryColor} />
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  marginLeft: 5,
                  // fontFamily: "cursive",
                }}
              >
                Register Your Bakery
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 0.6 }}>
                <Text style={customCSS.regBakeryText}>
                  A Good Platform to grow your business. Join us Now!😎 and
                  Enjoy lot of Traffic on your website and earn lot of
                  Money.🥳🎉
                  {"\n"}
                </Text>
                <Text> Click On The Button Now!👇</Text>
                <TouchableOpacity
                  style={customCSS.registerNowButton}
                  onPress={() => navigation.navigate("RegisterBakery")}
                >
                  <Text style={customCSS.registerNowText}>Register Now</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.4, marginLeft: 10 }}>
                <Image
                  source={require("../assets/click.png")}
                  style={customCSS.img}
                />
              </View>
            </View>
          </View>
        )
      )}

      {/* ------------------------------Modal Start---------------------------------------------------------------- */}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Icon name="times" size={20} color="black" />
          </TouchableOpacity>
          <Image
            source={require("../assets/modalCartoon.gif")}
            style={styles.modalImage}
          />

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setModalVisible(!isModalVisible);
              navigation.removeListener;
              navigation.navigate("Login");
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                color: Colors.primaryColor,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.regButton}
            onPress={() => {
              setModalVisible(!isModalVisible);

              navigation.navigate("Signup");
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                color: Colors.secondaryColor,
              }}
            >
              Create New Account
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              padding: 5,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            OR
          </Text>
          <TouchableOpacity>
            <View style={styles.googleButton}>
              <Image
                source={require("../assets/google.png")}
                style={styles.googleLogo}
              />
              <Text style={styles.buttonText}>Sign In with Google</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* ----------------------------Modal End--------------------------------------------------------------------------*/}
    </SafeAreaView>
    // </SafeAreaView>
  );
};

export default Account;
export const customCSS = StyleSheet.create({
  regbakeryView: {
    padding: 10,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
    borderBlockColor: Colors.grey,
    borderBottomWidth: 1,
    backgroundColor: "#f6e4f3",
  },
  regBakeryText: {
    padding: 6,
    color: "grey",
    marginTop: 4,
    paddingBottom: 0,
  },
  registerNowButton: {
    borderWidth: 3,
    borderColor: Colors.primaryColor,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  registerNowText: {
    color: Colors.primaryColor,
    fontSize: 16,
    fontWeight: "bold",

    textAlign: "center",
  },
  img: {
    marginTop: -14,
    marginBottom: 0,
    padding: 0,
    width: "130%",
    height: 200,
    // marginLeft:50
    resizeMode: "contain",
  },
});
