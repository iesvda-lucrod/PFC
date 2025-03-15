
import InfoPage from "./InfoPage";
import DashboardPage from "./DashboardPage";
import { useState } from "react";
import { redirect } from "react-router-dom";

export default function HomePage() {
    const [ logged, setLogged ] = useState(false);
    console.log(logged, 'redirercting');

    return(
        <>
         {logged ? <DashboardPage/> : <InfoPage/>}
        </>
    );
}