import { useEffect, useRef, useState } from "react";
import useSection from "../../models/useSection";
import useRoom from "../../models/useRoom";
import useTask from "../../models/useTask";
import useAuth from "../../models/useAuth";
import useSidePanel from "../../models/useSidePanel";
import { RoomContext } from "./RoomContext";
import useWebSocket from "../../models/useWebSocket";


export function RoomContextProvider({ roomId, children }) {
    const { token } = useAuth();

    const { isLoading:roomIsLoading, model:roomCRUDModel }          = useRoom(token);
    const { isLoading:sectionIsLoading, model:sectionCRUDModel }    = useSection(token);
    const { isLoading:taskIsLoading, model:taskCRUDModel }          = useTask(token);
    const sidePanelFunctions = useSidePanel();

    const { initWebSocket, newMessageReceived, ...webSocket } = useWebSocket(roomId, token);

    useEffect(() => {
        if (!newMessageReceived) {return;}
            console.log("received", newMessageReceived);
            triggerStateUpdate(newMessageReceived);
    },[newMessageReceived]);

    const [ roomInfo, setRoomInfo ] = useState(null);
    const [ sections, setSections ] = useState(null);
    const [ tasks, setTasks ]       = useState(null);

    const [ activeUsers, setActiveUsers ] = useState([]);

    const loadRoom = async () => {
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
        console.log("Initiating web socket...");
        await initWebSocket();
        console.log("Websocket initiated");
    }


    const getTaskSection = (taskData) => {
        console.log("getting section of task with id:", taskData.id);
        return sections.find((section) => section.id === taskData.section_id);
    }
    const setIndividualSection = (sectionId, newSectionData) => {
        const taskIndex = sections.findIndex((section) => section.id === sectionId);
        if (!newSectionData.tasks) newSectionData.tasks = [];
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
                loadRoom,
                activeUsers,
                
                room:       { roomIsLoading,    roomInfo,   setRoomInfo,                        roomModel:roomCRUDModel},
                section:    { sectionIsLoading, sections,   setSections, setIndividualSection,  sectionModel:sectionCRUDModel},
                task:       { taskIsLoading,    tasks,      setTasks,                           taskModel:taskCRUDModel},

                sidePanel:  { ...sidePanelFunctions, resetPanel},
                webSocket,
            }}
        >
            {children}
        </RoomContext.Provider>
    );


    function triggerStateUpdate(payload) {
        switch (payload.targetType) {
            case 'task':
                if (payload.operationType === 'create') {
                    let newTaskList = [...getTaskSection(payload.data).tasks, payload.data]; //Add the created task
                    setIndividualSection(payload.data.section_id, {...getTaskSection(payload.data), tasks: newTaskList});
                    break;
                }
                if (payload.operationType === 'delete') {
                    const target = payload.data;
                    let newTaskList = [...getTaskSection(target).tasks].filter((task) => task.id != target.id); //Filter out the deleted task
                    setIndividualSection(target.section_id, {...getTaskSection(target), tasks: newTaskList});
                }
                if (payload.operationType === 'update') {
                    const sectionTasks = getTaskSection(payload.data).tasks;
                    const newTaskList = [...sectionTasks];
                    const taskIndex = sectionTasks.findIndex((task) => task.id === payload.data.id);
                    newTaskList[taskIndex] = payload.data;
                    setIndividualSection(payload.data.section_id, {...getTaskSection(payload.data), tasks: newTaskList});
                }
                break;
            case 'section':
                if (payload.operationType === 'create') setSections(prevSectionList => [...prevSectionList, {...payload.data, tasks: []}]);
                if (payload.operationType === 'delete') setSections(prevSectionList => prevSectionList.filter((section) => section.id !== payload.data.id));
                if (payload.operationType === 'update') setIndividualSection(payload.data.id, payload.data);
                break;
            case 'room':
                if (payload.operationType) {console.log("This room action hello")}
                break;
            case 'connection':
                if (payload.operationType === 'ping') console.log("PONG");
                if (payload.operationType === 'updateActiveUsers') {console.log("new active users", payload.data);setActiveUsers([...payload.data])};
                break;
            default:
                console.error("Undefined target", payload.targetType);
                break;
        }
    }
}

