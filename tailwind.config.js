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
      // react-select:
      addVariant("rs_c", "& .react-select__control");
      addVariant("rs_m", "& .react-select__menu");
      addVariant("rs_ml", "& .react-select__menu-list");
      addVariant("rs_is", "& .react-select__indicator-separator");
    },
  ],
};
