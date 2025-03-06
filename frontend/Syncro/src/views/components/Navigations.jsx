import { Link } from "react-router-dom";
import Button from "./Button";

import '../styles/Navigation.css';

export default function Navigation() {
    return (
        <div className="Navigation">
            <div className="menuOppener">
                <Button>Open</Button>
            </div>
            
            <div className="menuLinks">
                <Button as={Link} to={'/'}>Home</Button>
                <Button as={Link} to={'/profile'}>Profile</Button>
                <Button as={Link}  to={'/contact'}>Contact</Button>
            </div>

            <div className="menuDashboards">

            </div>
        </div>
    );
};