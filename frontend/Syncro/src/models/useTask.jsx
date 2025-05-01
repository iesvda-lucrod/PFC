import { useState } from "react";
import Task from "../classes/Task";
import useDatabase from "./useDatabase";

export default function useTask(token) {
    const {isLoading, model} = useDatabase('task.php', token);

    const createTask = async (taskInfo) => {
        const payload = new Task(taskInfo);
        let result = await model.post(payload);
        return result;
        
    }
    const deleteTask = async (targetId) => {
        let result = await model.delete(targetId);
        return result;
    }
    const editTask = async (taskInfo) => {
        const payload = new Task(taskInfo);
        let result = await model.put(payload);
        return result;
    }

    const getSectionTasks = async (sectionId) => {
        let result = await model.get({section_id: sectionId});
        return result;
    }

    return {isLoading, model:{getSectionTasks, createTask, deleteTask, editTask}}
}