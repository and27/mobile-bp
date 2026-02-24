describe("httpClient", () => {
  const originalBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  afterEach(() => {
    jest.resetModules();
    if (originalBaseUrl) {
      process.env.EXPO_PUBLIC_API_BASE_URL = originalBaseUrl;
    } else {
      delete process.env.EXPO_PUBLIC_API_BASE_URL;
    }
  });

  it("throws when EXPO_PUBLIC_API_BASE_URL is not present", () => {
    jest.resetModules();
    delete process.env.EXPO_PUBLIC_API_BASE_URL;
    expect(() => require("./httpClient")).toThrow(
      "Missing EXPO_PUBLIC_API_BASE_URL",
    );
  });

  it("maps errors without response to NETWORK_ERROR", async () => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_API_BASE_URL = "http://localhost:3002";
    const mockUse = jest.fn();
    const mockCreate = jest.fn(() => ({
      interceptors: {
        response: {
          use: mockUse,
        },
      },
    }));
    jest.doMock("axios", () => ({
      __esModule: true,
      default: {
        create: mockCreate,
      },
    }));
    expect(require("./httpClient"));
    const errorHandler = mockUse.mock.calls[0][1];
    await expect(errorHandler({})).rejects.toMatchObject({
      code: "NETWORK_ERROR",
    });
  });
});
