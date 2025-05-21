<?php

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/TasksTable.php";
require_once __DIR__."/../services/webSockets/publishToWebSocket.php";

handleCorsRequest();
verifyToken();


$table = new TasksTable();

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        //$table->selectAll();
        $result = $table->filteredSelect($_GET, false);
        sendResponse(valid:true, message:'Tasks fetched successfully', data:$result);
        break;

    case "POST":
        $payload = handleContentType();
        try {
            if ($table->hasDuplicates($payload['section_id'], $payload)) sendResponse(valid:false, message:'Could not create the task', errors:'Task with same name already exists');
            $result = $table->createTask($payload);
            $room = $table->getParentSection($payload)['room_id'];
            sendToUsers($room, 'task', 'create', $result);
            sendResponse(valid:true, message:'Task created successfully', data:$result);
        } catch (Error $e) {
            logError($e);
            sendResponse(valid: false, message:'There was a problem inserting the task', responseCode:500);
        }
        break;

    case "DELETE":
        $payload = handleContentType();
        try {
            $table->delete($payload['id']);
            $room = $table->getParentSection($payload)['room_id'];
            sendToUsers($room, 'task', 'delete', $payload);
            sendResponse(valid: true, message:'Task deleted successfully');
        } catch (Error $e) {
            logError($e);
            sendResponse(valid:false, message:'There was a problem deleting the task', responseCode:500);
        }
        break;
    
    case "PUT":
        $payload = handleContentType();
        try {
            $table->update(['id' => $payload['id']], $payload);
            $room = $table->getParentSection($payload)['room_id'];
            sendToUsers($room, 'task', 'update', $payload);
            sendResponse(valid: true, message:'Task updated successfully');
        } catch (Error $e) {
            logError($e);
            sendResponse(valid:false, message:'There was a problem updating the task', errors:[$e->getTraceAsString()], responseCode:500);
        }
        break;
    default: 
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;