import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import Compromissos from "../views/Compromissos";
import Clientes from "../views/Clientes";
import Imoveis from "../views/Imoveis";
import Configuracao from "../views/Configuracao";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { height: 80, backgroundColor: "#A0D4F7" },
        headerTitleStyle: {
          color: "#ffffff",
          fontWeight: "bold",
        },
        tabBarActiveBackgroundColor: "#ffffff",
        tabBarActiveTintColor: "#A0D4F7",
        tabBarInactiveBackgroundColor: "#A0D4F7",
        tabBarInactiveTintColor: "#ffffff",
        tabBarItemStyle: {
          justifyContent: "center",
          alignSelf: "center"
        },
        tabBarStyle: {
          height: 105,
        },
        tabBarLabelStyle: {
          fontSize: 13,
        },
      }}
    >
      <Tab.Screen
        name="compromissos"
        component={Compromissos}
        options={{
          headerShown: false,
          headerTitle: "Compromissos",
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" color={color} size={size} />
          ),
          tabBarLabel: "Compromissos",
        }}
      />
      <Tab.Screen
        name="clientes"
        component={Clientes}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
          tabBarLabel: "Clientes",
        }}
      />
      <Tab.Screen
        name="imoveis"
        component={Imoveis}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
          tabBarLabel: "Imóveis",
        }}
      />
      <Tab.Screen
        name="configuracao"
        component={Configuracao}
        options={{
          headerTitle: "Config.",
          tabBarIcon: ({ color, size }) => (
            <Feather name="sliders" color={color} size={size} />
          ),
          tabBarLabel: "Config.",
        }}
      />
    </Tab.Navigator>
  );
}
