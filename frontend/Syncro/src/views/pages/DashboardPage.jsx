import RoutingController from "../../controllers/RoutingController";
import Button from "../components/Button";
import { useUserContext } from "../../contexts/UserContext";
import UserDataController from "../../controllers/UserDataController";

export default function DashboardPage() {
    const { user, setUser, logout } = useUserContext();
    const userDataController = new UserDataController();
    console.log('ACTIVE USER: ', user);



    return (
        <>
        <h2>My Rooms</h2>
        <Button >Create a new room</Button>

        <h2>Rooms I'm a memeber of</h2>
        
        </>
    );
}