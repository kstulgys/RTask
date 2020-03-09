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

const RevoFonts = {
  heading: `Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  body: `Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  mono: `SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace`
};

theme.fonts = RevoFonts;

const base = {...theme, colors: {...theme.colors, ...RevolutTheme.colors}};

export default base;
