import AuthPage from "../../views/pages/AuthPage";
import HomePage from "../../views/pages/HomePage";
import NotFoundPage from "../../views/pages/NotFoundPage";

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

    new RouteData('home', '', <HomePage/>),
    new RouteData('home', 'auth', <AuthPage/>),
];

export default routesData;