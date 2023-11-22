import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  // SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import Colors from "../assets/Colors";
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import app from "../firebase/config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useToast, NativeBaseProvider } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
const SignupSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Phone number is required"),
});

const Signup = () => {
  const navigation = useNavigation();
  const auth = getAuth(app);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
              phoneNumber: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values, { resetForm }) => {
              setLoading(true);
              createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
              )
                .then((userCredential) => {
                  const createdUser = userCredential.user;
                  const db = getFirestore(app);
                  const usersCollection = collection(db, "users");
                  const userDocRef = doc(usersCollection, createdUser.uid);
                  setDoc(userDocRef, {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                    phone: values.phoneNumber,
                  });
                  setLoading(false);
                  toast.show({
                    title: "User created successfully",
                    status: "success",
                    placement: "top",
                    duration: 3000,
                    style: { top: "5%", backgroundColor: "#2ecc71" },
                  });
                  resetForm();
                  navigation.navigate("Login");
                })
                .catch((error) => {
                  setLoading(false);
                  let errorMessage = "An error occurred. Please try again.";

                  switch (error.code) {
                    case "auth/invalid-email":
                      errorMessage = "Invalid email address.";
                      break;
                    case "auth/email-already-in-use":
                      errorMessage = "Email address is already in use.";
                      break;
                    case "auth/weak-password":
                      errorMessage =
                        "Password is too weak. Please choose a stronger password.";
                      break;

                    default:
                      break;
                  }

                  toast.show({
                    title: errorMessage,
                    status: "error",
                    placement: "top",
                    duration: 3000,
                    style: { top: "5%", backgroundColor: "#e74c3c" },
                  });
                });
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View style={styles.formContainer}>
                <Image
                  source={require("../assets/splash.png")}
                  style={styles.image}
                />
                <Text style={styles.title}>Create an Account</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                />
                <Text style={styles.errorText}>{errors.username}</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                <Text style={styles.errorText}>{errors.email}</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                <Text style={styles.errorText}>{errors.password}</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                />
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  onChangeText={handleChange("phoneNumber")}
                  onBlur={handleBlur("phoneNumber")}
                  value={values.phoneNumber}
                  keyboardType="numeric"
                />
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                <Text
                  style={{
                    color: "grey",
                    paddingHorizontal: 20,
                    marginBottom: 5,
                  }}
                >
                  By clicking “Create Account”, I agree to SpechSlice's Terms of
                  Use and Privacy Policy
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
                    <Text style={styles.regButtonText}>Create Account</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <View style={styles.rowContainer}>
            <Text style={styles.accountText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom:20
  },
  input: {
    height: 45,
    width: "90%",
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    // marginTop: 5,
    alignSelf: "flex-start",
    marginLeft: 30,
    fontSize:12
  },
  image: {
    width: 300,
    height: 200,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.primaryColor,
    marginBottom: 20,
  },
  regButton: {
    backgroundColor: Colors.primaryColor,
    width: "90%",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  regButtonText: {
    fontSize: 20,
    color: Colors.secondaryColor,
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "row",
    margin: 10,
    alignSelf: "center",
    paddingHorizontal:10
  },
  accountText: {
    fontSize: 16,
  },
  loginText: {
    color: Colors.primaryColor,
    fontSize: 16,
    marginLeft: 5,
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 10,
    margin: 5,
  },
  registrationContainer: {
    backgroundColor: Colors.grey,
    borderRadius: 10,
    marginLeft: 6,
    marginRight: 6,
    marginBottom: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  registrationText: {
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 16,
  },
  regButton: {
    backgroundColor: Colors.primaryColor,
    textAlign: "center",
    width: "90%",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: Colors.primaryColor,
  },
  modalButton: {
    backgroundColor: "white",
    textAlign: "center",
    width: "90%",
    padding: 10,
    borderRadius: 3,
    marginVertical: 8,
    alignSelf: "center",
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    borderRadius: 10,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  modalImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 16,
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  halfInputContainer: {
    flex: 1,
    width: "48%",
    marginRight: "2%",
    flexDirection:"column"
  },
  halfInput: {
    height: 45,
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default Signup;
