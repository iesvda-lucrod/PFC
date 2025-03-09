
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'

//Controller imports

//UI Component imports
import Navigation from "./views/components/Navigations";
import HomePage from './views/pages/HomePage';
import NotFoundPage from './views/pages/NotFoundPage';
import LoginPage from './views/pages/LoginPage';
import UserContextProvider from './contexts/UserContext';

function App() {

  return (
    <div>
      <UserContextProvider>
        <Router>

        <Navigation/>


          <Routes>
            
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />

          </Routes>

          
        </Router>
      </UserContextProvider>
    </div>
  )
}

export default App;
