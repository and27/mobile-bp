import { render } from "@testing-library/react-native";
import { AppRoot } from "./AppRoot";
import AppNavigator from "./AppNavigator";

jest.mock("./AppNavigator", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

describe("AppRoot", () => {
  it("renders AppNavigator", () => {
    const mockedAppNavigator = AppNavigator as unknown as jest.Mock;

    render(<AppRoot />);

    expect(mockedAppNavigator).toHaveBeenCalledTimes(1);
  });
});
