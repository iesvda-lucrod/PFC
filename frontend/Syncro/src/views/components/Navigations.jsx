import { Link } from "react-router-dom";
import Button from "./Button";

import '../styles/Navigation.css';
import { useState } from "react";

export default function Navigation() {
    const [ isOpen, setIsOpen ] = useState();

    const triggerMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className= {"Navigation "+(isOpen ? 'navOpen' : 'navClosed')}>
            <div className="menuOppener">
                <Button action={triggerMenu}>Open</Button>
                {isOpen ? <span>Menu</span> : <></>}
            </div>
            
            <div className="menuLinks">
                <Button as={Link} to={'/'}></Button>
                {isOpen ? <span>Home</span> : <></>}
                <Button as={Link} to={'/profile'}></Button>
                {isOpen ? <span>Profile</span> : <></>}
                <Button as={Link} to={'/contact'}></Button>
                {isOpen ? <span>Contact</span> : <></>}
            </div>

            <div className="menuDashboards">
            </div>
        </div>
    );
};