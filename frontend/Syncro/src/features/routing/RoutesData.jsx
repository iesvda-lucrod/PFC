import { RoomContextProvider } from "../../contexts/RoomContext";
import AuthPage from "../../views/pages/AuthPage/AuthPage";
import DashboardPage from "../../views/pages/DashboardPage/DashboardPage";
import InfoPage from "../../views/pages/InfoPage/InfoPage";
import NotFoundPage from "../../views/pages/NotFoundPage/NotFoundPage";
import RoomPage from "../../views/pages/RoomPage/RoomPage";

class RouteData {
    title;
    path;
    element;
    constructor(title, path, element){
        this.title = title;
        this.path = path;
        this.element = element;
    }
}

const routesData = [
    new RouteData('404', '*', <NotFoundPage/>),

    new RouteData('info', '/', <InfoPage/>),
    new RouteData('auth', '/auth', <AuthPage/>),
    
    new RouteData('dashboard', '/dashboard', <DashboardPage/>),
    new RouteData('room', '/dashboard/:id', <RoomContextProvider><RoomPage/></RoomContextProvider>),
];

export default routesData;