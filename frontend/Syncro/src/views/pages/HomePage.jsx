import { useUserContext } from "../contexts/UserContext";
import InfoPage from "./InfoPage";
import DashboardPage from "./DashboardPage";

export default function HomePage() {
    const { user } = useUserContext();
    console.log("userfrom context",user);
    console.log("userfrom context",user ? true: false);

    return(
        <>

        <h1>HOME ViEW</h1>

        { user ? <DashboardPage></DashboardPage> : <InfoPage></InfoPage>}

        
        </>
    );
}