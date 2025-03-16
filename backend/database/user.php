<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit;
}
require_once __DIR__."/../services/DBAccess/api.php";
require_once __DIR__."/../services/DBAccess/UsersTable.php";
require_once __DIR__."/../services/emailer/mailjet.php";

// Mostrar todos los errores
ini_set('display_errors', 1); // Habilita la visualización de errores
error_reporting(E_ALL); // Muestra todos los tipos de errores, advertencias y notas




$table = new UsersTable();
switch($_SERVER['REQUEST_METHOD']){
        
    case "GET":
        
        $data = $table->selectAll();
        header('Content-Type: application/json');
        echo json_encode($data);
        break;

    case "POST": //Registering a user
        try {
            $data = handleContentType();
            if ($data['action'] === 'register') { unset($data['action']);
                if (hasDuplicates($data)) {
                    sendResponse(['valid'=> false, 'errors' => ['Email is already registered']]);
                }
                $result = $table->insert($data); //1 if correct or throws Error
                //TODO send confirmation email (figure out confirmation link)
                //sendEmail();
                sendResponse(['valid'=> true]);
            }

            if ($data['action'] === 'login'){ unset($data['action']);
                if (!hasDuplicates($data)) {
                    sendResponse(['valid'=> false, 'errors' => ['email' => 'Email not registered']]);
                }
                $usr = $table->selectByField('email', $data['email']);
                if ($data['password'] !== $table->getUserCredentials($data)['password']) {
                    sendResponse(['valid'=> false, 'errors' => ['password' => 'Incorrect password']]);
                }
                //TODO generate JWT
                sendResponse(['valid'=> true]);
                break;
            }

            
        } catch (Error $e) {
            sendResponse(['message' => 'There was an error in the server']);
        }
        break;

    case "DELETE":
        $data = handleContentType();
        echo $table->delete($data);
        break;
    
    case "PUT":
        $data = handleContentType();
        echo $table->update($data['id'], $data['newValues']);
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