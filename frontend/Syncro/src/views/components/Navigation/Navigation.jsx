import { Link, Navigate, useNavigate } from "react-router-dom";

import { Icon_menu, Icon_home, Icon_user, Icon_phone, Icon_power } from "../../../assets/icons";
import './Navigation.css';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";

export default function Navigation() {
    const [ isOpen, setIsOpen ] = useState();
    const { isLogged, logOut } = useContext(UserContext);
    const navigate = useNavigate();

    const triggerMenu = () => {
        setIsOpen(!isOpen);
    }

    const logout = async () => {
        localStorage.clear();
        logOut();
        navigate('/auth');
    }

    useEffect(() =>  {
        console.log("Islogged:", isLogged);
    }, [isLogged]);

    return (
        <div className= {"Navigation "+(!isLogged ? 'hidden':'')}>
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
                    <button to={'/auth'} onClick={() => {logout()}}><Icon_power/></button>
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