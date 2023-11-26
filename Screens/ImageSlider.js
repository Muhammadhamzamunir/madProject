import { View, Text } from 'react-native'
import React,{useState,useEffect} from 'react';
import Colors from "../assets/Colors";
import { SliderBox } from "react-native-image-slider-box";

const ImageSlider = () => {
    const [images, setImages] = useState([
        "https://source.unsplash.com/1024x768/?BirthdayCake",
        "https://source.unsplash.com/1024x768/?pink",
        "https://source.unsplash.com/1024x768/?cakes",
        "https://source.unsplash.com/1024x768/?cake",
      ]);
  return (
    <View>
     {/* Slider */}
     <SliderBox
        images={images}
        dotColor="pink"
        inactiveDotColor="white"
        activeDotColor="black"
        paginationBoxVerticalPadding={20}
        autoplay
        circleLoop
        ImageComponentStyle={{ borderRadius: 15, width: "97%", marginTop: 5 }}
      />
    </View>
  )
}

export default ImageSlider