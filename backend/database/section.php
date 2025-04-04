<?php

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/RoomsTable.php";

handleCorsRequest();

$table = new RoomsTable();

//verifyToken(); //TODO TURN ON JWT VERIFICATION AGAIN

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        
        break;

    case "POST":
        $payload = handleContentType();
        
        echo $payload;
        break;

    case "DELETE":
       
        break;
    
    case "PUT":
        
        break;
    default: 
        sendResponse(['message' => 'Method not allowed'], 405);
        break;
}
exit;