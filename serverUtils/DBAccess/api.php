<?php

// Mostrar todos los errores
//ini_set('display_errors', 1); // Habilita la visualización de errores
//error_reporting(E_ALL); // Muestra todos los tipos de errores, advertencias y notas

   require_once __DIR__ . '/DBConnection.php';
   require_once __DIR__ . '/UsersTable.php';

    //Select table to access
    $dbAcces = new DBConnection("");
    $table = $_GET['table'];
    switch($table)
    {
        case "users":
           $dbAcces = new UsersTable();
           break;
    }

    /**
     * Parses the data to a workable format, responds with 415 if format is not supported
     */
    function handleContentType(){
        $rawData = file_get_contents('php://input');
            if ($_SERVER['CONTENT_TYPE'] == 'application/json') {
                return json_decode($rawData, true);
            }else if ($_SERVER['CONTENT_TYPE'] == 'application/x-www-form-urlencoded'){
                return  $rawData;
            } else {
                http_response_code(415); //This makes the Model's response.ok evaluate to false
                echo json_encode(["message" => 'Unsuported media type']);
                exit; //Terminates script execution to prevent requesting to database
            }
    }

    //var_dump( $_SERVER['REQUEST_METHOD']);
    switch($_SERVER['REQUEST_METHOD']){
        
        case "GET":
            $fieldName = !empty($_GET['fieldName']) ? $_GET['fieldName'] : null;
            $fieldValue = !empty($_GET['fieldValue']) ? $_GET['fieldValue'] : null;
            //echo $fieldName;
            if (is_array($fieldName) && is_array($fieldValue)) {
                $data = $dbAcces->selectByFilters(array_combine($fieldName, $fieldValue));
            } else if ($fieldName !== null && $fieldValue !== null) {
                $data = $dbAcces->selectByField($fieldName, $fieldValue);
            } else {
                $data = $dbAcces->selectAll();
            }

            header('Content-Type: application/json');
            echo json_encode($data);
            break;

        case "POST":
            $data = handleContentType();
            echo $dbAcces->insert($data);
            break;

        case "DELETE":
            $data = handleContentType();
            echo $dbAcces->delete($data);
            break;
        
        case "PUT":
            $data = handleContentType();
            echo $dbAcces->update($data['id'], $data['newValues']);
            break;
        default: 
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
    exit;

   
