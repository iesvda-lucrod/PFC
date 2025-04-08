<?php

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

            if ($payload['action'] === 'register') { unset($payload['action']);
                $data = $payload['data'];
                if ($table->hasDuplicates($data)) {
                    sendResponse(['valid'=> false, 'errors' => ['Email is already registered']]);
                }
                $result = $table->insert($data); //1 if correct or throws Error
                //TODO send confirmation email (figure out confirmation link) link to backend api page
                //sendEmail();
                sendResponse(['valid'=> true]);
            }

            if ($payload['action'] === 'login'){ unset($payload['action']);
                $data = $payload['data'];
                if (!$table->hasDuplicates($data)) {
                    sendResponse(['valid'=> false, 'errors' => ['email' => 'Email not registered']], 400);
                }
                $userData = $table->getUserCredentials($data);
                if ($data['password'] !== $userData['password']) {
                    sendResponse(['valid'=> false, 'errors' => ['password' => 'Incorrect password']], 400);
                }
                unset($userData['password']);
                $userJWT = generateJWT($userData);
                sendResponse(['valid'=> true, 'user' => ['id'=> $userData['id'],'email' => $userData['email'], 'username'=> $userData['username']], 'JWT' => $userJWT]);
                break;
            }
            sendResponse(['message' => 'Action not supported', 400]);
            
        } catch (Error $e) {
            sendResponse(['message' => 'There was an error in the server'], 500);
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



