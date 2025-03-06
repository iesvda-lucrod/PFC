import { redirect, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import RoutingController from "../../controllers/RoutingController";

export default function InfoPage() {
    return (
        <>
    <h2>INFO PAGE (USER NOT LOGGED IN)</h2>

    <Button controller={new RoutingController()} action={'goto'} data={'/login'}> Get started</Button>
    </>
    );
    
}