
import InfoPage from "./InfoPage";
import DashboardPage from "./DashboardPage";
import { useContext, useState } from "react";
import { redirect } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

export default function HomePage() {
    const { userInfo, isLogged } = useContext(UserContext);
    console.log(userInfo, 'redirercting', isLogged);

    return(
        <>
         {isLogged ? <DashboardPage/> : <InfoPage/>}
        </>
    );
}