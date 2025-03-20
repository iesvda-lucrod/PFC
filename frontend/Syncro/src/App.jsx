
import { BrowserRouter } from 'react-router-dom';
import './App.css'
import './variables.css'
import Router from './features/routing/Router';
import { UserContextProvider } from './contexts/UserContext';

//UI Component imports
import Navigation from "./views/components/Navigation/Navigation";

function App() {

  return (
    <div>
      <BrowserRouter>
      <UserContextProvider>
        
        <Navigation/>

        <Router />

      </UserContextProvider>
      </BrowserRouter>


    </div>
  )
}

export default App;
