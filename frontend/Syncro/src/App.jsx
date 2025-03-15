
import { BrowserRouter } from 'react-router-dom';
import './App.css'
import Router from './features/routing/Router';

//UI Component imports
import Navigation from "./views/components/navigation/Navigation";



function App() {

  return (
    <div>
      <BrowserRouter>
        <Navigation/>

        <Router />
      </BrowserRouter>


    </div>
  )
}

export default App;
