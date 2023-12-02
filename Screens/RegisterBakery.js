import React, { useEffect, useState } from "react";
import { styles } from "./Signup";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  PermissionsAndroid,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Formik } from "formik";

import * as yup from "yup";
import Colors from "../assets/Colors";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, doc, setDoc,getCurrentUser, updateDoc,getDoc } from "firebase/firestore";
import app from "../firebase/config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../AuthContextApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
const RegisterBakerySchema = yup.object({
  ownername: yup.string().required("Owner's Name is required"),
  bakeryname: yup.string().required("Bakery Name is required"),
  speciality: yup.string().required("Speciality is required"),
  contactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Contact Number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  timing: yup.string().required("Timing is required"),
  pricePerPound: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Price per Pound is required"),
  priceForDecoration: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Decoration Price is required"),
  priceForTiers: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Price for Tiers is required"),
  priceForShape: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Price for Shape is required"),
  tax: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Tax is required"),
  // bakeryImage: yup.mixed().required("Bakery Image is required"),
  location: yup.string().required("Address is required"),
  country: yup.string().required("Country is required"),
  zipCode: yup.string().required("zipCode is required"),
});

const RegisterBakery = () => {
  const { user, updateUserInContext } = useAuth();
  const toast = useToast();
  const storage = getStorage(app);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const db = getFirestore(app);
  const handleImagePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });

      if (!result.cancelled) {
        setSelectedImage(result.assets[0].uri);
      } else {
        console.log("Image picking canceled");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const registerBakeryHandle = async (values) => {
    console.log("hello");
    try {
      setLoading(true);
     
  
      // Check if an image is selected
      if (!selectedImage) {
        // throw new Error("Please select an image.");
        toast.show({
          title: "Please select an image.",
          description: error.message || "An error occurred.",
          status: "error",
          placement: "top",
          duration: 3000,
          style: { top: "5%", backgroundColor: "#e74c3c" },
        });
      }
  
      // Generate a unique filename for the image using a timestamp
      const timestamp = new Date().getTime();
      const fileExtension = selectedImage.split(".").pop().toLowerCase();
      const fileName = `bakery_image_${timestamp}.${fileExtension}`;
      
      // Reference to the storage path
      const storageRef = ref(storage, `bakery_images/${fileName}`);
      
      // Convert the selected image URI to a blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      
      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, blob);
      
      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
      
    
      const userDocRef = doc(collection(db, "users"), user.uid);
        updateDoc(userDocRef,{
          isBakeryRegistered:true
        })

    // Create a bakery subcollection
    const bakeryCollectionRef = collection(db, "bakeries")
    const bakeryDoc = doc(bakeryCollectionRef,user.uid)
      await setDoc(bakeryDoc, {
        image: downloadURL,
        ownername: values.ownername,
        bakeryname: values.bakeryname,
        speciality: values.speciality,
        contactNumber: values.contactNumber,
        email: values.email,
        timing: values.timing,
        pricePerPound: values.pricePerPound,
        priceForDecoration: values.priceForDecoration,
        priceForTiers: values.priceForTiers,
        priceForShape: values.priceForShape,
        tax: values.tax,
        location: values.location,
        country: values.country,
        zipCode: values.zipCode,
        bakeryId:user.uid
      });
  
      AsyncStorage.getItem('user').then((userData) => {
        const userinfo = JSON.parse(userData);
       
        const UpdatedUser = {
          ...userinfo,
          isBakeryRegistered: true,
        };
        AsyncStorage.setItem('user', JSON.stringify(UpdatedUser));
        updateUserInContext({ ...user, isBakeryRegistered: true });
     
      });
      
      
  
      setLoading(false);
  
      toast.show({
        title: "Bakery registered successfully",
        status: "success",
        placement: "top",
        duration: 3000,
        style: { top: "5%", backgroundColor: "#2ecc71" },
      });
    } catch (error) {
      console.error("Error in registerBakeryHandle:", error);
  
      setLoading(false);
  
      toast.show({
        title: "Failed to register bakery",
        description: error.message || "An error occurred.",
        status: "error",
        placement: "top",
        duration: 3000,
        style: { top: "5%", backgroundColor: "#e74c3c" },
      });
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              ownername: "",
              bakeryname: "",
              speciality: "",
              contactNumber: "",
              email: "",
              timing: "",
              pricePerPound: "",
              priceForDecoration: "",
              priceForTiers: "",
              priceForShape: "",
              tax: "",
              bakeryImage: null,
              location: "",
              country: "",
              zipCode: "",
            }}
            validationSchema={RegisterBakerySchema}
            onSubmit={(values, { resetForm }) => {
              registerBakeryHandle(values)
              resetForm();
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.formContainer}>
                {/* Bakery Information */}
                <Image
                  source={require("../assets/splash.png")}
                  style={styles.image}
                />
                <Text
                  style={{
                    color: Colors.primaryColor,
                    fontSize: 29,
                    fontWeight: "bold",
                    padding: 10,
                  }}
                >
                  Register Your Bakery
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Owner's Name"
                  onChangeText={handleChange("ownername")}
                  onBlur={handleBlur("ownername")}
                  value={values.ownername}
                />
                <Text style={styles.errorText}>
                  {touched.ownername && errors.ownername}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Bakery Name"
                  onChangeText={handleChange("bakeryname")}
                  onBlur={handleBlur("bakeryname")}
                  value={values.bakeryname}
                />
                <Text style={styles.errorText}>
                  {touched.bakeryname && errors.bakeryname}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Speciality"
                  onChangeText={handleChange("speciality")}
                  onBlur={handleBlur("speciality")}
                  value={values.speciality}
                />
                <Text style={styles.errorText}>
                  {touched.speciality && errors.speciality}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Contact Number"
                  onChangeText={handleChange("contactNumber")}
                  onBlur={handleBlur("contactNumber")}
                  value={values.contactNumber}
                  keyboardType="numeric"
                />
                <Text style={styles.errorText}>
                  {touched.contactNumber && errors.contactNumber}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                <Text style={styles.errorText}>
                  {touched.email && errors.email}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Timing"
                  onChangeText={handleChange("timing")}
                  onBlur={handleBlur("timing")}
                  value={values.timing}
                />
                <Text style={styles.errorText}>
                  {touched.timing && errors.timing}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginHorizontal: 30,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.primaryColor,
                      padding: 10,
                      borderRadius: 15,
                      marginRight: 70,
                    }}
                    onPress={handleImagePicker}
                  >
                    <Text style={styles.regButtonText}>Upload Image</Text>
                  </TouchableOpacity>
                  {selectedImage ? (
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.image}
                    />
                  ) : (
                    <Image
                      source={require("../assets/empty-image.png")}
                      style={styles.image}
                    />
                  )}
                </View>

                {/* location information */}
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "grey",
                    marginVertical: 10,
                  }}
                >
                  Location Information
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={values.location}
                  onChangeText={handleChange("location")}
                  onBlur={handleBlur("location")}
                />

                <Text style={styles.errorText}>
                  {touched.location && errors.location}
                </Text>

                <View style={styles.rowContainer}>
                  <View style={styles.halfInputContainer}>
                    <TextInput
                      style={styles.halfInput}
                      placeholder="Country"
                      value={values.country}
                      onChangeText={handleChange("country")}
                      onBlur={handleBlur("country")}
                    />
                    <Text style={[styles.errorText, { marginLeft: 0 }]}>
                      {touched.country && errors.country}
                    </Text>
                  </View>
                  <View style={styles.halfInputContainer}>
                    <TextInput
                      style={styles.halfInput}
                      placeholder="Zip Code"
                      value={values.zipCode}
                      onChangeText={handleChange("zipCode")}
                      onBlur={handleBlur("zipCode")}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.errorText, { marginLeft: 0 }]}>
                      {touched.zipCode && errors.zipCode}
                    </Text>
                  </View>
                </View>
                {/* Customize Cake Info */}
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "grey" }}
                >
                  Customize Cake Info
                </Text>
                <View style={styles.rowContainer}>
                  <View style={styles.halfInputContainer}>
                    <TextInput
                      style={styles.halfInput}
                      placeholder="Price per Pound"
                      onChangeText={handleChange("pricePerPound")}
                      onBlur={handleBlur("pricePerPound")}
                      value={values.pricePerPound}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.errorText, { marginLeft: 0 }]}>
                      {touched.pricePerPound && errors.pricePerPound}
                    </Text>
                  </View>
                  <View style={styles.halfInputContainer}>
                    <TextInput
                      style={styles.halfInput}
                      placeholder="Price for Decoration"
                      onChangeText={handleChange("priceForDecoration")}
                      onBlur={handleBlur("priceForDecoration")}
                      value={values.priceForDecoration}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.errorText, { marginLeft: 0 }]}>
                      {touched.priceForDecoration && errors.priceForDecoration}
                    </Text>
                  </View>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Price for Tiers"
                  onChangeText={handleChange("priceForTiers")}
                  onBlur={handleBlur("priceForTiers")}
                  value={values.priceForTiers}
                  keyboardType="numeric"
                />
                <Text style={styles.errorText}>
                  {touched.priceForTiers && errors.priceForTiers}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Price for Shape"
                  onChangeText={handleChange("priceForShape")}
                  onBlur={handleBlur("priceForShape")}
                  value={values.priceForShape}
                  keyboardType="numeric"
                />
                <Text style={styles.errorText}>
                  {touched.priceForShape && errors.priceForShape}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Tax"
                  onChangeText={handleChange("tax")}
                  onBlur={handleBlur("tax")}
                  value={values.tax}
                  keyboardType="numeric"
                />
                <Text style={styles.errorText}>
                  {touched.tax && errors.tax}
                </Text>

                <TouchableOpacity
                  style={styles.regButton}
                  onPress={handleSubmit}
                >
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.secondaryColor}
                    />
                  ) : (
                    <Text style={styles.regButtonText}>Register Bakery</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   // Existing styles...

// });

export default RegisterBakery;
