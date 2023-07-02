import React from 'react';
import { Router, Outlet, ReactLocation } from "@tanstack/react-location";
import routes from './components/Routes';
// for notification
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// Set up a ReactLocation instance
const location = new ReactLocation();
const darkTheme = createTheme({
   palette: {
     mode: 'dark',
   },
   components: {
      // Name of the component
      MuiPaper: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            borderRadius: "100px",
            boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.75)",
          },
        },
      },
    },
 });
const App = () => {

   return (
      <>
         <Toaster
            position="top-center"
            reverseOrder={false}
         />
         <Router
            location={location}
            routes={routes}
         >
            <Outlet />
         </Router>
      </>

      // <ThemeProvider theme={darkTheme}>
      //    <main>This app is using the dark mode</main>
      // </ThemeProvider>

   )
}

export default App;