<?php

use Symfony\Component\Finder\Iterator\FilenameFilterIterator;
use Symfony\Component\Validator\Constraints\Valid;

require_once __DIR__."/../services/api.php";
require_once __DIR__."/../services/DBAccess/UsersTable.php";
require_once __DIR__."/../services/emailer/emailer.php";

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
            logError($e);
            sendResponse(valid:false, message:'There was a problem updating the user', errors:['server' => 'Unexpected server error'], responseCode:500);
        }
        
        break;
    default:
        sendResponse(valid:false, message:'Method not allowed', responseCode:405);
        break;
}
exit;

function uploadProfilePicture($userInfo) {

    if (!isset($_FILES['profile_picture'])) 
        sendResponse(valid:false, message:'There was a problem updating the profile picture', errors:['image' => 'No image selected'], responseCode:400);
    
    $file = $_FILES['profile_picture'];
    $allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!in_array($file['type'], $allowedTypes)) 
        sendResponse(valid:false, message:'There was a problem updating the profile picture', errors:['image' => 'Invalid file type'], responseCode:400);

    $targetDir = __DIR__.'/../assets/images/profile_pictures/';
    $fileName = uniqid() . '-' . basename($file['name']);
    $targetPath = $targetDir . $fileName;


    if (!move_uploaded_file($file['tmp_name'], $targetPath))
        sendResponse(valid:false, message:'There was a problem updating the profile picture', errors:['server' => 'There was a problem uploading the image'], responseCode:500);

    if ($userInfo['profile_picture'] !== 'default.png') unlink($targetDir.$userInfo['profile_picture']);

    $table = new UsersTable();

    $table->update(['id' => $userInfo['id']], ['profile_picture' => $fileName]);
    sendResponse(valid:true, message:'Image uploaded successfully', data:['profile_picture' => $fileName]);
}