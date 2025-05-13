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
        sendResponse(valid: true, message:'Sections fetched successfully', data:$result);
        break;

    case "POST":
        $payload = handleContentType();
        try {
            if ($table->hasDuplicates($payload['room_id'], $payload)) sendResponse(valid:false, message:'Could not create section', errors:['name' => 'Section with same name already exists']);
            $result = $table->createSection($payload);
            sendResponse(valid:true, message:'Section created successfully', data:$result);
        } catch (Error $e) {
            sendResponse(valid: false, message: 'There was a problem creating the section', responseCode: 500);
        }
        break;

    case "DELETE":
        $payload = handleContentType();
        try {
            $table->delete($payload['id']);
            sendResponse(valid: true, message:'Task deleted successfully');
        } catch (Error $e) {
            sendResponse(valid:false, message:'There was a problem deleting the task', responseCode:500);
        }
        break;
    
    case "PUT":
        $payload = handleContentType();
        try {
            $table->update(['id' => $payload['id']], $payload);
            sendResponse(valid: true, message:'Section updated successfully');
        } catch (\Throwable $th) {
            sendResponse(valid:false, message:'There was a problem updating the task', responseCode:500);
        }
        break;
    default: 
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;