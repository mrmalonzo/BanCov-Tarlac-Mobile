import React, {useState, useEffect} from "react";
import { Text, StyleSheet,View, Linking,  TouchableOpacity, Image, ScrollView, RefreshControl } from "react-native";
import {
  Layout,
  Button,
  Section,
  SectionContent,
  useTheme,
} from "react-native-rapi-ui";
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
import httpServices from "../httpServices";
import AsyncStorage from '@react-native-async-storage/async-storage';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function ({ covidData, setCovidData }) {
  const { isDarkmode, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("")
  const [refreshing, setRefreshing] = useState(false);

  
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

  useEffect(() => { 
    async function setDateFunc(){
      setLoading(true)
      var today = new Date(covidData.currentDateUploaded);
      var Update = monthNames[(today.getMonth())]+': '+today.getDate()+', '+today.getFullYear();
      await setDate(Update)
      setLoading(false)
    }
    setDateFunc();
  }, []);

  const onRefresh = React.useCallback(async () => { //refresh and get new data per user command
    setRefreshing(true);
    const newData = await httpServices.viewAllData();
    await setCovidData(newData.data)
    try{
      await AsyncStorage.setItem(`covidData`, JSON.stringify(newData.data)).then(() => setRefreshing(false)); 
    }catch(e){
      console.log(e)
    }
  }, []);

  const styles = StyleSheet.create({
    container: {
      // flex: 6,
      // justifyContent: "flex-end",
      // flexDirection: "row",
      backgroundColor: "white"
    },
    title:{
      padding: 20,
      textAlign: "right",
      borderBottomWidth: 1,
      marginTop: 'auto'
    },
    titleLight: {
      fontFamily: 'Montserrat_300Light',
      fontSize:25, 
      color:'rgb(105,161,175)'
    },
    titleBold: {
      fontFamily: 'Montserrat_700Bold',
      fontSize:25, 
      color:'rgb(101,201,92)'
    },
    section:{
      // width:"50%"
      marginTop: "5%"
    },
    sectionContent:{
      // width:"50%",
      flex: 3,
      // borderWidth:1,
      backgroundColor: "rgb(255,255,255)",
      width:"100%",
      height:350
    },
    sectionTitle: {
      fontSize:22, 
      fontFamily: 'Montserrat_600SemiBold'
    },
    sectionSubTitleContainer:{
      marginTop: "1%"
    },
    sectionSubTitle: {
      fontSize:18, 
      fontFamily: 'Montserrat_300Light'
    },
    sectionDate: {
      fontSize:18, 
      fontFamily: 'Montserrat_600SemiBold'
    },
    buttonContainer:{
      flexDirection:"row",
      justifyContent: "space-between",
      padding: 0,
      marginTop: "8%",
      marginBottom:"-10%"
      // borderWidth: 3
    },
    buttonCases:{
      width:"10%",
      // minHeight:"30%",
      height:"85%",
      flex:2,
      textAlign:"center",
      marginLeft:"1%",
      marginRight:"1%",
      padding: 0,
      borderWidth: 1,
      justifyContent:"center",
      borderRadius: 10
    },
    buttonCases1:{
      borderColor:"#FFB347",
    },
    buttonCases2:{
      borderColor:"#77DD77",
    },
    buttonCases3:{
      borderColor:"#FF6961",
    },
    containerText:{
      height:"65%",
      flexDirection:"column",
      justifyContent:"center",
      // borderWidth: 2,
    },
    casesTitle:{
      textAlign: "center",
      fontSize: 16,
      fontFamily: 'Montserrat_600SemiBold',
    },
    casesTitle1:{
      color:"#FFB347",
    },
    casesTitle2:{
      color:"#77DD77",
    },
    casesTitle3:{
      color:"#FF6961",
    },
    casesNumber:{
      textAlign: "center",
      fontSize: 20,
      fontFamily: 'Montserrat_800ExtraBold',
    }
  });


  if (!fontsLoaded || loading) {
    return <AppLoading />;
  } else {
    return (
      <Layout>
        <ScrollView style={styles.container}  refreshControl={<RefreshControl refreshing={refreshing}onRefresh={onRefresh}/> }>
          <Section style={styles.section}>
            <SectionContent style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>TARLAC COVID-19 UPDATE: </Text>
            <Text style={styles.sectionSubTitleContainer}><Text style={styles.sectionSubTitle}>as of </Text><Text style={styles.sectionDate}>{date}</Text></Text>
            
              <View style = {styles.buttonContainer}>
                <TouchableOpacity style={[styles.buttonCases,styles.buttonCases1]} onPress={() => Linking.openURL("https://rapi-ui.kikiding.space/")}>
                  
                    <View style={styles.containerText}>
                      <Text style={[styles.casesTitle, styles.casesTitle1]}>New Cases{'\n'}</Text>
                      <Text style={[styles.casesNumber, styles.casesTitle1]}>{covidData.currentTotalNewCases}</Text>
                    </View>
         
                </TouchableOpacity>

                <TouchableOpacity style={[styles.buttonCases,styles.buttonCases2]} onPress={() => Linking.openURL("https://rapi-ui.kikiding.space/")}>
                  
                    <View style={styles.containerText}>
                      <Text  style={[styles.casesTitle, styles.casesTitle2]}>Recoveries{'\n'}</Text>
                      <Text style={[styles.casesNumber, styles.casesTitle2]}>{covidData.currentTotalRecoveries}</Text>
                    </View>
                  
                </TouchableOpacity>

                <TouchableOpacity style={[styles.buttonCases,styles.buttonCases3]} onPress={() => Linking.openURL("https://rapi-ui.kikiding.space/")}>
                  
                    <View style={styles.containerText}>
                      <Text style={[styles.casesTitle, styles.casesTitle3]}>Deaths{'\n'}</Text>
                      <Text style={[styles.casesNumber, styles.casesTitle3]}>{covidData.currentTotalDeaths}</Text>
                    </View>
                  
                </TouchableOpacity>

              </View>

             
           
            </SectionContent>
          </Section>

          <Section>
            <SectionContent style={{width:"100%", height:300, padding:0}}>
              <Image style={{flex:1 , width: undefined, height: undefined}} source={require('../../assets/images/daily_update.jpg')} resizeMode="contain"/>
            </SectionContent>
          </Section>

       
        </ScrollView>
      </Layout>
    );
  }
}
