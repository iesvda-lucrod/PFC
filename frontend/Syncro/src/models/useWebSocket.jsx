import { useRef, useState } from "react";

export default function useWebSocket(token) {
    const [ messageReceived, setMessageReceived ] = useState(null);
    const ws = useRef(null);

    const sendJsonMessage = (message) => {
        if (ws.current === null) {console.log('WS not initialized');return};
        message.token = token;
        console.log("Sending to websocket", message);
        ws.current.send(JSON.stringify(message));
    }
    const initWebSocket = (roomId) => {
        
        ws.current = new WebSocket("ws://127.0.0.1:9502");

        ws.current.onopen = function() {
            console.log("Connected to WebSocket server");
            sendJsonMessage({action:'ping'});
            sendJsonMessage({action:'joinRoom', room:roomId});
        };

        ws.current.onclose = function() {
            console.log("WebSocket connection closed");
        };

        ws.current.onmessage = function(event) {
            console.log("Received from server:", event.data);
            setMessageReceived(JSON.parse(event.data));
        };

        ws.current.onerror = function(error) {
            console.error("WebSocket error:", error);
        };
    }   

    return { initWebSocket, newMessageReceived:messageReceived, sendJsonMessage };
}