import { useNavigate } from "react-router-dom";

export default function InfoPage() {
    let navigate = useNavigate();
    return (
        <div className="InfoPage">
            <h2>INFO PAGE (USER NOT LOGGED IN)</h2>
            <button onClick={() => {navigate('/auth')}}>Get started</button>
        </div>
    );
    
}