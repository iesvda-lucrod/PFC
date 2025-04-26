<?php

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/SectionsTable.php";

handleCorsRequest();

$table = new SectionsTable();

verifyToken();

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        //$table->selectAll();
        $result = $table->selectByField('room_id', $_GET['room_id']);
        sendResponse(valid: true, message:'Sections fetched successfully');
        break;

    case "POST":
        $payload = handleContentType();
        if ($table->hasDuplicates($payload['room_id'], $payload)) {sendResponse(valid:false, message:'Could not create section', errors:['name' => 'Section with same name already exists']);}
        $result = $table->createSection($payload);
        if (!$result) {sendResponse(valid: false, message: 'There was a problem creating the section', responseCode: 500);}
        $newSectionList = $table->selectByField('room_id', $payload['room_id']);
        sendResponse(valid:true, message:'Section created successfully', data:['sections' => $newSectionList]);
        break;

    case "DELETE":
        $payload = handleContentType();
        $result = $table->delete($payload['id']);
        if (!$result) sendResponse(valid:false, message:'There was a problem deleting the section', responseCode:500);
        $newRoomList = $table->selectByField('room_id', $payload['room_id']);
        sendResponse(valid:true, message:'Section deleted successfully', data:['roomList' => $newRoomList]);
        break;
    
    case "PUT":
        
        break;
    default: 
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;