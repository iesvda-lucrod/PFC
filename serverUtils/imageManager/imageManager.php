<?php
    /**
     * GET --> SELECT
     * POST --> INSERT
     * PUT --> UPDATE
     * DELETE --> DELETE
     */

    function parseImage(){
        $imgInfo = file_get_contents('php://input');
        return json_decode($imgInfo, true);
    }

    $IMAGE_FOLDER_URL = __DIR__ . '/../../assets/images/products/';
    //echo $IMAGE_FOLDER_URL;

    switch($_SERVER['REQUEST_METHOD']){
        case "POST":
            $imgInfo = parseImage();

            $result = file_put_contents($IMAGE_FOLDER_URL.$imgInfo['imgUrl'], base64_decode($imgInfo['imgData']));
            if ($result === false) {
                http_response_code(500);
                echo json_encode(["message" => "Failed to write the file"]);
                exit;
            }
            echo json_encode($result); //this returns the number of bytes that were written
            break;

        case "DELETE":
            $imgInfo = parseImage();
            $result = unlink($IMAGE_FOLDER_URL.$imgInfo['imgUrl']);
            if (!$result) {
                http_response_code(500);
                echo json_encode(["message" => "Failed to delete the file"]);
                exit;
            }
            echo json_encode($result); //this returns true
            break;
    }
    exit;

   
