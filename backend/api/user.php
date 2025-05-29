<?php

use Symfony\Component\Finder\Iterator\FilenameFilterIterator;
use Symfony\Component\Validator\Constraints\Valid;

require_once __DIR__."/../services/endpointFunctions.php";
require_once __DIR__."/../services/DBAccess/UsersTable.php";
require_once __DIR__."/../services/emailer/emailer.php";
require_once __DIR__."/../services/imageManager/imageManager.php";

handleCorsRequest();
$token = verifyToken();

$table = new UsersTable();
switch($_SERVER['REQUEST_METHOD']){
    case "GET":
        if (isset($_GET['action'])) {
            if ($_GET['action'] === 'isEmailTaken') {
                $result = $table->isRegistered($_GET);
                sendResponse(valid:true, message:'Email availability checked', data:['result' => $result]);
            }
        }

        if (!isset($_GET['email'])) sendResponse(valid:false, message:"Invalid request", responseCode:400);
        $userData = $table->getUserFromEmail($_GET['email']);
        sendResponse(valid:true, message:'User information retrieved successfully', data:$userData);
        break;
    case "POST":
        $request = handleContentType();

        if (isset($request['action'])){
            if ($_POST['action'] === 'changeProfilePicture') {
                uploadProfilePicture(json_decode($request['userInfo'], true));
            }
        }

        sendResponse(valid:false, message:'Invalid request', responseCode:405);
        break;
    case "DELETE":
        $request = handleContentType();
        $result = $table->delete($request['user']['id']);
        sendResponse(valid: true, message:'User deleted successfully');
        break;

    case "PUT":
        $request = handleContentType();
        try {
            if (isset($request['action'])) {
                if ($request['action'] === 'changePassword') {
                    $oldUserInfo = $table->getUnprotectedUserFromEmail($request['email']);

                    if (!password_verify($request['oldPassword'], $oldUserInfo['password'])) sendResponse(valid:false, message:"Could not update password", errors:['oldPassword' => 'Incorrect password']);

                    $newPassword = password_hash($request['newPassword'], PASSWORD_BCRYPT);
                    $table->update(['id' => $request['id']], ['password' => $newPassword]);
                    sendResponse(valid:true, message:'Password updated successfully');
                }
            }

            $result = $table->update(['id' => $request['id']], $request);
            sendResponse(valid:true, message:'User updated successfully');    
        } catch (PDOException $PDOexception) {
            if ($PDOexception->getCode() === '23000') sendResponse(valid:false, message:'There was a problem updating the user', errors:['email' => 'This email is already in use']);
            logError(new Error($PDOexception));
            sendResponse(valid:false, message:'There was a problem updating the user', errors:['server' => 'Unexpected server error'], responseCode:500);
        } catch (Error $e) {
            logError($e, 'There was a problem updating the user');
            sendResponse(valid:false, message:'There was a problem updating the user', errors:['server' => 'Unexpected server error'], responseCode:500);
        }
        
        break;
    default:
        logError(new Error('Access to unauthorized method: '.$_SERVER['REEQUEST_METHOD']));
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;

