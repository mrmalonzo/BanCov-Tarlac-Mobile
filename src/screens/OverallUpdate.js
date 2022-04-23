import React, {useState, useEffect, useRef} from "react";
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
import ToggleSwitch from 'toggle-switch-react-native'
import MapView, { Marker, Polyline } from 'react-native-maps';
import {border} from "../../assets/tarlacBorder.js"

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

//for Tarlac Municipality Markers and heatmap

export default function ({ covidData, setCovidData }) {
	const [loading, setLoading] = useState(true);
	const [date, setDate] = useState("")
	const [refreshing, setRefreshing] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const scrollRef = useRef();
	const [mapRegion, setmapRegion] = useState({
		latitude:15.485611015970282,
		longitude:120.49515484855495,
		latitudeDelta: 0.5,
		longitudeDelta: 0.5,
	  });
	const [marker, setMarker] = useState( 
		[
		{
			latitude: 15.743725713267793, 
			longitude:120.61475222375674,
			title:"Anao",
			weight:0
		},
		{
			latitude: 15.291531313054659, 
			longitude:120.57340152894659,
			title:"Bamban",
			weight:0
		},
		{
			latitude: 15.691793631341804,
			longitude: 120.41504411972757,
			title:"Camiling",
			weight:0
		},
		{
			latitude:15.335192285909459,
			longitude: 120.59160552461964 ,
			title:"Capas",
			weight:0
		},
		{
			latitude:15.321978350380855,
			longitude: 120.6562980391059,
			title:"Concepcion",
			weight:0
		},
		{
			latitude:15.607745808297068,
			longitude: 120.6012166410495,
			title:"Gerona",
			weight:0
		},
		{
			latitude:15.450353201560606,
			longitude:120.72066920624569,
			title:"La Paz",
			weight:0
		},
		{
			latitude:15.560962124853347,
			longitude:  120.32274211954645,
			title: "Mayantoc",
			weight:0
		},
		{
			latitude: 15.732929205488874,
			longitude: 120.5671717428838,
			title:"Moncada",
			weight:0
		},
		{
			latitude:15.663537159847348,
			longitude: 120.55533425187551,
			title:"Paniqui",
			weight:0
		},
		{
			latitude:15.620058187240485,
			longitude: 120.65153287514342,
			title:"Pura",
			weight:0
		},
		{
			latitude:15.668449835887726,
			longitude:120.6381647162391,
			title:"Ramos",
			weight:0
		},
		{
			latitude: 15.709351218027015, 
			longitude:120.36290621977564,
			title: "San Clemente",
			weight:0
		},
		{	latitude: 15.420795255513864,
			longitude: 120.29881516610722,
			title:"San Jose",
			weight:0
		},
		{
			latitude:15.491233345396322,
			longitude:120.66549944967403,
			title:"San Manuel",
			weight:0
		},
		{
			latitude:15.583478984536779,
			longitude: 120.47528135927602,
			title:"Santa Ignacia",
			weight:0
		},
		{
			latitude: 15.478631633285406,
			longitude:120.59554020573438,
			title:"Tarlac City",
			weight:0
		},
		{	latitude: 15.588533238496563,
			longitude:120.69426600906068,
			title:"Victoria",
			weight:0
		},
	
	]
	)


	
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

		  //add current active cases to heatmap markers for heatmap

		//   Object.keys(covidData.overallActiveCasesBreakdown).forEach((municipality, index)=>{
		// 	marker[index].weight = covidData.overallActiveCasesBreakdown[municipality]
		//   });

		await setMarker(()=>{ //Update weight. Needs a workaround to prevent changing frozen values
			let clonedArray = JSON.parse(JSON.stringify(marker)) //deep clone original marker
			Object.keys(covidData.overallActiveCasesBreakdown).forEach((municipality, index)=>{ //then update it's weight
				clonedArray[index].weight = covidData.overallActiveCasesBreakdown[municipality]
			});
			return clonedArray;
		})
		

		  setLoading(false)
		}
		setDateFunc();
	  }, []);

	  const onRefresh = React.useCallback(async () => { //refresh and get new data per user command
		setRefreshing(true);
		const newData = await httpServices.viewAllData();
		await setCovidData(newData.data)
		
		//get history for trend
		historyCases=[];
		historyDates=[];
		covidData.historyCovidData.forEach((object)=>{
			historyCases.push(object.activeCases)
			var datee = new Date(object.recordDate);
			var Updatee = monthNames[(datee.getMonth())]+' '+datee.getDate()+', '+datee.getFullYear();
			historyDates.push(Updatee)
		})

		await setMarker(()=>{ //Update weight. Needs a workaround to prevent changing frozen values
			let clonedArray = JSON.parse(JSON.stringify(marker)) //deep clone original marker
			Object.keys(newData.data.overallActiveCasesBreakdown).forEach((municipality, index)=>{ //then update it's weight
				clonedArray[index].weight = newData.data.overallActiveCasesBreakdown[municipality]
			});
			return clonedArray;
		})

		try{
		  await AsyncStorage.setItem(`covidData`, JSON.stringify(newData.data)).then(() => setRefreshing(false)); 
		}catch(e){
		  console.log(e)
		}
	  }, []);

	  const win = Dimensions.get('window'); //get window width and height

	  const onPressTouch = () => { //when toggle heat map is clicked - scroll to bottom screen and show heat map
		scrollRef.current?.scrollTo({
		  y: win.height/1.8,
		  animated: true,
		});
		setShowDetails(!showDetails);
	  }	
	
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
			// marginTop: "5%"
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


		  container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: '#fff', marginTop:'2%' }, //change margin top if you waant to include toggleable heat map
		  head1: {  height: 40,  backgroundColor: '#69A1AF' },
		  headTitle:{textAlign: 'center', fontFamily: 'Montserrat_600SemiBold'},
		  wrapper: { flexDirection: 'row' },
		  title: { flex: 1, backgroundColor: '#f6f8fa' },
		  row: {  height: 28  },
		  text: { textAlign: 'center', fontFamily:"Montserrat_500Medium" },
	  
		  containerMap: {
			flex: 1,
			backgroundColor: '#fff',
			alignSelf: 'center',
			justifyContent: 'center',
			marginTop:win.height/60,
			borderRadius:win.width/20,
			overflow:"hidden",
			width: win.width/1.13,
			height: win.height/1.5,
			borderWidth:1,
			borderColor:"#69A1AF"
		  },
		  map: {
			width:"100%",
			height: "100%",
		  },
	  });	

	if (!fontsLoaded || loading) {
		return <AppLoading />;
	}
	else {
		return (
			<Layout>
			<ScrollView ref={scrollRef} style={styles.containerMain}  refreshControl={<RefreshControl refreshing={refreshing}onRefresh={onRefresh}/> }>
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

			
				<View style={{alignItems:"center", marginTop: win.height/60}}>
					<Text style={{fontFamily:'Montserrat_600SemiBold', fontSize:win.height/50, marginBottom: win.height/100}}>Active Cases in Tarlac</Text>
					<ToggleSwitch
						isOn={showDetails}
						onColor="#69A1AF"
						offColor="gray"
						label="Show Heat Map"
						labelStyle={{ fontFamily:'Montserrat_500Medium', fontSize:win.height/70 }}
						size="medium"
						onToggle={onPressTouch}				

					/>
				</View>

		{
		
			showDetails && 

			//HeatMap using React Native Maps - Google Map
			<View style={styles.containerMap}>
				<MapView  
					style={styles.map} 
					region={mapRegion}
				>

				<MapView.Heatmap points={marker}
                         opacity={1}
                         radius={50}
                         maxIntensity={100}
                         gradientSmoothing={10}
                         heatmapMode={"POINTS_DENSITY"}
				/>

				
				{marker.map((municipality, index)=>{ //Markers for municipalities
					return <Marker key={index} coordinate={{
						latitude:municipality.latitude,
						longitude:municipality.longitude
					}}
					title={municipality.title}
					>
					</Marker>
				})}
				
					<Polyline 
						coordinates={border} //for Tarlac Province Borders
						strokeWidth={6}        
						strokeColor='#69A1AF' 
						// fillColor='none' 
					/>

				</MapView>
			</View>

		}
      
		{
			!showDetails &&

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
		}

		{
			!showDetails &&

		  <View style={{marginTop: win.height/60, alignItems: "center"}}>
            <Text style={{fontFamily: 'Montserrat_600SemiBold', marginBottom:win.height/80}}>Active Cases of Covid-19 Trend</Text>
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
				color: (opacity = 1) => `#69A1AF`,
				labelColor: (opacity = 1) => `black`,
				style: {
					borderRadius: 16
				},
				propsForDots: {
					r: "0",
					strokeWidth: "1",
					stroke: "#69A1AF"
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
         
  
			</ScrollView>
		  </Layout>
	)}
}
