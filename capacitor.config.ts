import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rizvihasan.fintrx",
  appName: "FinTRX",
  webDir: "dist",
  android: {
    allowMixedContent: false,
  },
};

export default config;
