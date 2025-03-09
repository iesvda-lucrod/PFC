import { useNavigate } from "react-router-dom";

export default class RoutingController {

    static #navigate = useNavigate();

    static execute(action, data) {
        switch (action) {
            case 'goto':
                this.#redirect(data);
                break;
            default:
                console.err('action not registered', action);
                break;
        }
    }
    static #redirect(route) {
        console.log("Routing to ", route);
        this.#navigate(route);
    }
}