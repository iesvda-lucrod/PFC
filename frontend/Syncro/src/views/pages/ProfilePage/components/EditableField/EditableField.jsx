import "./EditableField.css";
import { useState } from "react";
import "./EditableField.css";
import { Icon_check, Icon_cross } from "../../../../../assets/icons";
import FormInput from "../../../../components/FormInput/FormInput";

export default function EditableField({ label, value, editing, setEditing,  confirmAction }) {
    const [ temporalValue, setTemporalValue ] = useState(value);

    const handleChange = (e) => {
        e.preventDefault();
        setTemporalValue(e.target.value);
    }

    const cancelChanges = () => {
        setTemporalValue(value);
        setEditing(false);
    }
    const confirmChanges = () => {
        confirmAction(temporalValue, value);
    }

    return (
        <div className="EditableField">
            <label>{label}:</label>
            {
                editing ? (
                <>
                    <input type="text" value={temporalValue} onChange={(e) => handleChange(e)}/>
                    <div className="buttons">
                        <button onClick={confirmChanges} className="confirmChanges"><Icon_check/></button>
                        <button onClick={cancelChanges} className="cancelChanges"><Icon_cross/></button>    
                    </div>
                    
                </>
                ) : (
                <>
                    <p>{value}</p>
                    <div className="buttons">
                        <button onClick={() => setEditing(true)}>Edit</button>
                    </div>
                </>
                )
            }
        </div>
    );
}