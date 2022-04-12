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

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const tableHead1 = ["Municipality", "Active Cases"]
const tableTitle = ["Anao","Bamban","Camiling","Capas","Concepcion","Gerona","Lapaz","Mayantoc","Moncada","Paniqui","Pura","Ramos","San Clemente", "San Jose","San Manuel","Santa Ignacia","Tarlac City","Victoria"]

//for the Trend Chart
var historyCases;
var historyRecoveries;
var historyDeaths;
var historyDates;

export default function ({ covidData, setCovidData }) {
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
		  historyDates=[];
		  covidData.historyCovidData.forEach((object)=>{
			historyCases.push(object.activeCases)
			var datee = new Date(object.recordDate);
			var Updatee = monthNames[(datee.getMonth())]+' '+datee.getDate()+', '+datee.getFullYear();
			historyDates.push(Updatee)
		  })
	
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
			fontFamily: 'Montserrat_600SemiBold',
			textAlign: "center"
		  },
		  sectionSubTitleContainer:{
			marginTop: "1%",
			textAlign: "right"
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
			backgroundColor:"#FFB347"
		  },
		  buttonCases2:{
			borderColor:"#77DD77",
			backgroundColor:"#77DD77"
		  },
		  buttonCases3:{
			borderColor:"#FF6961",
			backgroundColor:"#FF6961"
		  },
		  containerText:{
			height:"65%",
			flexDirection:"column",
			justifyContent:"center",
			// borderWidth: 2,
		  },
		  casesTitle:{
			textAlign: "center",
			fontSize: 17,
			fontFamily: 'Montserrat_300Light',
			color: "white"
		  },
		  casesNumber:{
			textAlign: "center",
			fontSize: 20,
			fontFamily: 'Montserrat_800ExtraBold',
		  },
		  elevation: {
			elevation: 20,
			shadowColor: 'rgba(0, 0, 0, 0.35)',
			shadowOffset: { height: 1, width: 1 }, // IOS
			shadowOpacity: 1, // IOS
			shadowRadius: 1, //IOS
		  },

		  buttonCasesSpec:{
			width:"90%",
			// minHeight:"30%",
			height:win.height/6,
			flex:6,
			textAlign:"center",
			marginLeft:"5%",
			// padding: 0,
			borderWidth: 1,
			justifyContent:"center",
			borderRadius: 10,
			marginTop:"-2%"
		  },
		  buttonCases4:{
			borderColor:"#69A1AF",
			backgroundColor:"#69A1AF"
		  },
		  casesTitleSpec:{
			textAlign: "center",
			fontSize: 17,
			fontFamily: 'Montserrat_400Regular',
			color: "white",
			paddingLeft:"2%",
			paddingRight:"2%"
		  },
		  casesNumberSpec:{
			textAlign: "center",
			fontSize: 20,
			fontFamily: 'Montserrat_800ExtraBold',
			color:"white"
		  },


		  container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: '#fff', marginTop:'5%' }, //change margin top if you waant to include toggleable heat map
		  head1: {  height: 40,  backgroundColor: '#69A1AF' },
		  headTitle:{textAlign: 'center', fontFamily: 'Montserrat_600SemiBold'},
		  wrapper: { flexDirection: 'row' },
		  title: { flex: 1, backgroundColor: '#f6f8fa' },
		  row: {  height: 28  },
		  text: { textAlign: 'center', fontFamily:"Montserrat_500Medium" },
	  
	  });	

	if (!fontsLoaded || loading) {
		return <AppLoading />;
	}
	else {
		return (
			<Layout>
			<ScrollView style={styles.containerMain}  refreshControl={<RefreshControl refreshing={refreshing}onRefresh={onRefresh}/> }>
			  <Section style={styles.section}>
				<SectionContent style={styles.sectionContent}>
				<Text style={styles.sectionTitle} numberOfLines={2} adjustsFontSizeToFit>TARLAC CUMULATIVE COVID-19 UPDATE: </Text>
				<Text style={styles.sectionSubTitleContainer} numberOfLines={1} adjustsFontSizeToFit><Text style={styles.sectionSubTitle} numberOfLines={1} adjustsFontSizeToFit>as of </Text><Text style={styles.sectionDate} numberOfLines={1} adjustsFontSizeToFit>{date}</Text></Text>
				
				  <View style = {styles.buttonContainer}>

					<View style={[styles.buttonCases,styles.buttonCases1, styles.elevation]} >
						<View style={styles.containerText}>
						  <Text style={[styles.casesTitle]} numberOfLines={3} adjustsFontSizeToFit>Overall Cases{'\n'}</Text>
						  <Text style={[styles.casesNumber]} numberOfLines={1} adjustsFontSizeToFit>{covidData.overallTotalCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
						</View>
					</View>
		
	
					<View style={[styles.buttonCases,styles.buttonCases2, styles.elevation]} >
					  
						<View style={styles.containerText}>
						  <Text  style={[styles.casesTitle]} numberOfLines={3} adjustsFontSizeToFit>Total Recoveries{'\n'}</Text>
						  <Text style={[styles.casesNumber]} numberOfLines={1} adjustsFontSizeToFit>{covidData.overallRecoveries.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
						</View>
					  
					</View>
				
	
					<View style={[styles.buttonCases,styles.buttonCases3, styles.elevation]} >
					
						<View style={styles.containerText}>
						  <Text style={[styles.casesTitle]} numberOfLines={3} adjustsFontSizeToFit>Total Deaths{'\n'}</Text>
						  <Text style={[styles.casesNumber]} numberOfLines={1} adjustsFontSizeToFit>{covidData.overallDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
						</View>

					</View> 					
	
				  </View>
			   
				</SectionContent>
			  </Section>

			  <View style={[styles.buttonCasesSpec,styles.buttonCases4, styles.elevation]} >
					
					<View style={styles.containerText}>
					<Text style={[styles.casesTitleSpec]} numberOfLines={3} adjustsFontSizeToFit>ACTIVE NUMBER OF COVID-19 CASES IN THE PROVINCE: {'\n'}</Text>
					<Text style={[styles.casesNumberSpec]} numberOfLines={1} adjustsFontSizeToFit>{covidData.overallActiveCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
					</View>

			</View>
      

          <View style={styles.container}>
            <Table borderStyle={{borderWidth: 1}}>
              <Row data={tableHead1} flexArr={[2, 2, 2]} style={styles.head1} textStyle={styles.headTitle}/>
              <TableWrapper style={styles.wrapper}>
                <Col data={tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                {/* <Rows data={state.tableData} flexArr={[2, 1, 1]} style={styles.row} textStyle={styles.text}/> */}
                <Col data={Object.values(covidData.overallActiveCasesBreakdown)} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
              </TableWrapper>
            </Table>
          </View>

		  <View style={{marginTop: win.height/60, alignItems: "center"}}>
            <Text style={{fontFamily: 'Montserrat_600SemiBold', marginBottom:win.height/80}}>Active Cases of Covid-19 Trend</Text>
           <LineChart

          
              data={{
                labels:historyDates, //check how you can shortn this: remove?
                datasets: [
                  {
                    data:historyCases
                  }
                ]
              }}
              width={win.width/1.1}
              height={win.height/5}
              chartConfig={{
                  backgroundColor: "white",
                  backgroundGradientFrom: "white",
                  backgroundGradientTo: "white",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `#69A1AF`,
                  labelColor: (opacity = 1) => `black`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#69A1AF"
                  }
                }}
            />
          </View>
         
  
			</ScrollView>
		  </Layout>
	)}
}
