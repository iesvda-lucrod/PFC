import './Task.css';

export default function Task({ taskInfo }) {

    return (
        <div className="Task">
            <span>ID: {taskInfo.id}</span>
            <span>Title: {taskInfo.title}</span>
        </div>
    );
}