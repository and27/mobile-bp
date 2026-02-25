import "@testing-library/jest-native/extend-expect";
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);

process.env.EXPO_PUBLIC_API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3002";
