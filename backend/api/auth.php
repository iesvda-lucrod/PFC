<?php

require_once __DIR__."/../services/endpointFunctions.php";
require_once __DIR__."/../services/DBAccess/UsersTable.php";
require_once __DIR__."/../services/DBAccess/RoomsTable.php";
require_once __DIR__."/../services/DBAccess/InvitationsTable.php";
require_once __DIR__."/../services/DBAccess/PasswordChangeRequestsTable.php";
require_once __DIR__."/../services/emailer/emailer.php";

handleCorsRequest();

switch($_SERVER['REQUEST_METHOD']){
    case "POST":
        try {
            $request = handleContentType();
            if (isset($request['action'])) {
                if ($request['action'] === 'register')  registerUser($request['user']);
                if ($request['action'] === 'login')     loginUser($request['user']);

                if ($request['action'] === 'verifyToken') {
                    $decodedToken = verifyToken();
                    sendResponse(valid:true, message: 'Token verified successfully', data: ['token' => $decodedToken]);
                }
                if ($request['action'] === 'verifyEmailCode') verifyEmailCode($request['email'], $request['code']);
                if ($request['action'] === 'isEmailVerified') {
                    $table = new UsersTable();
                    $result = $table->isUserEmailVerified($request['email']);
                    sendResponse(valid:$result, message:'User email verification has been checked');
                }

                if ($request['action'] === 'sendVerificationEmail') {
                    $decodedToken = verifyToken();
                    sendVerificationEmail($request['user'], generateEmailVerificationCode($request['user']['email']));
                    sendResponse(valid:true, message:"Verification email sent successfully", data:['email' => $request['user']['email']]);
                }
                if ($request['action'] === 'sendInvitationEmail') {
                    $decodedToken = verifyToken();
                    inviteUserToRoom($request['senderData'], $request['receiverEmail'], $request['roomData']);
                    sendResponse(valid:true, message:"Invitation email sent successfully", data:['email' => $request['user']['email']]);
                }
                if ($request['action'] === 'acceptInvitation') {
                    try {
                        acceptInvitation($request['user_id'], $request['room_id'], $request['code']);    
                    } catch (\Throwable $th) {
                        logError($th, 'There was a problem sending the email');
                        sendResponse(valid:false, message:'There was a problem sending the email', errors:['server' => 'There was a problem sending the email, please try again later'], responseCode:500);
                    }
                }

                if ($request['action'] === 'forgotPassword') {
                    try{
                        requestPasswordChange($request);
                    } catch (\Throwable $th) {
                        logError($th, 'There was a problem sending the email');
                        sendResponse(valid:false, message:'There was a problem sending the email', errors:['server' => 'There was a problem sending the email, please try again later'], responseCode:500);
                    }
                }
                if ($request['action'] === 'verifyPasswordChangeRequest') {
                    verifyPasswordChangeRequest($request['user_id'], $request['code']);
                }
                if ($request['action'] === 'changePassword') {
                    changePassword($request['newPassword'], $request['code']);
                }

                if ($request['action'] === 'sendContactEmail') {
                    try {
                        sendContactEmail($request['name'], $request['email'], $request['subject'], $request['message']);
                        sendResponse(valid:true, message:'Email sent successfully');
                    } catch (\Throwable $th) {
                        logError($th, 'There was a problem sending the email');
                        sendResponse(valid:false, message:'There was a problem sending the email', errors:['server' => 'There was a problem sending the email, please try again later'], responseCode:500);
                    }
                }
            }
        } catch (\Throwable $th) {
            logError($th, "There was a problem with the server, please try again later");
            sendResponse(valid:false, message:"There was a problem with the server, please try again later");
        }
        break;
    default:
        logError(new Error('Access to unauthorized method: '.$_SERVER['REEQUEST_METHOD']));
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}


//REGISTER AND LOGIN

