<?php

require_once __DIR__."/../services/endpointFunctions.php";
require_once __DIR__."/../services/DBAccess/TasksTable.php";
require_once __DIR__."/../services/webSockets/publishToWebSocket.php";

handleCorsRequest();
verifyToken();

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        try {
            $table = new TasksTable();
            $result = $table->filteredSelect($_GET, false);
            sendResponse(valid:true, message:'Tasks fetched successfully', data:$result);
        } catch (Error $e) {
            logError($e, 'There was a problem inserting the task');
            sendResponse(valid: false, message:'There was a problem inserting the task', responseCode:500);
        }
        break;

    case "POST":
        $payload = handleContentType();
        try {
            $table = new TasksTable();
            $result = $table->createTask($payload);
            $room = $table->getParentSection($payload)['room_id'];
            sendToUsers($room, 'task', 'create', $result);
            sendResponse(valid:true, message:'Task created successfully', data:$result);
        } catch (Error $e) {
            logError($e, 'There was a problem inserting the task');
            sendResponse(valid: false, message:'There was a problem inserting the task', responseCode:500);
        }
        break;

    case "DELETE":
        $payload = handleContentType();
        try {
            $table = new TasksTable();
            $table->deleteTask($payload);
            $room = $table->getParentSection($payload)['room_id'];
            sendToUsers($room, 'task', 'delete', $payload);
            sendResponse(valid: true, message:'Task deleted successfully');
        } catch (Error $e) {
            logError($e, 'There was a problem deleting the task');
            sendResponse(valid:false, message:'There was a problem deleting the task', responseCode:500);
        }
        break;
    
    case "PUT":
        $payload = handleContentType();
        try {
            $table = new TasksTable();
            if (isset($payload['action'])) {
                if ($payload['action'] === 'reorderTask') {
                    $table->reorderTask($payload['movedTask'], $payload['targetTask'], $payload['under']);

                    $updatedSections = [];
                    $movedSectionData = $table->getParentSection($payload ['movedTask']);
                    $movedSectionData['tasks'] = $table->selectByField('section_id', $payload['movedTask']['section_id']);
                    $updatedSections[] = $movedSectionData;
                    if ($payload['movedTask']['section_id'] !== $payload['targetTask']['section_id']) {
                        $targetSectionData = $table->getParentSection($payload ['targetTask']);
                        $targetSectionData['tasks'] = $table->selectByField('section_id', $payload['targetTask']['section_id']);
                        $updatedSections[] = $targetSectionData;
                    }

                    $room = $table->getParentSection($payload['movedTask'])['room_id'];
                    sendToUsers($room, 'task', 'reorder', $updatedSections);
                    sendResponse(valid:true, message:"Tasks reordered successfully", data:$updatedSections);
                }

                if ($payload['action'] === 'changeSection') {
                    $table->changeSection($payload['movedTask'], $payload['targetSection']);

                    $movedSectionData = $table->getParentSection($payload ['movedTask']);
                    $movedSectionData['tasks'] = $table->selectByField('section_id', $movedSectionData['id']);
                    $targetSectionData = $table->getParentSection(['section_id' => $payload['targetSection']['id']]);
                    $targetSectionData['tasks'] = $table->selectByField('section_id', $payload['targetSection']['id']);

                    sendToUsers($payload['targetSection']['room_id'], 'task', 'reorder', [$movedSectionData, $targetSectionData]);
                    sendResponse(valid:true, message:'Task moved successfully', data:['task' => $payload['movedTask']]);
                }
            }


            $room = $table->getParentSection($payload)['room_id'];
            sendToUsers($room, 'task', 'update', $payload);
            sendResponse(valid: true, message:'Task updated successfully');
        } catch (Error $e) {
            logError($e, 'There was a problem updating the task');
            sendResponse(valid:false, message:'There was a problem updating the task', errors:[$e->getTraceAsString()], responseCode:500);
        }
        break;
    default: 
        logError(new Error('Access to unauthorized method: '.$_SERVER['REEQUEST_METHOD']));
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;