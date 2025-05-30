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
            {
                editing ? (
                <div className="editing">
                    <div className="text">
                        <label><b>{label}:</b></label>
                        <input type="text" value={temporalValue} onChange={(e) => handleChange(e)}/>    
                    </div>
                    <div className="buttons">
                        <button onClick={confirmChanges} className="confirmButton"><Icon_check/></button>
                        <button onClick={cancelChanges} className="cancelButton"><Icon_cross/></button>    
                    </div>
                </div>
                ) : (
                <div className="notEditing">
                    <div className="text">
                        <label><b>{label}:</b></label>
                        <p>{value}</p>
                    </div>
                    <div className="buttons">
                        <button onClick={() => setEditing(true)}>Edit</button>
                    </div>
                </div>
                )
            }
        </div>
    );
}