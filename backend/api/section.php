<?php

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/SectionsTable.php";
require_once __DIR__."/../services/webSockets/publishToWebSocket.php";

handleCorsRequest();
verifyToken();

$table = new SectionsTable();

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        //$table->selectAll();
        $result = $table->selectByField('room_id', $_GET['room_id']);
        sendResponse(valid: true, message:'Sections fetched successfully', data:$result);
        break;

    case "POST":
        $payload = handleContentType();
        try {
            //if ($table->hasDuplicates($payload['room_id'], $payload)) sendResponse(valid:false, message:'Could not create section', errors:['name' => 'Section with same name already exists']);
            $result = $table->createSection($payload);
            sendToUsers($result['room_id'], 'section', 'create', $result);
            sendResponse(valid:true, message:'Section created successfully', data:$result);
        } catch (Error $e) {
            logError($e);
            sendResponse(valid: false, message: 'There was a problem creating the section', responseCode: 500);
        }
        break;

    case "DELETE":
        $payload = handleContentType();
        try {
            $targetInfo = $table->selectByField('id', $payload['id'])[0];
            $table->delete($payload['id']);
            sendToUsers($targetInfo['room_id'], 'section', 'delete', $payload);
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
            sendToUsers($payload['room_id'], 'section', 'update', $payload);
            sendResponse(valid: true, message:'Section updated successfully');
        } catch (\Throwable $th) {
            logError($e->getTraceAsString());
            sendResponse(valid:false, message:'There was a problem updating the task', responseCode:500);
        }
        break;
    default: 
        logError('Access to unauthorized method: '.$_SERVER['REEQUEST_METHOD']);
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;