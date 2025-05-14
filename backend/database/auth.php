<?php

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/UsersTable.php";
require_once __DIR__."/../services/emailer/emailer.php";

handleCorsRequest();

switch($_SERVER['REQUEST_METHOD']){
    case "POST":
        $request = handleContentType();
        if (isset($request['action'])) {
            if ($request['action'] === 'register'){
                registerUser($request['user']);
            }
            if ($request['action'] === 'login') {
                loginUser($request['user']);
            }
            if ($request['action'] == 'verifyToken') {
                $decodedToken = verifyToken();
                sendResponse(valid:true, message: 'Token verified successfully', data: ['token' => $decodedToken]);
            }
            if ($request['action'] == 'sendVerificationEmail') {
                $decodedToken = verifyToken(); //User must be logged in when this is called
                sendVerificationEmail($request['user'], generateEmailCode($request['user']['email']));
                sendResponse(valid:true, message:'Email verification sent', data:['address' => $request['user']['email']]);
            }
            if ($request['action'] == 'verifyEmailCode') {
                verifyEmailCode($request['email'], $request['code']);
            }
            if ($request['action'] === 'isEmailVerified') {
                $table = new UsersTable();
                $result = $table->isUserEmailVerified($request['email']);
                sendResponse(valid:$result, message:'User email verification has been checked');
            }
            
        }
        break;
    default:
        sendResponse(valid:false, message:'Method not allowed', responseCode:400);
        break;
}


//REGISTER AND LOGIN

function registerUser($userData) {
    try {
        $table = new UsersTable();
        if (isRegistered($table, $userData)) {
            sendResponse(valid:false, message:'Could not register the user', errors:['email' => 'Email is already registered']);
        }
        $registeredUserData = $table->registerUserData($userData);
        sendVerificationEmail($registeredUserData, generateEmailCode($registeredUserData['email']));

        sendResponse(valid:true, message:'User registration succesful', data: ['user' => $registeredUserData]);
    } catch (Throwable $e) {
        logError($e);
        sendResponse(valid:false, message:'There was a problem registering the user', responseCode:500);
    }
}

function loginUser($data) {
    try {
        $table = new UsersTable();
        if (!isRegistered($table, $data)) {
            sendResponse(valid: false, message:'Could not login', errors: ['email' => 'This email is not registered']);
        }
        $userData = $table->getUnprotectedUserFromEmail($data);
        
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
    $duplicates = $table->getUserFromEmail($data['email']);
    if ($duplicates) {
        return true;
    }
    return false;
}

//EMAIL VERIFICATION
function generateEmailCode($userEmaiil) {
    $table = new UsersTable();
    $verification_code = bin2hex(random_bytes(32));
    $expires_at = date('Y-m-d H:i:s', time() + 3600);
    $table->update(['email' => $userEmaiil], ['verification_code' => $verification_code, 'verification_code_expiration' => $expires_at]);
    return $verification_code;
}

function verifyEmailCode($userEmail, $inputCode) {
    $table = new UsersTable();
    if (!isRegistered($table, ['email' => $userEmail])) {
        sendResponse(valid:false, message:'There was an error verifying the email', errors:['email' => 'Email not registered']);
    }

    $targetUserInfo = $table->getUnprotectedUserFromEmail(['email' => $userEmail]);
    $verificationCode = $targetUserInfo['verification_code'];
    $codeExpiration = $targetUserInfo['verification_code_expiration'];
    
    if (!($verificationCode && hash_equals($verificationCode, $inputCode))) {
        sendResponse(valid:false, message:'There was an error verifying the email', errors:['code' => 'Incorrect code']);
    }
    if (strtotime($codeExpiration) < time()) {
        sendResponse(valid:false, message:'There was an error verifying the email', errors:['code' => 'This code has expired']);
    }

    $table->update(['email' => $userEmail], ['verified' => 1, 'verification_code' => NULL, 'verification_code_expiration' => NULL]);
    sendResponse(valid:true, message:'Email verified successfully');
}