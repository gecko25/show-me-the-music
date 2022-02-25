module.exports = {
  mode: "jit", // just in time mode
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./icons/**/*.{js,ts,jsx,tsx}",
  ],
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
      width: {
        "18vw": "18vw",
        "82vw": "82vw",

        "15vw": "15vw",
        "85vw": "85vw",
      },
      borderWidth: {
        1: "1px",
      },
      spacing: {
        "15vw": "15vw",
        "16vw": "16vw",
        "18vw": "18vw",
        "19vw": "19vw",
      },
      colors: {
        background: {
          DEFAULT: "#202124",
          light: "#3f4247",
        },
        primary: "#8abeb7",
        secondary: {
          light: "#F8FAFC",
          DEFAULT: "#E2E8F0",
          dark: "#94A3B8",
        },
        error: "#FDBA74",
      },
      keyframes: {
        "pulse-horiztonal": {
          "0%, 100%": {
            transform: "translateX(-10%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateX(0)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "pulse-seagreen": {
          "0%, 100%": {
            color: "#E2E8F0",
          },
          "50%": {
            color: "#8abeb7",
          },
        },
      },
      animation: {
        "pulse-horiztonal": "pulse-horiztonal 1s ease-in-out 2.5",
        "pulse-seagreen": "pulse-seagreen 1s ease-in-out forwards 2.5",
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
