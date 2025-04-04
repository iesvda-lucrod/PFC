<?php


//TODO trycatch with response 400 for badly formatted requests (e.g missing fields)
//TODO trycatch with response 500 for server errors (e.g. connection issues)

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/UsersTable.php";
require_once __DIR__."/../services/emailer/mailjet.php";

handleCorsRequest();

$table = new UsersTable();
switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        //verifyToken(); //TODO Turn on jwt verification
        $payload = $table->selectAll();
        header('Content-Type: application/json');
        echo json_encode($payload);
        break;

    case "POST": //Registering a user
        try {
            
            $payload = handleContentType();

            if ($payload['action'] === 'register') { 
                unset($payload['action']);
                if (hasDuplicates($payload)) {
                    sendResponse(['valid'=> false, 'errors' => ['Email is already registered']]);
                }
                $result = $table->insert($payload); //1 if correct or throws Error
                //TODO send confirmation email (figure out confirmation link) link to backend api page
                //sendEmail();
                sendResponse(['valid'=> true]);
            }

            if ($payload['action'] === 'login'){ unset($payload['action']);
                if (!hasDuplicates($payload)) {
                    sendResponse(['valid'=> false, 'errors' => ['email' => 'Email not registered']], 400);
                }
                $userData = $table->getUserCredentials($payload);
                if ($payload['password'] !== $userData['password']) {
                    sendResponse(['valid'=> false, 'errors' => ['password' => 'Incorrect password']], 400);
                }
                unset($userData['password']);
                $userJWT = generateJWT($userData);
                sendResponse(['valid'=> true, 'userInfo' => ['id'=> $userData['id'],'username'=> $userData['username'], 'JWT' => $userJWT]]);
                break;
            }
            sendResponse(['message' => 'Action not supported', 400]);
            
        } catch (Error $e) {
            sendResponse(['message' => 'There was an error in the server'], 400);
        }
        break;

    case "DELETE":
        //verifyToken(); //TODO
        $payload = handleContentType();
        $result = $table->delete($payload['id']);
        if (!$result) sendResponse(['message' => 'There was an error deleting the user'], 500);
        sendResponse(['message' => 'User deleted successfully']);
        break;
    
    case "PUT":
        //verifyToken(); //TODO
        //TODO Email validation
        $payload = handleContentType();
        $result = $table->update($payload['id'], $payload['newValues']);
        if (!$result) sendResponse(['message' => 'There was an error updating the user'], 500);
        sendResponse(['message' => 'User updated successfully']);
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