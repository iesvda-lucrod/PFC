import { useRef, useState } from "react";
import useRoom from "./useRoom";

export default function useWebSocket(roomId, token) {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ messageReceived, setMessageReceived ] = useState(null);
    const ws = useRef(null);


    const initWebSocket = () => {
        return new Promise((resolve, reject) => {
            ws.current = new WebSocket("ws://127.0.0.1:9502");

            ws.current.onopen = async function() {
                console.log("Connected to WebSocket server");
                setIsOpen(true);
                resolve();
            };

            ws.current.onclose = function() {
                console.log("WebSocket connection closed");
                ws.current = null;
                setIsOpen(false);
            };

            ws.current.onmessage = function(event) {
                console.log("Received from server:", event.data);
                setMessageReceived(JSON.parse(event.data));
            };

            ws.current.onerror = function(error) {
                console.error("WebSocket error:", error);
                setIsOpen(false);
                reject();
            };

            console.log("WEBSOCKET SET UP SUCCEWSSFFULLY", ws.current);
        });
    }

    const sendJsonMessage = (message) => {
        if (ws.current === null) {console.log('WS not initialized');return false};
        message.token = token;
        message.room = roomId;
        console.log("Sending to websocket", message);
        ws.current.send(JSON.stringify(message));
        return true;
    }

    const joinRoom = (user, room) => {
        sendJsonMessage({action: 'joinRoom', targetType:'connection', operationType:'joined', data:{user:user, room:room}});
    }
    const closeConnection = () => {
        ws.current.close();
        ws.current = null;
    };

    const broadcast = (targetType, operationType, data) => {
        sendJsonMessage({action: 'broadcast', targetType:targetType, operationType:operationType, data:data});
    }

    return { initWebSocket, newMessageReceived:messageReceived, sendJsonMessage, closeConnection, joinRoom, broadcast, isOpen };
}