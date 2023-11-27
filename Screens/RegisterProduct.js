import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import Colors from "../assets/Colors";
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as DocumentPicker from "expo-document-picker";
import { SelectList } from "react-native-dropdown-select-list";
import app from "../firebase/config";
import { useAuth } from "../AuthContextApi";
import { useToast, NativeBaseProvider } from "native-base";
const ProductSchema = yup.object({
  productName: yup.string().required("Product Name is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive"),
  description: yup.string().required("Description is required"),
  numberOfItems: yup
    .number()
    .required("Number of Items is required")
    .integer("Number of Items must be an integer")
    .positive("Number of Items must be positive"),
  category: yup.string().required("Category is required"),
});

const RegisterProduct = ({ route }) => {
 
  const { bakeryId } = route.params;
 
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);
  const storage = getStorage();
  const toast = useToast();
  const { user, updateUserInContext } = useAuth();
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

  const registerProductHandle = async (values,{ resetForm }) => {
    try {
      setLoading(true);

      if (!selectedImage) {
        console.error("Please select an image.");
        setLoading(false);
        return;
      }
      

      const timestamp = new Date().getTime();
      const fileExtension = selectedImage.split(".").pop().toLowerCase();
      const fileName = `product_image_${timestamp}.${fileExtension}`;

      const storageRef = ref(storage, `product_images/${fileName}`);
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
    
      const productCollectionRef = 
        collection(db, "users", user.uid, "bakery",bakeryId,"products")
    
      await setDoc(doc(productCollectionRef), {
        image: downloadURL,
        productName: values.productName,
        description: values.description,
        price: values.price,
        numberOfItems: values.numberOfItems,
        category: values.category,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      resetForm();
      console.log("Product registered successfully");
      toast.show({
        title: "Product registered successfully",
        status: "success",
        placement: "top",
        duration: 3000,
        style: { top: "5%", backgroundColor: "#2ecc71" },
      });
      
    } catch (error) {
      console.error("Error in registerProductHandle:", error);
      setLoading(false);
      toast.show({
        title: error,
        status: "error",
        placement: "top",
        duration: 3000,
        style: { top: "5%", backgroundColor: "#e74c3c" },
      });
      console.error("Failed to register product");
    }
  };

  const cakeCategories = [
    "Chocolate Cake",
    "Cheese Cake",
    "Vanilla Cake",
    "Fruit Cake",
    "Red Velvet Cake",
    "Carrot Cake",
    "Pound Cake",
    "Angel Food Cake",
    "Biscotti",
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Upload Product and Earn Money</Text>
        <Text style={styles.description}>
          Provide the details of your product to start selling
        </Text>

        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={handleImagePicker}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
            />
          ) : (
            <Image
              source={require("../assets/empty-image.png")}
              style={styles.emptyImage}
            />
          )}
          <Text style={styles.imagePickerText}>Pick an image</Text>
        </TouchableOpacity>

        <Formik
          initialValues={{
            productName: "",
            price: "",
            numberOfItems: "",
            category: "",
            description: "",
          }}
          validationSchema={ProductSchema}
          onSubmit={registerProductHandle}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("productName")}
                onBlur={handleBlur("productName")}
                value={values.productName}
              />
              {touched.productName && errors.productName && (
                <Text style={styles.errorText}>{errors.productName}</Text>
              )}

              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("price")}
                onBlur={handleBlur("price")}
                value={values.price}
                keyboardType="numeric"
              />
              {touched.price && errors.price && (
                <Text style={styles.errorText}>{errors.price}</Text>
              )}

              <Text style={styles.label}>Number of Items</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("numberOfItems")}
                onBlur={handleBlur("numberOfItems")}
                value={values.numberOfItems}
                keyboardType="numeric"
              />
              {touched.numberOfItems && errors.numberOfItems && (
                <Text style={styles.errorText}>{errors.numberOfItems}</Text>
              )}

              <Text style={styles.label}>Category</Text>

              <SelectList
                setSelected={(val) => handleChange("category")(val)}
                data={cakeCategories.map((category) => ({
                  value: category,
                }))}
                save="value"
                boxStyles={{ color: Colors.primaryColor }}
                // Add other styling and configuration properties here
              />
              {touched.category && errors.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.textArea}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
                multiline
              />
              {touched.description && errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading? <ActivityIndicator
                      size="small"
                      color={Colors.secondaryColor}
                    />:<Text style={styles.buttonText}>Register Product</Text> }
                
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor:"red"
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.primaryColor,
    marginBottom: 20,
  },
  description: {
    color: "grey",
    paddingHorizontal: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  imagePickerButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 45,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  inputContainer: {
    height: 45,
    width: "100%",
    borderRadius: 10,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    marginBottom: 10,
  },
  dropdownItem: {
    justifyContent: "flex-start",
  },
  dropdownLabel: {
    fontSize: 16,
    color: Colors.primaryColor,
  },
  textArea: {
    height: 250,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: Colors.primaryColor,
    width: "100%",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.secondaryColor,
  },
});

export default RegisterProduct;
