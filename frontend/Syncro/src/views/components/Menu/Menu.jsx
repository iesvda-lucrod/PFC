import { Link, Navigate, useNavigate } from "react-router-dom";

import { Icon_menu, Icon_home, Icon_user, Icon_phone, Icon_power } from "../../../assets/icons";
import './Menu.css';
import { useState } from "react";
import { useUserContext } from "../../../contexts/UserContext/UserContext";
import useAuth from "../../../models/useAuth";

export default function Menu() {
     
    const [ isOpen, setIsOpen ] = useState();
    const { logout, } = useAuth();
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
        <div className= {"Menu "+(!userInfo ? 'hidden':'')}>
            <div className="MenuControl">
                <div className="MenuRow">
                    <button className="triggerMenuButton" onClick={triggerMenu}><Icon_menu/></button>
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
                    <button className="logOffButton" to={'/auth'} onClick={() => {handleLogoutClick()}}><Icon_power/></button>
                </div>
            </div>

            <div className={"MenuText "+(isOpen ? 'MenuOpen' : 'MenuClosed')}>
                <div className="MenuRow buttonRow" onClick={triggerMenu}> <span>Menu</span> </div>
                <div className="MenuRow"> <Link className='link'to={'/dashboard'}>Dashboard</Link></div>
                <div className="MenuRow"> <Link className='link'to={'/profile'}>Profile</Link></div>
                <div className="MenuRow"> <Link className='link'to={'/contact'}>Contact</Link></div>
                <div className="MenuRow buttonRow"> <Link className='link logOut'to={'/contact'}>Log out</Link> </div>
            </div>
        </div>
    );
};