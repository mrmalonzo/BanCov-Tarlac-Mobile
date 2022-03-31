import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text } from 'react-native-rapi-ui';
// import {
// 	useFonts,
// 	Montserrat_100Thin,
// 	Montserrat_200ExtraLight,
// 	Montserrat_300Light,
// 	Montserrat_400Regular,
// 	Montserrat_500Medium,
// 	Montserrat_600SemiBold,
// 	Montserrat_700Bold,
// 	Montserrat_800ExtraBold,
// 	Montserrat_900Black,
// 	Montserrat_100Thin_Italic,
// 	Montserrat_200ExtraLight_Italic,
// 	Montserrat_300Light_Italic,
// 	Montserrat_400Regular_Italic,
// 	Montserrat_500Medium_Italic,
// 	Montserrat_600SemiBold_Italic,
// 	Montserrat_700Bold_Italic,
// 	Montserrat_800ExtraBold_Italic,
// 	Montserrat_900Black_Italic,
//   } from '@expo-google-fonts/montserrat';
  

export default function ({ navigation }) {
	
	const styles = StyleSheet.create({
		sample: {
			fontFamily: "Montserrat_800ExtraBold_Italic"
		}
	  });	

	return (
		<Layout>
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Text style={styles.sample}>This is the Profile tab</Text>
			</View>
		</Layout>
	);
}