function registerUser($userData) {
    try {
        $table = new UsersTable();
        if ($table->isRegistered($userData)) {
            sendResponse(valid:false, message:'Could not register the user', errors:['email' => 'Email is already registered']);
        }
        $userData['password'] = password_hash($userData['password'], PASSWORD_BCRYPT);
        $registeredUserData = $table->registerUserData($userData);
        sendVerificationEmail($registeredUserData, generateEmailVerificationCode($registeredUserData['email']));

        sendResponse(valid:true, message:'User registration succesful', data: ['user' => $registeredUserData]);
    } catch (Throwable $e) {
        logError($e, "There was a problem with the server, please try again later");
        sendResponse(valid:false, message:"There was a problem with the server, please try again later", responseCode:500);
    }
}

function loginUser($data) {
    try {
        $table = new UsersTable();
        if (!$table->isRegistered($data)) {
            sendResponse(valid: false, message:'Could not login', errors: ['email' => 'This email is not registered']);
        }
        $storedUserData = $table->getUnprotectedUserFromEmail($data['email']);
        if (!password_verify($data['password'], $storedUserData['password'])) {
            sendResponse(valid: false, message:'Could not login', errors: ['password' => 'Incorrect password']);
        }
        unset($storedUserData['password']);
    
        $jwt = generateJWT($storedUserData);
        sendResponse(valid:true, message:'Login successful', data: ['user' => $storedUserData, 'JWT'=> $jwt]);
    } catch (Error $e) {
        logError($e, "There was a problem with the server, please try again later");
        sendResponse(valid:false, message:"There was a problem with the server, please try again later", responseCode:500);
    }
}

//EMAIL VERIFICATION
function generateEmailVerificationCode($userEmail) {
    $table = new UsersTable();
    $verification_code = bin2hex(random_bytes(32));
    $expires_at = date('Y-m-d H:i:s', time() + 3600);
    $table->update(['email' => $userEmail], ['verification_code' => $verification_code, 'verification_code_expiration' => $expires_at]);
    return $verification_code;
}

function verifyEmailCode($userEmail, $inputCode) {
    $table = new UsersTable();
    if (!$table->isRegistered(['email' => $userEmail])) sendResponse(valid:false, message:'There was an error verifying the email', errors:['email' => 'Email not registered']);

    $targetUserInfo = $table->getUnprotectedUserFromEmail($userEmail);
    $verificationCode = $targetUserInfo['verification_code'];
    $codeExpiration = $targetUserInfo['verification_code_expiration'];
    
    if (!($verificationCode && hash_equals($verificationCode, $inputCode))) sendResponse(valid:false, message:'There was an error verifying the email', errors:['code' => 'Incorrect code']);
    if (strtotime($codeExpiration) < time()) sendResponse(valid:false, message:'There was an error verifying the email', errors:['code' => 'This code has expired']);

    $table->update(['email' => $userEmail], ['verified' => 1, 'verification_code' => NULL, 'verification_code_expiration' => NULL]);
    sendResponse(valid:true, message:'Email verified successfully');
}

// ROOM INVITATION
function generateInvitation($receiverUserId, $roomId) {
    $table = new InvitationsTable();
    $verification_code = bin2hex(random_bytes(32));
    $expires_at = date('Y-m-d H:i:s', time() + 3600);
    $invitationData = [
        'user_id' => $receiverUserId,
        'room_id' => $roomId,
        'code' => $verification_code,
        'code_expiration' => $expires_at,
    ];
    $table->insert($invitationData);
    return $invitationData;
}

