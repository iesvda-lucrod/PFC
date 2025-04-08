import useTask from "../../../models/useTask";
import './Task.css';

export default function Task({ taskInfo }) {
    const taskModel = useTask();

    return (
        <div className="Task"> 
            ID: {taskInfo.id}
            Name: {taskInfo.name}
        </div>
    );
}