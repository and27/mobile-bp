import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductsListScreen from "./app/features/products/ui/screens/ProductsListScreen";
import { RootStackParamList } from "./app/navigation/types";
import ProductsDetailScreen from "./app/features/products/ui/screens/ProductsDetailScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ProductsList"
          component={ProductsListScreen}
          options={{ title: "Financial Products" }}
        />
        <Stack.Screen
          name="ProductsDetail"
          component={ProductsDetailScreen}
          options={{
            title: "Banco",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
