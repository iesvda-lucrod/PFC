<?php


require_once __DIR__.'/../services/api.php';

handleCorsRequest();

require_once __DIR__."/../services/DBAccess/RoomsTable.php";

$table = new RoomsTable();

//verifyToken(); //TODO TURN ON JWT VERIFICATION AGAIN

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        if (isset($_GET['action'])) {
            if ($_GET['action'] === 'getUserRooms') {
                unset($_GET['action']);
                $result = $table->getUserRooms($_GET['user_id']);
                sendResponse(['roomInfo' => $result]);
            }
            if ($_GET['action'] === 'getRoomUsers') {
                unset($_GET['action']);
                $result = $table->getRoomUsers($_GET['user_id']);
                sendResponse(['roomInfo' => $result]);
            }
        }

        if (isset($_GET['id'])) {
            $result = $table->selectByField('id', $_GET['id']);
            sendResponse(['roomInfo' => reset($result)]);
        }

        $result = $table->selectAll();
        sendResponse(['rooms'=> $result]);
        break;

    case "POST":
        $payload = handleContentType();
        if (hasDuplicates($payload)) {sendResponse(['valid' => false, 'error' => ['name' => 'Room with same name already exists']]);}
        $result = $table->insert($payload);
        if (!$result) {sendResponse(['message' => 'There was a problem inserting the room'], 500);}
        sendResponse(['message' => 'Room created successfully']);
        break;

    case "DELETE":
        $payload = handleContentType();
        $result = $table->delete($payload['id']);
        if (!$result) sendResponse(['message' => 'There was an error deleting the room'], 500);
        sendResponse(['message' => 'Room deleted successfully']);
        break;
    
    case "PUT":
        $payload = handleContentType();
        $result = $table->update($payload['id'], $payload['newValues']);
        if (!$result) sendResponse(['message'=> 'There was an error updating the room'], 500);
        sendResponse(['message'=> 'Room info updated successfully']);
        break;
    default: 
        sendResponse(['message' => 'Method not allowed'], 405);
        break;
}
exit;

