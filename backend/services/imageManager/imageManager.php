<?php
$token = verifyToken();

    $IMAGE_FOLDER_URL = __DIR__ . '/../../assets/images/';

    switch($_SERVER['REQUEST_METHOD']){
        case "POST":
            $img_temp_path = $_FILES['image']['tmp_path'];
            $img_name = $_FILES['image']['tmp_path'];
            move_uploaded_file($img_temp_path, $IMAGE_FOLDER_URL.$img_name);
            sendResponse(valid:true);
            break;

        case "DELETE":
            $result = unlink($IMAGE_FOLDER_URL.$imgInfo['imgUrl']);
            if (!$result) {
                http_response_code(500);
                echo json_encode(["message" => "Failed to delete the file"]);
                exit;
            }
            echo json_encode($result); //this returns true
            break;
        case "PUT":

            break;
    }
    exit;

   
