import React, { useState } from "react";
import { styles } from "./Signup";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import Colors from "../assets/Colors";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import app from "../firebase/config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from "native-base";
// import DocumentPicker from 'react-native-document-picker';
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
    .required("Price for Decoration is required"),
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
    bakeryImage: yup.mixed().required("Bakery Image is required"),
});

const RegisterBakery = () => {
  const navigation = useNavigation();
  const auth = getAuth(app);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [bakeryImage, setBakeryImage] = useState(null);

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
            }}
            validationSchema={RegisterBakerySchema}
            onSubmit={(values, { resetForm }) => {
              setLoading(true);
              // Your form submission logic here
              setLoading(false);
              resetForm();
              toast.show({
                title: "Bakery registered successfully",
                status: "success",
                placement: "top",
                duration: 3000,
                style: { top: "5%", backgroundColor: "#2ecc71" },
              });
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
                <Text style={styles.title}>Register Your Bakery</Text>
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

                {/* Customize Cake Info */}
                <Text style={styles.title}>Customize Cake Info</Text>
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
                    <Text style={styles.errorText}>
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
                    <Text style={styles.errorText}>
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
