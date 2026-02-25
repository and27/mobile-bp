import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductsListScreen from "./app/features/products/ui/screens/ProductsListScreen";
import { RootStackParamList } from "./app/navigation/types";
import ProductsDetailScreen from "./app/features/products/ui/screens/ProductsDetailScreen";
import ProductsFormScreen from "./app/features/products/ui/screens/ProductsFormScreen";
import BrandHeader from "./app/navigation/components/BrandHeader";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitle: () => <BrandHeader />,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="ProductsList" component={ProductsListScreen} />
        <Stack.Screen name="ProductsDetail" component={ProductsDetailScreen} />
        <Stack.Screen name="ProductsForm" component={ProductsFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
