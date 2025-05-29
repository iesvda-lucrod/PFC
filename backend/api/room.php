<?php


require_once __DIR__.'/../services/endpointFunctions.php';

handleCorsRequest();

require_once __DIR__."/../services/DBAccess/RoomsTable.php";
require_once __DIR__."/../services/webSockets/publishToWebSocket.php";

$table = new RoomsTable();
$token = verifyToken();

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        try {
            if (isset($_GET['action'])) {
            if ($_GET['action'] === 'getUserRooms') {unset($_GET['action']);
                $result = $table->getUserRooms($_GET['user_id']);
                sendResponse(valid:true, message:'User rooms fetched successfully', data: $result);
            }
            if ($_GET['action'] === 'getRoomMembers') {
                unset($_GET['action']);
                $result = $table->getRoomMembers($_GET['room_id']);
                sendResponse(valid:true, message:'Room users fetched successfully', data: $result);
            }
            }

            if (isset($_GET['id'])) {
                $result = $table->selectByField('id', $_GET['id']);
                sendResponse(valid:true, message:'Room information fetched successfully', data:reset($result));
            }

            $result = $table->selectAll();
            sendResponse(valid:true, message:'Room information fetched successfully', data:$result);
        } catch (\Throwable $e) {
            logError($e, 'There was a problem updating the task');
            sendResponse(valid:false, message:'There was a problem updating the task', errors:[$e->getTraceAsString()], responseCode:500);
        }
        break;

    case "POST":
        try {
            $payload = handleContentType();

            if ($table->hasDuplicates($payload['user_id'], $payload['room'])) {sendResponse(valid:false, message:'There was a problem creating the room', errors: ['name' => 'Room with same name already exists']);}
            $roomInfo = $table->createRoom($payload);
            sendResponse(valid:true, message:'Room created successfully', data:['room' => $roomInfo]);
        } catch (Error $e) {
            logError($e, 'There was a problem creating the room');
            sendResponse(valid:false, message:'There was a problem updating the task', errors:[$e->getTraceAsString()], responseCode:500);
        }
        break;

    case "DELETE":
        try {
            $payload = handleContentType();

            if (isset($payload['action'])) {
                if ($payload['action'] === 'leaveRoom') {
                    $table->leaveRoom($payload['userId'], $payload['roomId']);
                    sendToIndividualUser($payload['roomId'], $payload['userId'], 'connection', 'kick', $payload['userId']);
                    sendResponse(valid:true, message:'Left room successfully');
                }
            }

            $result = $table->delete($payload['id']);
            if (!$result) sendResponse(['message' => 'There was an error deleting the room'], 500);
            sendResponse(valid:true, message:'Room deleted successfully');
        } catch (Error $e) {
            logError($e, 'There was a problem deleting the room');
            sendResponse(valid:false, message:'There was a problem deleting the room', errors:[$e->getTraceAsString()], responseCode:500);
        }
        break;
    
    case "PUT":
        try {
            $payload = handleContentType();
            $result = $table->update($payload['id'], $payload['newValues']);
            if (!$result) sendResponse(valid: false, message:'There was an error updating the room', responseCode:500);
            sendResponse(valid: true, message:'Room info updated successfully');
        } catch (Error $e) {
            logError($e,'There was a problem updating the room');
            sendResponse(valid:false, message:'There was a problem updating the room', errors:[$e->getTraceAsString()], responseCode:500);
        }
        break;
    default: 
        logError(new Error('Access to unauthorized method: '.$_SERVER['REEQUEST_METHOD']));
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;

