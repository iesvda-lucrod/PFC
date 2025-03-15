import { Routes, Route } from "react-router-dom";
import routesData from "./RoutesData";

export default function Router(){
    
    let definedRoutes = routesData.map(({title, path, element}) => {
        return <Route key={title} path={path} element={element}></Route>
    });

    return (
        <Routes>{definedRoutes}</Routes>
    );
}