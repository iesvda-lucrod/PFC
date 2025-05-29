<?php
/**
 * Store the uploaded profile picture into the designated folder
 * @param mixed $userInfo The user's information, needs at least an 'id' and 'profile_picture' attributes
 * @return void
 */
function uploadProfilePicture($userInfo) {

    if (!isset($_FILES['profile_picture'])) 
        sendResponse(valid:false, message:'There was a problem updating the profile picture', errors:['image' => 'No image selected'], responseCode:400);
    
    $file = $_FILES['profile_picture'];
    $allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!in_array($file['type'], $allowedTypes)) 
        sendResponse(valid:false, message:'There was a problem updating the profile picture', errors:['image' => 'Invalid file type'], responseCode:400);

    $targetDir = __DIR__.'/../../assets/images/profile_pictures/';
    $fileName = uniqid() . '-' . basename($file['name']);
    $targetPath = $targetDir . $fileName;


    if (!move_uploaded_file($file['tmp_name'], $targetPath))
        sendResponse(valid:false, message:'There was a problem updating the profile picture', errors:['server' => 'There was a problem uploading the image'], responseCode:500);

    if ($userInfo['profile_picture'] !== 'default.png') unlink($targetDir.$userInfo['profile_picture']);

    $table = new UsersTable();

    $table->update(['id' => $userInfo['id']], ['profile_picture' => $fileName]);
    sendResponse(valid:true, message:'Image uploaded successfully', data:['profile_picture' => $fileName]);
}
   
