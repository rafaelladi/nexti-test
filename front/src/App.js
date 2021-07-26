import './App.css';
import Dashboard from "./Dashboard";
import {createTheme} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/core/styles';
import {teal} from "@material-ui/core/colors";

const App = () => {
  const theme = createTheme({
    overrides: {
      MuiTablePagination: {
        spacer: {
          flex: 'none'
        }
      }
    },
    palette: {
      type: "dark",
      primary: teal,
      secondary: teal
    },
  });

  return (
      <ThemeProvider theme={theme}>
        <Dashboard />
      </ThemeProvider>
  );
}

export default App;
