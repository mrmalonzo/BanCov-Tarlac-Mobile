import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { themeColor, useTheme } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";

import DailyUpdate from "../screens/DailyUpdate";
import SecondScreen from "../screens/SecondScreen";
import OverallUpdate from "../screens/OverallUpdate";

var propCovidData;
var propSetCovidData
const MainStack = createNativeStackNavigator();
const Main = ({covidData, setCovidData}) => {
  
  propCovidData = covidData
  propSetCovidData = setCovidData
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      covidData = {covidData}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="SecondScreen" component={SecondScreen} />
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();
const MainTabs = ({covidData , setCovidData}) => {
  const { isDarkmode } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
          height: '8%'
        },
      }}
    >
      {/* these icons using Ionicons */}
      <Tabs.Screen
        name="DAILY UPDATES"
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="DAILY UPDATES" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"today-outline"} />
          ),
        }}
      >
        {(props) => <DailyUpdate {...props} covidData={propCovidData} setCovidData={propSetCovidData}/>}
      </Tabs.Screen>
      <Tabs.Screen
        name="OVERALL UPDATES"
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="OVERALL UPDATES" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"people-outline"} />
          ),
        }}
      >
         {(props) => <OverallUpdate {...props} covidData={propCovidData} setCovidData={propSetCovidData} />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
};

export default ({covidData, setCovidData}) => {
  return (
    <NavigationContainer>
      <Main covidData={covidData} setCovidData={setCovidData}/>
      {/* {console.log(covidData)} */}
    </NavigationContainer>
  );
};
