import React, { FC } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

const App: FC = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#d1cd00",
      },
      secondary: {
        main: "#b5b45c",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <AppHeader />
      <Outlet />
    </ThemeProvider>
  );
}

export default App;
function CreateTheme(arg0: { palette: any; }) {
  throw new Error('Function not implemented.');
}

