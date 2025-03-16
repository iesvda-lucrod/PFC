import { redirect, useNavigate } from "react-router-dom";

export default function InfoPage() {
    let navigate = useNavigate();
    return (
        <>
    <h2>INFO PAGE (USER NOT LOGGED IN)</h2>
        <button onClick={() => {navigate('/auth')}}>Get started</button>
    </>
    );
    
}