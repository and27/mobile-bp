import { AppError } from "./AppError";
import { mapErrorToMessage } from "./mapErrorToMessage";

describe("mapErrorToMessage", () => {
  it("maps network error", () => {
    const result = mapErrorToMessage(new AppError("NETWORK_ERROR", "network"));
    expect(result).toBe("Network error. Please check your connection.");
  });

  it("maps http 404", () => {
    const result = mapErrorToMessage(
      new AppError("HTTP_ERROR", "Not found", 404),
    );
    expect(result).toBe("Resource not found.");
  });

  it("maps http 400", () => {
    const result = mapErrorToMessage(
      new AppError("HTTP_ERROR", "Bad request", 400),
    );
    expect(result).toBe("Invalid request data.");
  });

  it("maps unknown error", () => {
    const result = mapErrorToMessage(new Error("Unknown"));
    expect(result).toBe("Unexpected error. Please try again.");
  });
});
