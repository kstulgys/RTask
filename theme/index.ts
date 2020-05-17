import { theme as baseTheme } from '@chakra-ui/core'

const fonts = {
  heading: `Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  body: `Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  mono: `SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace`,
}

export const theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    revo: {
      red: '#EB008D',
      orange: '#FF481E',
      blue: '#0075EB',
      black: '#191B1F',
      gray: '#8B959E',
      lightGray: '#CDD5DB',
    },
  },
  fonts,
}
