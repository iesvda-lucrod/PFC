<?php

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/UsersTable.php";
require_once __DIR__."/../services/emailer/mailjet.php";

handleCorsRequest();
$token = verifyToken();

$table = new UsersTable();
switch($_SERVER['REQUEST_METHOD']){
    case "GET": 
        if (!isset($_GET['email'])) sendResponse(valid:false, message:"Invalid request", responseCode:400);
        $userData = $table->getUserFromEmail($_GET);
        unset($userData['password']);
        sendResponse(valid:true, message:'User information retrieved successfully', data:$userData);
        break;
    case "DELETE":
        $payload = handleContentType();
        $result = $table->delete($payload['user']['id']);
        sendResponse(valid: true, message:'User deleted successfully');
        break;

    case "PUT":
        //TODO Email validation
        $payload = handleContentType();
        $result = $table->update(['id' => $payload['targetId']], $payload['user']);
        sendResponse(valid:true, message:'user updated successfully');
        break;
    default: 
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;



