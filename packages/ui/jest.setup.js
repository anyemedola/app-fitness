// Native-only Expo modules have no meaningful behavior under Jest's Node/JSDOM
// environment, so we replace them with minimal functional mocks for component tests.
jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: View };
});

jest.mock("expo-image-picker", () => ({
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchCameraAsync: jest.fn().mockResolvedValue({ canceled: true, assets: null }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true, assets: null }),
}));
