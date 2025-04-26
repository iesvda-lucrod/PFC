<?php

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/TasksTable.php";

handleCorsRequest();

$table = new TasksTable();


verifyToken();

switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        //$table->selectAll();
        $result = $table->selectByField('section_id', $_GET['section_id']);
        sendResponse(valid:true, message:'Tasks fetched successfully', data:['tasks' => $result]);
        break;

    case "POST":
        $payload = handleContentType();
        if ($table->hasDuplicates($payload['section_id'], $payload)) {sendResponse(valid:false, message:'Could not create the task', errors:'Task with same name already exists');}
        $result = $table->createTask($payload);
        if (!$result) {sendResponse(valid: false, message:'There was a problem inserting the task', responseCode:500);}
        sendResponse(valid:true, message:'Task created successfully');
        break;

    case "DELETE":
       
        break;
    
    case "PUT":
        
        break;
    default: 
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;