/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    ({ addVariant }) => {
      addVariant("*", "& *");
      addVariant(">", "& > *");
      // react select:
      addVariant("rs_c", "& .rs__control");
      addVariant("rs_m", "& .rs__menu");
      addVariant("rs_ml", "& .rs__menu-list");
      addVariant("rs_is", "& .rs__indicator-separator");
    },
  ],
};
