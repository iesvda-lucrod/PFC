<?php

require_once __DIR__."/../services/endpointFunctions.php";
require_once __DIR__."/../services/DBAccess/SectionsTable.php";
require_once __DIR__."/../services/webSockets/publishToWebSocket.php";

handleCorsRequest();
verifyToken();

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        try {
            $table = new SectionsTable();
            $result = $table->selectByField('room_id', $_GET['room_id']);
            sendResponse(valid: true, message:'Sections fetched successfully', data:$result);
        } catch (\Throwable $th) {
            logError($e, 'There was a problem fetching the section');
            sendResponse(valid: false, message: 'There was a problem fetching the section', responseCode: 500);
        }
        //$table->selectAll();
        
        break;

    case "POST":
        $payload = handleContentType();
        try {
            $table = new SectionsTable();
            //if ($table->hasDuplicates($payload['room_id'], $payload)) sendResponse(valid:false, message:'Could not create section', errors:['name' => 'Section with same name already exists']);
            $result = $table->createSection($payload);
            sendToUsers($result['room_id'], 'section', 'create', $result);
            sendResponse(valid:true, message:'Section created successfully', data:$result);
        } catch (Error $e) {
            logError($e, 'There was a problem creating the section');
            sendResponse(valid: false, message: 'There was a problem creating the section', responseCode: 500);
        }
        break;

    case "DELETE":
        $payload = handleContentType();
        try {
            $table = new SectionsTable();
            $targetInfo = $table->selectByField('id', $payload['id'])[0];
            $table->delete($payload['id']);
            sendToUsers($targetInfo['room_id'], 'section', 'delete', $payload);
            sendResponse(valid: true, message:'Task deleted successfully');
        } catch (Error $e) {
            logError($e, 'There was a problem deleting the section');
            sendResponse(valid:false, message:'There was a problem deleting the section', responseCode:500);
        }
        break;
    
    case "PUT":
        $payload = handleContentType();
        try {
            $table = new SectionsTable();
            $table->update(['id' => $payload['id']], $payload);
            sendToUsers($payload['room_id'], 'section', 'update', $payload);
            sendResponse(valid: true, message:'Section updated successfully');
        } catch (\Throwable $th) {
            logError($th, 'There was a problem updating the section');
            sendResponse(valid:false, message:'There was a problem updating the section', responseCode:500);
        }
        break;
    default: 
        logError(new Error('Access to unauthorized method: '.$_SERVER['REEQUEST_METHOD']));
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;