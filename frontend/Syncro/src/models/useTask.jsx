import Task from "../classes/Task";
import useFetch from "./useFetch";

export default function useTask(token) {
    const {isLoading, model} = useFetch('task.php', token);

    const createTask = async (taskInfo) => {
        const payload = new Task({...taskInfo});
        let result = await model.post(payload);
        return result;
    }
    const deleteTask = async (target) => {
        console.log("deleting ", target);
        let result = await model.delete(target);
        return result;
    }
    const updateTask = async (taskInfo) => {
        const payload = new Task({...taskInfo});
        let result = await model.put(payload);
        return result;
    }

    const getSectionTasks = async (sectionId) => {
        let result = await model.get({section_id: sectionId});
        return result;
    }

    const reorderTask = async (movedTask, targetTask, under) => {
        let result = model.put({action:'reorderTask', movedTask:movedTask, targetTask:targetTask, under:under});
        return result;
    }
    const changeSection = async (movedTask, targetSection) => {
        let result = model.put({action:'changeSection', movedTask:movedTask, targetSection:targetSection});
        return result
    }

    return {isLoading, model:{getSectionTasks, createTask, deleteTask, updateTask, reorderTask, changeSection}}
}