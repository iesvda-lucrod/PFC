
import { BrowserRouter } from 'react-router-dom';
import './App.css'
import Router from './features/routing/Router';
import { UserContextProvider } from './contexts/UserContext';

//UI Component imports
import Navigation from "./views/components/navigation/Navigation";

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
