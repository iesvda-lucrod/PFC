import './FormInput.css'

export default function FormInput({ label, name, type = "text", placeholder='', onChange, value, validationErrorMessage }) {

    return(
        <div className="FormInput">
            <div className='inputContainer'>
                <label htmlFor={name}>{label}:</label>
                <input id={name} name={name} type={type} placeholder={placeholder} onChange={onChange} value={value}/>
            </div>
            <span className="errorMessage"> {validationErrorMessage}</span>
        </div>
    );
}