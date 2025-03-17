import { Link } from "react-router-dom";

import { Icon_menu, Icon_home, Icon_user, Icon_phone } from "../../../assets/icons";
import './Navigation.css';
import { useState } from "react";

export default function Navigation() {
    const [ isOpen, setIsOpen ] = useState();

    const triggerMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className= {"Navigation "}>
            <div className="MenuControl">
                <div className="MenuOppener">
                    <button onClick={triggerMenu}><Icon_menu/></button>
                    
                </div>
                <div className="MenuRow">
                    <button id="navHome" as={Link} to={'/'}><Icon_home/></button>
                    
                </div>
                <div className="MenuRow">
                    <button as={Link} to={'/profile'}><Icon_user/></button>
                   
                </div>
                <div className="MenuRow">
                    <button as={Link} to={'/contact'}><Icon_phone/></button>
                    
                </div>
            </div>

            <div className={"MenuText "+(isOpen ? 'MenuOpen' : 'MenuClosed')}>
                <div className="MenuRow"> <span>Menu</span> </div>
                <div className="MenuRow"> <span>Phone</span> </div>
                <div className="MenuRow"> <span>Profile</span> </div>
                <div className="MenuRow"> <span>Contact</span> </div>
            </div>
        </div>
    );
};