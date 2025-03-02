
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'

//UI Component imports
import Navigation from "./views/components/Navigations";
import HomePage from './views/pages/HomePage';
import NotFoundPage from './views/pages/NotFoundPage';

function App() {

  return (
    <div>
      <Navigation/>
      <h1>APP COMPONENT</h1>

      
      <Router>
        <Routes>
          
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Router>
      
    </div>
  )
}

export default App;
