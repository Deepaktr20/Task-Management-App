import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Mulish', sans-serif", // Apply globally
    h1: {
      fontFamily: "'Mulish', sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Mulish', sans-serif",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "'Mulish', sans-serif",
      fontWeight: 400,
    },
  },
});

export default theme;