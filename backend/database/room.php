<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit;
}
// Mostrar todos los errores
ini_set('display_errors', 1); // Habilita la visualización de errores
error_reporting(E_ALL); // Muestra todos los tipos de errores, advertencias y notas

require_once __DIR__."/../services/DBAccess/api.php";
require_once __DIR__."/../services/DBAccess/RoomsTable.php";

$table = new RoomsTable();
switch($_SERVER['REQUEST_METHOD']){
        
    case "GET":
        $result = $table->selectByField('id', $_GET['id']);
        sendResponse($result);
        break;

    case "POST":
        try {
            $payload = handleContentType();
            //insert room
            //var_dump($payload);
            //var_dump($table);
            //echo "0";
            $roomData = $table->insertRoom($payload['name']);
            echo "roomdata";
            var_dump($roomData);
            //echo "1";
            $table->linkUsers($roomData["id"], $payload['user_id']);
            //echo "2";
            
            
            break;
        } catch (Error $e) {
            sendResponse(['message' => 'There was an error in the server']);
        }
        break;

    case "DELETE":
        $payload = handleContentType();
        echo $table->delete($payload);
        break;
    
    case "PUT":
        $payload = handleContentType();
        echo $table->update($payload['id'], $payload['newValues']);
        break;
    default: 
        sendResponse(['message' => 'Method not allowed'], 405);
        break;
}
exit;

/**
 * Check if user is duplicated by its email
 * @param mixed $data
 * @return bool
 */
function hasDuplicates($data) {
    global $table;
    $result = $table->selectByField('email', $data['email']);
    if (count($result) > 0) {
        return true;
    }
    return false;
}

function generateJWT(){}