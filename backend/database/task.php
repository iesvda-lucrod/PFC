<?php

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/TasksTable.php";

handleCorsRequest();

$table = new TasksTable();


//verifyToken(); //TODO TURN ON JWT VERIFICATION AGAIN

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        //$table->selectAll();
        $result = $table->selectByField('section_id', $_GET['section_id']);
        sendResponse( $result);
        break;

    case "POST":
        $payload = handleContentType();
        if ($table->hasDuplicates($payload['section_id'], $payload)) {sendResponse(['valid' => false, 'error' => ['name' => 'Task with same name already exists']]);}
        $result = $table->createTask($payload);
        if (!$result) {sendResponse(['message' => 'There was a problem inserting the task'], 500);}
        sendResponse(['message' => 'Task created successfully']);
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