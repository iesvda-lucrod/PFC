import { useContext } from "react";

export default function TestComponent() {

    const myContext = useContext();

    const incClick = () => {
        
    }

    return (
        <div>
            <button onClick={incClick}></button>
            <button onClick={incClick}></button>
            <span>{}</span>
        </div>
    );
}