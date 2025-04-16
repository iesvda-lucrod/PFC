<?php


require_once __DIR__.'/../services/api.php';

handleCorsRequest();

require_once __DIR__."/../services/DBAccess/RoomsTable.php";
$table = new RoomsTable();
$token = verifyToken();

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        if (isset($_GET['action'])) {
            if ($_GET['action'] === 'getUserRooms') {unset($_GET['action']);
                $result = $table->getUserRooms($_GET['user_id']);
                sendResponse($result);
            }
            if ($_GET['action'] === 'getRoomUsers') {
                unset($_GET['action']);
                $result = $table->getRoomUsers($_GET['user_id']);
                sendResponse($result);
            }
        }

        if (isset($_GET['id'])) {
            $result = $table->selectByField('id', $_GET['id']);
            sendResponse(reset($result));
        }

        $result = $table->selectAll();
        sendResponse(['rooms'=> $result]);
        break;

    case "POST":
        $payload = handleContentType();

        if ($table->hasDuplicates($payload['data']['user_id'], $payload['data']['room'])) {sendResponse(['valid' => false, 'error' => ['name' => 'Room with same name already exists']]);}
        $roomInfo = $table->createRoom($payload['data']);
        sendResponse(valid:true, message:'Room created successgully', data:['room' => $roomInfo]);
        break;

    case "DELETE":
        $payload = handleContentType();
        $result = $table->delete($payload['id']);
        if (!$result) sendResponse(['message' => 'There was an error deleting the room'], 500);
        sendResponse(valid:true, message:'Room deleted successfully');
        break;
    
    case "PUT":
        $payload = handleContentType();
        $result = $table->update($payload['id'], $payload['newValues']);
        if (!$result) sendResponse(valid: false, message:'There was an error updating the room', responseCode:500);
        sendResponse(valid: true, message:'Room info updated successfully');
        break;
    default: 
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;

