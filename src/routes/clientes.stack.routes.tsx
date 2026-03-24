import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ClientesDetalhes from "../views/ClientesDetalhes";
import ClientesListagem from "../views/ClientesListagem";

const Stack = createNativeStackNavigator();

export default function ClientesStackRoutes(){
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {backgroundColor: "#A0D4F7"},
            headerTitleStyle: {
                color: "#ffffff",
                fontWeight: "bold"}
            }}>
            <Stack.Screen
            name="listagem"
            component={ClientesListagem}
            options={{
                title: "Clientes"
            }}/>
            <Stack.Screen
            name="detalhes"
            component={ClientesDetalhes}
            options={{
                title: "Detalhes"
            }}/>
        </Stack.Navigator>
    )
}