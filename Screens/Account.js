import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import Colors from "../assets/Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./Signup";

const Account = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.settingIcon}>
          <Icon name="gear" size={23} color="black" />
        </TouchableOpacity>
      </View>
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
            navigation.removeListener
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
  
              navigation.navigate("Signup",);
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
  );
};

export default Account;

//  export const styles = StyleSheet.create({
 
// });
