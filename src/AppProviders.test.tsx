import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { AppProviders } from "./AppProviders";

describe("AppProviders", () => {
  it("renders children", () => {
    render(
      <AppProviders>
        <Text>providers-child</Text>
      </AppProviders>,
    );

    expect(screen.getByText("providers-child")).toBeTruthy();
  });
});
