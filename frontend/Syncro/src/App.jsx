
import { BrowserRouter } from 'react-router-dom';
import './App.css'
import './variables.css'
import Router from './features/routing/Router';
import { UserContextProvider } from './contexts/UserContext';
import { RoomContextProvider } from './contexts/RoomContext';

//UI Component imports
import Navigation from "./views/components/Navigation/Navigation";

function App() {

  return (
    <div className='App'>
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
