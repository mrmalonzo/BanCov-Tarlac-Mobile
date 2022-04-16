import React, {useState, useEffect} from "react";
import { Text, StyleSheet,View, Linking,  TouchableOpacity, Image, ScrollView, RefreshControl, Dimensions } from "react-native";
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
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import {LineChart} from "react-native-chart-kit";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from "recharts";

// import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
// import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
// import { AreaChart, Grid } from 'react-native-svg-charts'
// import * as shape from 'd3-shape'

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const tableHead1 = ["Municipality", "New Cases"]
const tableHead2 = ["Municipality", "Recoveries"]
const tableHead3 = ["Municipality", "Deaths"]
const tableTitle = ["Anao","Bamban","Camiling","Capas","Concepcion","Gerona","Lapaz","Mayantoc","Moncada","Paniqui","Pura","Ramos","San Clemente", "San Jose","San Manuel","Santa Ignacia","Tarlac City","Victoria"]

//for the Trend Chart
var historyCases;
var historyRecoveries;
var historyDeaths;
// var historyDates;
// const startDate = new Date(2020, 3, 14);

export default function ({ covidData, setCovidData }) {
  const { isDarkmode, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("")
  const [refreshing, setRefreshing] = useState(false);
  const [buttonCases, setButtonCases] = useState(false);
  const [buttonRecoveries, setButtonRecoveries] = useState(false);
  const [buttonDeaths, setButtonDeaths] = useState(false);

  
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
      var Update = monthNames[(today.getMonth())]+' '+today.getDate()+', '+today.getFullYear();
      await setDate(Update)

      //get history for trend
      historyCases=[];
      historyRecoveries=[];
      historyDeaths=[];
      // historyDates=[startDate, Update];
      covidData.historyCovidData.forEach((object)=>{
        historyCases.push(object.newCases)
        historyRecoveries.push(object.newRecoveries)
        historyDeaths.push(object.newDeaths)
      })

      setLoading(false)
    }
    setDateFunc();
  }, []);

  const onRefresh = React.useCallback(async () => { //refresh and get new data per user command
    setRefreshing(true);
    const newData = await httpServices.viewAllData();
    await setCovidData(newData.data)
    var today = new Date(newData.data.currentDateUploaded);
		var Update = monthNames[(today.getMonth())]+' '+today.getDate()+', '+today.getFullYear();
		await setDate(Update)
    try{
      await AsyncStorage.setItem(`covidData`, JSON.stringify(newData.data)).then(() => setRefreshing(false)); 
    }catch(e){
      console.log(e)
    }
  }, []);

  const win = Dimensions.get('window'); //get window width and height

  const styles = StyleSheet.create({
    containerMain: {
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
      height:win.height/4.75,
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
    },

    container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: '#fff', marginTop:'-10%' }, //change margin top if you waant to include toggleable heat map
    head1: {  height: 40,  backgroundColor: '#FFB347' },
    head2: {  height: 40,  backgroundColor: '#77DD77' },
    head3: {  height: 40,  backgroundColor: '#FF6961' },
    headTitle:{textAlign: 'center', fontFamily: 'Montserrat_600SemiBold'},
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 28  },
    text: { textAlign: 'center', fontFamily:"Montserrat_500Medium" },

    elevation: {
      elevation: 20,
      shadowColor: 'rgba(0, 0, 0, 0.35)',
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
    },
  });


  if (!fontsLoaded || loading) {
    return <AppLoading />;
  } else {
    return (
      <Layout>
        <ScrollView style={styles.containerMain}  refreshControl={<RefreshControl refreshing={refreshing}onRefresh={onRefresh}/> }>
          <Section style={styles.section}>
            <SectionContent style={styles.sectionContent}>
            <Text style={styles.sectionTitle} numberOfLines={1} adjustsFontSizeToFit>TARLAC COVID-19 UPDATE: </Text>
            <Text style={styles.sectionSubTitleContainer} numberOfLines={1} adjustsFontSizeToFit><Text style={styles.sectionSubTitle} numberOfLines={1} adjustsFontSizeToFit>as of </Text><Text style={styles.sectionDate} numberOfLines={1} adjustsFontSizeToFit>{date}</Text></Text>
            
              <View style = {styles.buttonContainer}>
                <TouchableOpacity name="cases" style={[styles.buttonCases,styles.buttonCases1, {backgroundColor:buttonCases? "#FFB347":"white"}, buttonCases?styles.elevation:null]} onPress={async ()=> {await setButtonCases(!buttonCases); await setButtonRecoveries(false); await setButtonDeaths(false)}}>
                  
                    <View style={styles.containerText}>
                      <Text style={[styles.casesTitle, styles.casesTitle1, {color:buttonCases? "black":"#FFB347"}]} numberOfLines={2} adjustsFontSizeToFit>New Cases{'\n'}</Text>
                      <Text style={[styles.casesNumber, styles.casesTitle1, {color:buttonCases? "black":"#FFB347"}]} numberOfLines={1} adjustsFontSizeToFit>{covidData.currentTotalNewCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    </View>
         
                </TouchableOpacity>

                <TouchableOpacity name="recoveries" style={[styles.buttonCases,styles.buttonCases2,{backgroundColor:buttonRecoveries? "#77DD77":"white"}, buttonRecoveries?styles.elevation:null]} onPress={async ()=> {await setButtonRecoveries(!buttonRecoveries); await setButtonCases(false);await setButtonDeaths(false)}}>
                  
                    <View style={styles.containerText}>
                      <Text  style={[styles.casesTitle, styles.casesTitle2, {color:buttonRecoveries? "black":"#77DD77"}]} numberOfLines={2} adjustsFontSizeToFit>Recoveries{'\n'}</Text>
                      <Text style={[styles.casesNumber, styles.casesTitle2, {color:buttonRecoveries? "black":"#77DD77"}]} numberOfLines={1} adjustsFontSizeToFit>{covidData.currentTotalRecoveries.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    </View>
                  
                </TouchableOpacity>

                <TouchableOpacity name="deaths" style={[styles.buttonCases,styles.buttonCases3, {backgroundColor:buttonDeaths? "#FF6961":"white"}, buttonDeaths?styles.elevation:null]} onPress={async ()=> {await setButtonDeaths(!buttonDeaths); await setButtonCases(false); await setButtonRecoveries(false)}}>
                  
                    <View style={styles.containerText}>
                      <Text style={[styles.casesTitle, styles.casesTitle3, {color:buttonDeaths? "black":"#FF6961"}]} numberOfLines={2} adjustsFontSizeToFit>Deaths{'\n'}</Text>
                      <Text style={[styles.casesNumber, styles.casesTitle3, {color:buttonDeaths? "black":"#FF6961"}]} numberOfLines={1} adjustsFontSizeToFit>{covidData.currentTotalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    </View>
                  
                </TouchableOpacity>

              </View>

             
           
            </SectionContent>
          </Section>

        {
          !buttonCases && !buttonRecoveries && !buttonDeaths && //if these buttons are all not clicked, then render the picture

          <Section>
            <SectionContent style={{flex: 1, alignSelf: 'stretch', width: win.width, height: win.height/2.75}}>
              <Image style={{flex:1 , width: undefined, height: undefined}} source={require('../../assets/images/daily_update.jpg')} resizeMode="contain"/>
            </SectionContent>
          </Section>
        }

        {
          buttonCases  && !buttonRecoveries && !buttonDeaths && //render New Cases Table when button cases is clicked

          <View style={styles.container}>
            <Text style={{fontFamily: 'Montserrat_600SemiBold', marginBottom:win.height/80, textAlign:"center"}}>New Cases per Muncipality Breakdown</Text>
            <Table borderStyle={{borderWidth: 1}}>
              <Row data={tableHead1} flexArr={[2, 2, 2]} style={styles.head1} textStyle={styles.headTitle}/>
              <TableWrapper style={styles.wrapper}>
                <Col data={tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                {/* <Rows data={state.tableData} flexArr={[2, 1, 1]} style={styles.row} textStyle={styles.text}/> */}
                <Col data={Object.values(covidData.currentNewCasesBreakdown)} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
              </TableWrapper>
            </Table>
          </View>
         
        }

        {
          buttonCases  && !buttonRecoveries && !buttonDeaths && //render New Cases Trend when button cases is clicked

          <View style={{marginTop: win.height/60, alignItems: "center"}}>
            <Text style={{fontFamily: 'Montserrat_600SemiBold', marginBottom:win.height/80}}>New Covid-19 Cases Trend in Tarlac</Text>
           <LineChart

          
              data={{
                // labels:historyDates, //check how you can shortn this: remove?
                datasets: [
                  {
                    data:historyCases
                  }
                ]
              }}
              width={win.width}
              height={win.height/5}
              style={{marginLeft:-win.width/30}}
              chartConfig={{
                  backgroundColor: "white",
                  backgroundGradientFrom: "white",
                  backgroundGradientTo: "white",
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 1) => `#FFB347`,
                  labelColor: (opacity = 1) => `black`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "0",
                    strokeWidth: "1",
                    stroke: "#ffa726"
                  }
                }}
                withDots={false}
                verticalLabelRotation={100}
                bezier
                withInnerLines={false}
                withOuterLines={false}
                xAxisSuffix="Span of Covid-19 in Tarlac"
            />
           
          </View>
         
        }

        
        {
          !buttonCases  && buttonRecoveries && !buttonDeaths && //render New Recoveries Table when button recovies is clicked

          <View style={styles.container}>
            <Text style={{fontFamily: 'Montserrat_600SemiBold', marginBottom:win.height/80, textAlign:"center"}}>New Recoveries per Municipality Breakdown</Text>
            <Table borderStyle={{borderWidth: 1}}>
              <Row data={tableHead2} flexArr={[2, 2, 2]} style={styles.head2} textStyle={styles.headTitle}/>
              <TableWrapper style={styles.wrapper}>
                <Col data={tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                {/* <Rows data={state.tableData} flexArr={[2, 1, 1]} style={styles.row} textStyle={styles.text}/> */}
                <Col data={Object.values(covidData.currentRecoveriesBreakdown)} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
              </TableWrapper>
            </Table>
          </View>
        }

        {
          !buttonCases  && buttonRecoveries && !buttonDeaths && //render New Recoveries Trend when button recovies is clicked

          <View style={{marginTop: win.height/60, alignItems: "center"}}>
              <Text style={{fontFamily: 'Montserrat_600SemiBold', marginBottom:win.height/80}}>New Covid-19 Recoveries Trend in Tarlac</Text>
            <LineChart

            
                data={{
                  // labels:historyDates, //check how you can shortn this: remove?
                  datasets: [
                    {
                      data:historyRecoveries
                    }
                  ]
                }}
                width={win.width}
                height={win.height/5}
                style={{marginLeft:-win.width/30}}
                chartConfig={{
                    backgroundColor: "white",
                    backgroundGradientFrom: "white",
                    backgroundGradientTo: "white",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `#77DD77`,
                    labelColor: (opacity = 1) => `black`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#77DD80"
                    }
                  }}
                  withDots={false}
                  verticalLabelRotation={100}
                  bezier
                  withInnerLines={false}
                  withOuterLines={false}
              />
            </View>
        }

        
        {
          !buttonCases  && !buttonRecoveries && buttonDeaths && //render New Deaths Table when button Deaths is clicked

          <View style={styles.container}>
            <Text style={{fontFamily: 'Montserrat_600SemiBold', marginBottom:win.height/80, textAlign:"center"}}>New Deaths per Municipality Breakdown</Text>
            <Table borderStyle={{borderWidth: 1}}>
              <Row data={tableHead3} flexArr={[2, 2, 2]} style={styles.head3} textStyle={styles.headTitle}/>
              <TableWrapper style={styles.wrapper}>
                <Col data={tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                {/* <Rows data={state.tableData} flexArr={[2, 1, 1]} style={styles.row} textStyle={styles.text}/> */}
                <Col data={Object.values(covidData.currentDeathsBreakdown)} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
              </TableWrapper>
            </Table>
          </View>
        }

        {
          !buttonCases  && !buttonRecoveries && buttonDeaths && //render New Deaths Table when button Deaths is clicked

          <View style={{marginTop: win.height/60, alignItems: "center"}}>
              <Text style={{fontFamily: 'Montserrat_600SemiBold', marginBottom:win.height/80}}>New Covid-19 Deaths Trend in Tarlac</Text>
            <LineChart

            
                data={{
                  // labels:historyDates, //check how you can shortn this: remove?
                  datasets: [
                    {
                      data:historyDeaths
                    }
                  ]
                }}
                width={win.width}
                height={win.height/5}
                style={{marginLeft:-win.width/30}}
                chartConfig={{
                    backgroundColor: "white",
                    backgroundGradientFrom: "white",
                    backgroundGradientTo: "white",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `#FF6961`,
                    labelColor: (opacity = 1) => `black`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#FF6961"
                    }
                  }}
                  withDots={false}
                  verticalLabelRotation={100}
                  bezier
                  withInnerLines={false}
                  withOuterLines={false}
              />
            </View>
          
        }
          

       
        </ScrollView>
      </Layout>
    );
  }
}
