import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#447F98",
        secondary: "#629BB5",
        accent: "#B9D8E1",
        background: "#D6EBF3",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        robotoCondensed: ["var(--font-roboto-condensed)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
