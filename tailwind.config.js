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
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
