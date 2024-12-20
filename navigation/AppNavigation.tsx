import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { LoginScreen } from "../pages/Login";
import { RegisterScreen } from "../pages/Register";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ProfileScreen } from "../pages/profile";
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from "../pages/Home";
import { BookInfo } from "../pages/BookInfor";
import { ReadScreen } from "../pages/Read";
import { ListChapterView } from "../pages/ListOfChapter";
import { RecentReadsScreen } from "../pages/RecentlyRead";
import CommentScreen from "../pages/CommentScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigation} />
        <Stack.Screen name="Inapp" component={InappNavigation} />
        <Stack.Screen name="Read" component={BookInfo} />
        <Stack.Screen name="ReadChapter" component={ReadScreen} />
        <Stack.Screen name="ShowListChapter" component={RecentReadsScreen} />
        <Stack.Screen name="ListOfChapter" component={ListChapterView} />
        <Stack.Screen name="CommentScreen" component={CommentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const InappNavigation = ({ route }) => {
  const userData = route.params?.userData;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Profile: "user-circle",
          };
          return <FontAwesome name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#39B78D",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ userData }} // Truyền userData vào HomeScreen
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userData }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigation;