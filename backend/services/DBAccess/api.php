<?php
    /**
     * Parses the data to a workable format, responds with 415 if format is not supported
     */
    function handleContentType(){
        $rawData = file_get_contents('php://input');
            if ($_SERVER['CONTENT_TYPE'] == 'application/json') {
                return json_decode($rawData, true);
            }else if ($_SERVER['CONTENT_TYPE'] == 'application/x-www-form-urlencoded'){
                return  $rawData;
            } else {
                sendResponse(["message" => 'Unsuported media type'], 415);
                exit; //Terminates script execution to prevent requesting to database
            }
    }

    /**
     * Echo a response with data and a code
     * @param mixed $data
     * @param mixed $status
     * @return void
     */
    function sendResponse($data = null, $status = 200) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }

   
