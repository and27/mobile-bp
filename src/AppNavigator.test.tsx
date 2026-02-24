import { render, screen } from "@testing-library/react-native";
import AppNavigator from "./AppNavigator";

jest.mock("@react-navigation/native", () => {
  const React = jest.requireActual("react");

  return {
    NavigationContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock("@react-navigation/native-stack", () => {
  const React = jest.requireActual("react");
  const { Text, View } = jest.requireActual("react-native");

  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }: { children: React.ReactNode }) =>
        React.createElement(View, null, children),
      Screen: ({ name }: { name: string }) =>
        React.createElement(Text, null, `Screen-${name}`),
    }),
  };
});

describe("AppNavigator", () => {
  it("registers ProductsList and ProductsDetail screens", () => {
    render(<AppNavigator />);

    expect(screen.getByText("Screen-ProductsList")).toBeTruthy();
    expect(screen.getByText("Screen-ProductsDetail")).toBeTruthy();
  });
});
