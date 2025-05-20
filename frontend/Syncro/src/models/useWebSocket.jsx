import { useEffect, useRef, useState } from "react";

export default function useWebSocket() {
    const [ messageReceived, setMessageReceived ] = useState(null);
    const ws = useRef(null);

    const sendJsonMessage = (message) => {
        if (ws.current === null) {console.log('WS not initialized')};
        ws.current.send(JSON.stringify(message));
    }

    useEffect(() => {
        ws.current = new WebSocket("ws://127.0.0.1:9503");

        ws.current.onopen = function() {
            console.log("Connected to WebSocket server");
            sendJsonMessage({action:'joinRoom'});
        };

        ws.current.onclose = function() {
            console.log("WebSocket connection closed");
            sendJsonMessage({action:'leaveRoom'});
        };

        ws.current.onmessage = function(event) {
            console.log("Received from server:", event.data);
            setMessageReceived(JSON.parse(event.data));
        };

        ws.current.onerror = function(error) {
            console.error("WebSocket error:", error);
        };
    }, []);

    return { newMessageReceived:messageReceived, sendJsonMessage };
}