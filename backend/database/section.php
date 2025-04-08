<?php

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/SectionsTable.php";

handleCorsRequest();

$table = new SectionsTable();

//verifyToken(); //TODO TURN ON JWT VERIFICATION AGAIN

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        //$table->selectAll();
        $result = $table->selectByField('room_id', $_GET['room_id']);
        sendResponse( $result);
        break;

    case "POST":
        $payload = handleContentType();
        if ($table->hasDuplicates($payload['room_id'], $payload)) {sendResponse(['valid' => false, 'error' => ['name' => 'Section with same name already exists']]);}
        $result = $table->createSection($payload);
        if (!$result) {sendResponse(['message' => 'There was a problem inserting the section'], 500);}
        //sendResponse(['message' => 'Section created successfully']);
        $newRoomList = $table->selectByField('room_id', $payload['room_id']);
        sendResponse([$newRoomList]);
        break;

    case "DELETE":
        $payload = handleContentType();
        $result = $table->delete($payload['id']);
        if (!$result) sendResponse(['message' => 'There was a problem deleting the section'], 500);
        //sendResponse(['message' => 'Section deleted successfully']);
        $newRoomList = $table->selectByField('room_id', $payload['room_id']);
        sendResponse($newRoomList);
        break;
    
    case "PUT":
        
        break;
    default: 
        sendResponse(['message' => 'Method not allowed'], 405);
        break;
}
exit;