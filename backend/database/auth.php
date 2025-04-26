<?php

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/UsersTable.php";
require_once __DIR__."/../services/emailer/mailjet.php";

handleCorsRequest();

switch($_SERVER['REQUEST_METHOD']){
    case "POST":
        $request = handleContentType();
        if (isset($request['action'])) {
            if ($request['action'] === 'register'){
                registerUser($request['user']);
            }
            if ($request['action'] === 'login') { unset($request['action']);
                loginUser($request['user']);
            }
            if ($request['action'] == 'verifyToken') { unset($request['action']);
                $decodedToken = verifyToken();
                sendResponse(valid:true, message: 'Token verified successfully', data: ['token' => $decodedToken]);
            }
        }
        break;
    default:
        sendResponse(valid:false, message:'Method not allowed', responseCode:400);
        break;
}

function registerUser($userData) {
    $table = new UsersTable();
    if (isRegistered($table, $userData)) {
        sendResponse(valid:false, message:'Could not register the user', errors:['email' => 'Email is already registered']);
    }
    $result = $table->registerUserData($userData);
    //TODO send confirmation email (figure out confirmation link) link to backend api page
    sendResponse(valid:true, message:'User registration succesful', data: ['user' => $result]);
}

function loginUser($data) {
    try {
        $table = new UsersTable();
        if (!isRegistered($table, $data)) {
            sendResponse(valid: false, message:'Could not login', errors: ['email' => 'This email is not registered']);
        }
        $userData = $table->getUserFromEmail($data);
        if ($data['password'] !== $userData['password']) {
            sendResponse(valid: false, message:'Could not login', errors: ['email' => 'Incorrect password']);
        }
        unset($userData['password']);
    
        $jwt = generateJWT($userData);
        sendResponse(valid:true, message:'Login successful', data: ['user' => $userData, 'JWT'=> $jwt]);
    } catch (\Throwable $th) {
        logError($th->getMessage());
        sendResponse(valid:false, message:'There was an error in the server', responseCode:500);
    }
}

//Check if the user is present in the database
function isRegistered($table, $data) {
    $duplicates = $table->getUserFromEmail($data);
    if ($duplicates) {
        return true;
    }
    return false;
}