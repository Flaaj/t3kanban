const capitalizeString = (string: string, type: "eachWord" | "wholeString" = "wholeString") => {
  if (type === "eachWord") {
    return string
      .split(" ")
      .map((word) => capitalize(word))
      .join(" ");
  } else {
    return capitalize(string);
  }
};

export default capitalizeString;

const capitalize = (word: string) => {
  const firstLetter = word.slice(0, 1);
  const rest = word.slice(1);
  return firstLetter.toUpperCase() + rest.toLowerCase();
};
