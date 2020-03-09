import {theme} from "@chakra-ui/core";

const RevolutTheme = {
  colors: {
    revo: {
      red: "#EB008D",
      orange: "#FF481E",
      blue: "#0075EB",
      black: "#191B1F",
      gray: "#8B959E",
      lightGray: "#CDD5DB"
    }
  }
};

const base = {...theme, colors: {...theme.colors, ...RevolutTheme.colors}};

export default base;
