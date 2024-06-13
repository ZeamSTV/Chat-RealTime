import { Alert, StatusBar, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home";
import Chat from "./src/screens/Chat";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import Profile from "./src/screens/Profile";
import AuthProvider, { AuthConstext } from "./src/context/AuthProvider";
import { useContext } from "react";
import { ChatProvider } from "./src/context/ChatContext";
import { ThemeProvider } from "./src/context/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="orange" barStyle="light-content" />
        <AuthProvider>
          <ChatProvider>
            <Root />
          </ChatProvider>
        </AuthProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const Root = () => {
  const Stack = createNativeStackNavigator();
  const { isAuthenticated } = useContext(AuthConstext);
  // console.log("isAuthenticated:", isAuthenticated);
  // if (isAuthenticated) {
  //   return children;
  // }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="Profile" component={Profile} />

        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </>
      )}
    </Stack.Navigator>
  );
};
// if (loading) {
//   return (
//     <View
//       style={{
//         width: "100%",
//         height: "100%",
//         zIndex: 99,
//         // opacity: 0.5,
//         backgroundColor: "white",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
//         Please wait couple second!
//       </Text>
//     </View>
//   );
// }
