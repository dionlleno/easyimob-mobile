import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CompromissosListagem from "../views/CompromissosListagem";

const Stack = createNativeStackNavigator();

export default function CompromissosStackRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#A0D4F7" },
        headerTitleStyle: {
          color: "#ffffff",
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="listagem"
        component={CompromissosListagem}
        options={{
          title: "Compromissos",
        }}
      />
    </Stack.Navigator>
  );
}
