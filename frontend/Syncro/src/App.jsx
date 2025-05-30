
import { BrowserRouter } from 'react-router-dom';
import './App.css'
import './variables.css'
import Router from './features/routing/Router';
import { UserContextProvider } from './contexts/UserContext/UserContextProvider';
//UI Component imports
import Navigation from "./views/components/Menu/Menu";
import { HelmetProvider } from 'react-helmet-async';

function App() {

  return (
    <div className='App'>
    <HelmetProvider>
      <BrowserRouter basename="/Lucas_PFC">
        <UserContextProvider>
          <Navigation/>

          <Router />
        </UserContextProvider>
      </BrowserRouter>
    </HelmetProvider>
    </div>
  );
}

export default App;
