import "./GlobalErrorAlert.css";
export default function GlobalErrorAlert({ errorMessage }) {
    return (
        <div className="GlobalErrorAlert">
            <span>{errorMessage}</span>
        </div>
    );
}