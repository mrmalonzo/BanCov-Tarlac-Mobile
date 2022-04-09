import React, {useState,  useEffect} from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "react-native-rapi-ui";
import { Text, StyleSheet,View, Linking, Dimensions} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light_Italic,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black_Italic,
} from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import httpServices from "./src/httpServices";
import NetInfo from "@react-native-community/netinfo";

export default function App() {
  let [fontsLoaded] = useFonts({ //import fonts
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light_Italic,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black_Italic,
  });

  const [loading, setLoading] = useState(true);
  const [covidData, setCovidData] = useState("");

//dapat meron tayong checker if may net siya. Pag meron then  fefetch siya, pag hindi then local storage lang gagamitin niya (if meron man)

  // NetInfo.fetch().then(state => {
  //   console.log("Connection type", state.type);
  //   console.log("Is connected?", state.isConnected);
  // });

  useEffect(() => {  //check for local storage and if there is internet
    async function getData(){
      setLoading(true)
      const localData = await AsyncStorage.getItem(`covidData`); //check for the local storage if there is a data
      
      NetInfo.fetch().then(async state => { //check for internet connection

        if (localData && !state.isConnected) { //if there is a saved file and you are not connected to the internet
          const foundData = JSON.parse(localData);
          await setCovidData(foundData);
          setLoading(false)
        }else{//do not load anything until it is connected to the internet
          const newData = await httpServices.viewAllData()
          await setCovidData(newData.data);
          try{
            await AsyncStorage.setItem(`covidData`, JSON.stringify(newData.data));
          }catch(e){
            console.log(e)
          }
          setLoading(false)
        }

      });

    }
    getData();
  }, []);

  const win = Dimensions.get('window'); //get window width and height

  const styles = StyleSheet.create({
    title:{
      padding: win.height/40,
      textAlign: "right",
      borderBottomWidth: 1,
      marginTop: 'auto',
      backgroundColor:"white"
    },
    titleLight: {fontFamily: 'Montserrat_300Light',
      fontSize:25, 
      color:'rgb(105,161,175)'
    },
    titleBold: {fontFamily: 'Montserrat_700Bold',
      fontSize:25, 
      color:'rgb(101,201,92)'
    }
  });

  if (!fontsLoaded || loading) {
    return <AppLoading />;
  } else {
    return (
      <ThemeProvider>

      <Text style= {styles.title}> 
        <Text style={styles.titleLight}>BanCov </Text>
        <Text style={styles.titleBold}>Tarlac</Text>
      </Text>
        <AppNavigator covidData={covidData} setCovidData={setCovidData} />
      </ThemeProvider>
    );
  }
}

//TO DO:
//LOADING SCREEN
//ICON PICTURE
//ALARM SYSTEM??
