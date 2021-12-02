module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      ["bebas-regular"]: ["BebasNeue-Regular", "Helvetica", "sans-serif"],
      ["bebas-light"]: ["BebasNeue-Light", "Helvetica", "sans-serif"],
      ["bebas-bold"]: ["BebasNeue-Bold", "Helvetica", "sans-serif"],

      ["monteserrat-light"]: ["Monteserrat-Light", "Helvetica", "sans-serif"],
      ["monteserrat-semibold"]: [
        "Monteserrat-SemiBold",
        "Helvetica",
        "sans-serif",
      ],
    },
    extend: {
      colors: {
        background: {
          DEFAULT: "#040d25",
          light: "#0D1322",
        },
        primary: "#34af9b",
        secondary: {
          light: "#F8FAFC",
          DEFAULT: "#E2E8F0",
          dark: "#94A3B8",
        },
        error: "#FDBA74",
      },
    },
  },
  variants: {
    extend: {
      z: ["hover"],
    },
  },
  plugins: [],
};
