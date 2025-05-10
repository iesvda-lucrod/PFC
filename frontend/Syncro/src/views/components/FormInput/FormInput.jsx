import './FormInput.css'

export default function FormInput({ name, type = "text", placeholder='', onChange, value, validationErrorMessage }) {

    return(
        <div className="FormInput">
            <label htmlFor={name}>{name}:</label>
            <input id={name} name={name} type={type} placeholder={placeholder} onChange={onChange} value={value}/>
            <span className="errorMessage">{validationErrorMessage}</span>
        </div>
    );
}