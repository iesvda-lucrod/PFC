import { useNavigate } from "react-router-dom";

export default class RoutingController {

    navigate;
    constructor() {
        this.navigate = useNavigate();
    }

    execute(action, data) {
        switch (action) {
            case 'goto':
                this.redirect(data);
                break;
            default:
                console.err('action not registered', action);
                break;
        }
    }
    redirect(route) {
        console.log("Routing to ", route);
        this.navigate(route);
    }
}