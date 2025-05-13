import { useState } from "react";
import useSection from "../../models/useSection";
import useRoom from "../../models/useRoom";
import useTask from "../../models/useTask";
import useAuth from "../../models/useAuth";
import useSidePanel from "../../models/useSidePanel";
import { RoomContext } from "./RoomContext";


export function RoomContextProvider(props) {
    const { children } = props;
    const { token } = useAuth();

    const { isLoading:roomIsLoading, model:roomCRUDModel }          = useRoom(token);
    const { isLoading:sectionIsLoading, model:sectionCRUDModel }    = useSection(token);
    const { isLoading:taskIsLoading, model:taskCRUDModel }          = useTask(token);
    const sidePanelFunctions = useSidePanel();

    const [ roomInfo, setRoomInfo ] = useState(null);
    const [ sections, setSections ] = useState(null);
    const [ tasks, setTasks ]       = useState(null);

    const loadRoomInfo = async (roomId) => {
        console.log("Fetching room info...");
        const roomResponse = await roomCRUDModel.getRoomInfo(roomId);

        console.log("Fething room sections...");
        const sectionResponse = await sectionCRUDModel.getRoomSections(roomId);

        console.log("Fetching room tasks...");
        const sectionIds = sectionResponse.data.map((section) => section.id);
        const taskResponse = await taskCRUDModel.getSectionTasks(sectionIds);

        console.log("Organizing tasks by section...");
        let organizedTasks = taskResponse.data.reduce((orderedObj, task) => {
            if (orderedObj[task.section_id]) orderedObj[task.section_id].push(task);
            else orderedObj[task.section_id] = [task];
            return orderedObj;
        }, {});

        console.log("Assigning tasks to sections...");
        sectionIds.forEach((currentId) => {
            const targetSection = sectionResponse.data.findIndex((section) => section.id === currentId);
            sectionResponse.data[targetSection].tasks = organizedTasks[currentId] || [];
        });

        setRoomInfo(roomResponse.data);
        setSections(sectionResponse.data);
        setTasks(taskResponse.data);

        console.log("Room information:", roomResponse.data, "Sections:",sectionResponse.data, "Tasks:", taskResponse.data);
    }

    const getTaskSection = (taskData) => {
        console.log("getting section of task with id:", taskData.id);
        return sections.find((section) => section.id === taskData.section_id);
    }
    const setIndividualSection = (sectionId, newSectionData) => {
        const taskIndex = sections.findIndex((section) => section.id === sectionId);
        setSections(prevSectionList => {
            const newSectionList = [...prevSectionList];
            newSectionList[taskIndex] = newSectionData;
            console.log("setting section "+sectionId+" data to ", newSectionData);
            return newSectionList;
        });
    };
    const resetPanel = () => {
        console.log("Setting panel to default");
        sidePanelFunctions.setPanel({
            header: roomInfo.name,
            content: [roomInfo.description],
            actions: []
        }, false);
    }

    return (
        <RoomContext.Provider
            value={{
                loadRoomInfo,
                room:       { roomIsLoading,    roomInfo,   setRoomInfo,                        roomModel:roomCRUDModel},
                section:    { sectionIsLoading, sections,   setSections, setIndividualSection,  sectionModel:{...sectionModelWrapper(), getRoomSections:sectionCRUDModel.getRoomSections}},
                task:       { taskIsLoading,    tasks,      setTasks,                           taskModel:{...taskModelWrapper(), getSectionTasks:taskCRUDModel.getSectionTasks, }},
                sidePanel:  { ...sidePanelFunctions, resetPanel}
            }}
        >
            {children}
        </RoomContext.Provider>
    );

    /**
     * Wraps the CRUD functions of the section Model to reflect changes in context
     * @returns The Create, Delete and Update functions
     */
    function sectionModelWrapper() {
        const createSection = async (sectionData) => {
            const response = await sectionCRUDModel.createSection(sectionData);
            const createdSection = response.data;
            if (response.valid) setSections(prevSectionList => [...prevSectionList, {...createdSection, tasks: []}]);
            return response;
        }
    
        const deleteSection = async (target) => {
            console.log("deletin:", target);
            const response = await sectionCRUDModel.deleteSection(target);
            if (response.valid) setSections(prevSectionList => prevSectionList.filter((section) => section.id !== target.id));
            return response;
        }
    
        const updateSection = async (sectionData) => {
            console.log("section updated", sectionData);
            const response = await sectionCRUDModel.updateSection(sectionData);
            if (response.valid) setIndividualSection(sectionData.id, sectionData);
            
            return response;

        }
        return {createSection, deleteSection, updateSection}
    }

    /**
     * Wraps the CRUD functions of the task Model to reflect changes in context
     * @returns The Create, Delete and Update functions
     */
    function taskModelWrapper() {
        const createTask = async (taskData) => {
            const response = await taskCRUDModel.createTask(taskData);
            if (response.valid) {
                let newTaskList = [...getTaskSection(response.data).tasks, response.data]; //Add the created task
                setIndividualSection(response.data.section_id, {...getTaskSection(response.data), tasks: newTaskList});
            }
            return response;
        }
    
        const deleteTask = async (target) => {
            const response = await taskCRUDModel.deleteTask(target);
            if (response.valid) {
                let newTaskList = [...getTaskSection(target).tasks].filter((task) => task.id != target.id); //Filter out the deleted task
                setIndividualSection(target.section_id, {...getTaskSection(target), tasks: newTaskList});
            }
            return response;
        }
    
        const updateTask = async (taskData) => {
            const response = await taskCRUDModel.updateTask(taskData);
            if (response.valid) {
                const sectionTasks = getTaskSection(taskData).tasks;
                const newTaskList = [...sectionTasks];
                const taskIndex = sectionTasks.findIndex((task) => task.id === taskData.id);
                newTaskList[taskIndex] = taskData;
                setIndividualSection(taskData.section_id, {...getTaskSection(taskData), tasks: newTaskList});
            }
            return response;
        }
        return {createTask, deleteTask, updateTask}
    }
}