function inviteUserToRoom($senderDdata, $receiverEmail, $roomData) {
    $usersTable = new UsersTable();
    $receiverData = $usersTable->getUserFromEmail($receiverEmail);
    $roomsTable = new RoomsTable();
    $roomMembers = $roomsTable->getRoomMembers($roomData['id']);
    $memberIds = array_map(function($member) {return $member['id'];}, $roomMembers);

    if (in_array($receiverData['id'], $memberIds)) sendResponse(valid:false, message:'There was a problem sending the invitation', errors:['email' => 'This user is already in the room']);
    if (!$usersTable->isRegistered($receiverData)) sendResponse(valid:false, message:'There was a problem sending the invitation', errors:['email' => 'This email is not registered']);

    $table = new InvitationsTable();
    $invitation = $table->getInvitation($receiverData['id'], $roomData['id']);
    if ($invitation) $table->delete($invitation['id']);
    $invitation = generateInvitation($receiverData['id'], $roomData['id']);

    sendInvitationEmail($senderDdata, $receiverData, $roomData, $invitation['code']);
    sendResponse(valid:true, message:'Email invitation sent', data:[]);
}

function acceptInvitation($userId, $roomId, $code) {
    $table = new InvitationsTable();

    $savedInvitation = $table->getInvitation($userId, $roomId);
    if (!$savedInvitation) sendResponse(valid:false, message:'There was an error accepting the invitation', errors:['invitation' => 'The invitation does not exist']);
    if (!($code && hash_equals($code, $savedInvitation['code']))) sendResponse(valid:false, message:'There was an problem accepting the invitation', errors:['code' => 'Incorrect code']);
    if (strtotime($savedInvitation['code_expiration']) < time()) sendResponse(valid:false, message:'There was an problem accepting the invitation', errors:['code' => 'This code has expired']);

    $table->processInvitation($savedInvitation);

    sendResponse(valid:true, message:'Access granted to room');
}

//PASSWORD RESET
function requestPasswordChange($request) {
    $table = new UsersTable();
    if (!$table->isRegistered($request)) sendResponse(valid:false, message:"Could not send password reset email", errors:['email' => 'This email is not registered']);
    $userData = $table->getUserFromEmail($request['email']);

    $requestsTable = new PasswordChangeRequestsTable();
    $requestsTable->multiDelete(['user_id' => $userData['id']]);

    $changeRequest = generatePasswordChangeRequest($userData['id']);
    sendPasswordResetEmail($userData, $changeRequest['code']);
    sendResponse(valid:true, message:'Password change email sent successfully');            
}

function generatePasswordChangeRequest($userId) {
    $passwordChangeRequestsTable = new PasswordChangeRequestsTable();

    $verification_code = bin2hex(random_bytes(32));
    $expires_at = date('Y-m-d H:i:s', time() + 60*10);
    $requestData = [
        'user_id' => $userId,
        'code' => $verification_code,
        'code_expiration' => $expires_at,
    ];
    $passwordChangeRequestsTable->insert($requestData);
    return $requestData;
}

function verifyPasswordChangeRequest($userId, $code) {
    $table = new PasswordChangeRequestsTable();

    $savedRequest = $table->getPasswordChangeRequest($userId);
    if (!$savedRequest) sendResponse(valid:false, message:'There was a problem with the request', errors:['request' => 'The request does not exist']);
    if (!($code && hash_equals($code, $savedRequest['code']))) sendResponse(valid:false, message:'There was a problem with the request', errors:['code' => 'Incorrect code']);
    if (strtotime($savedRequest['code_expiration']) < time()) sendResponse(valid:false, message:'There was a problem with the request', errors:['code' => 'This code has expired']);

    sendResponse(valid:true, message:'Request processed successfully');
}

function changePassword($newPassword, $code)  {
    $requestsTable = new PasswordChangeRequestsTable();
    $savedRequest = $requestsTable->selectByField('code', $code)[0];

    if (!$savedRequest) sendResponse(valid:false, message:'There was an error changing the password', errors:['code' => 'Invalid code']);

    $usersTable = new UsersTable();
    $usersTable->update(['id' => $savedRequest['user_id']], ['password' => password_hash($newPassword, PASSWORD_BCRYPT)]);

    sendResponse(valid:true, message:'Password changes successfully');
}