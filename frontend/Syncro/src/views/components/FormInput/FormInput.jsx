import './FormInput.css'

export default function FormInput({ label, name, type = "text", placeholder='', onChange, value, validationErrorMessage }) {

    return(
        <div className="FormInput">
            <label htmlFor={name}>{label}:</label>
            <input name={name} type={type} placeholder={placeholder} onChange={onChange} value={value}/>
            <span className="errorMessage">{validationErrorMessage}</span>
        </div>
    );
}