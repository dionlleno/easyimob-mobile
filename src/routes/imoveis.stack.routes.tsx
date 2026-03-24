import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ImoveisDetalhes from "../views/ImoveisDetalhes";
import ImoveisListagem from "../views/ImoveisListagem";

const Stack = createNativeStackNavigator();

export default function ImoveisStackRoutes(){
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: "#A0D4F7",
            },
            headerTitleStyle: {
                color: "#ffffff",
                fontWeight: "bold"},
        }}>
            <Stack.Screen
            name="listagem"
            component={ImoveisListagem}
            options={{
                title: "Imoveis"
            }}/>
            <Stack.Screen
            name="detalhes"
            component={ImoveisDetalhes}
            options={{
                title: "Detalhes"
            }}/>
        </Stack.Navigator>
    )
}