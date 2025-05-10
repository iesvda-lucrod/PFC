import Task from "../classes/Task";
import useDatabase from "./useDatabase";

export default function useTask(token) {
    const {isLoading, model} = useDatabase('task.php', token);

    const createTask = async (taskInfo) => {
        console.log("sending", taskInfo);
        let result = await model.post(taskInfo);
        return result;
    }
    const deleteTask = async (target) => {
        let result = await model.delete({id: target.id});
        return result;
    }
    const updateTask = async (taskInfo) => {
        const payload = new Task(taskInfo);
        let result = await model.put(payload);
        return result;
    }

    const getSectionTasks = async (sectionId) => {
        let result = await model.get({section_id: sectionId});
        return result;
    }

    return {isLoading, model:{getSectionTasks, createTask, deleteTask, updateTask}}
}