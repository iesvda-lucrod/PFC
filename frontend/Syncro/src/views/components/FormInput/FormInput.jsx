import './FormInput.css'

export default function FormInput({ name, type = "text", placeholder='', onChange }) {

    return(
        <div className="FormInput">
            <label htmlFor={name}>{name}:</label>
            <input id={name} name={name} type={type} placeholder={placeholder} onChange={onChange}/>
        </div>
    );
}