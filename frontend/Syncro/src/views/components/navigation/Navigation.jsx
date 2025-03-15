import { Link } from "react-router-dom";

import './Navigation.css';
import { useState } from "react";

export default function Navigation() {
    const [ isOpen, setIsOpen ] = useState();

    const triggerMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className= {"Navigation "+(isOpen ? 'navOpen' : 'navClosed')}>
            <div className="menuOppener">
                <button onClick={triggerMenu}>Open</button>
                {isOpen ? <span>Menu</span> : <></>}
            </div>
            
            <div className="menuLinks">
                <button as={Link} to={'/'}></button>
                {isOpen ? <span>Home</span> : <></>}
                <button as={Link} to={'/'}></button>
                {isOpen ? <span>Profile</span> : <></>}
                <button as={Link} to={'/'}></button>
                {isOpen ? <span>Contact</span> : <></>}
            </div>

            <div className="menuDashboards">
            </div>
        </div>
    );
};