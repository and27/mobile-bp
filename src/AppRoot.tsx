import { Text } from "react-native";
import { AppProviders } from "./AppProviders";
import AppNavigator from "./AppNavigator";

export const AppRoot = () => {
  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
};
