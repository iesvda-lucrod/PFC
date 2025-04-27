import { Link, Navigate, useNavigate } from "react-router-dom";

import { Icon_menu, Icon_home, Icon_user, Icon_phone, Icon_power } from "../../../assets/icons";
import './Navigation.css';
import { useEffect, useState } from "react";
import { UserContext, useUserContext } from "../../../contexts/UserContext";
import useAuth from "../../../models/useAuth";

export default function Navigation() {
     
    const [ isOpen, setIsOpen ] = useState();
    const { logout } = useAuth();
    const { userInfo, removeUserFromContext } = useUserContext();
    const navigate = useNavigate();

    const triggerMenu = () => {
        setIsOpen(!isOpen);
    }

    const handleLogoutClick = async () => {
        localStorage.clear();
        logout();
        removeUserFromContext();
        navigate('/auth');
    }

    return (
        <div className= {"Navigation "+(!userInfo ? 'hidden':'')}>
            <div className="MenuControl">
                <div className="MenuOppener">
                    <button onClick={triggerMenu}><Icon_menu/></button>
                </div>

                <div className="MenuRow">
                    <Link id="navDashboard" to={'/dashboard'}><Icon_home/></Link>
                </div>
                <div className="MenuRow">
                    <Link to={'/profile'}><Icon_user/></Link>
                </div>
                <div className="MenuRow">
                    <Link to={'/contact'}><Icon_phone/></Link>
                </div>

                <div className="MenuRow">
                    <button to={'/auth'} onClick={() => {handleLogoutClick()}}><Icon_power/></button>
                </div>
            </div>

            <div className={"MenuText "+(isOpen ? 'MenuOpen' : 'MenuClosed')}>
                <div className="MenuRow"> <span>Menu</span> </div>
                <div className="MenuRow"> <span>Phone</span> </div>
                <div className="MenuRow"> <span>Profile</span> </div>
                <div className="MenuRow"> <span>Contact</span> </div>
                <div className="MenuRow"> <span>Log out</span> </div>
            </div>
        </div>
    );
};