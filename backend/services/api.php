<?php

// Mostrar todos los errores
ini_set('display_errors', 1); // Habilita la visualización de errores
error_reporting(E_ALL); // Muestra todos los tipos de errores, advertencias y notas //TODO remove

require_once __DIR__."/JWT/JWT.php";

/**
 * Parses the data to a workable format, responds with 415 if format is not supported
 */
function handleContentType(){
    $rawData = file_get_contents('php://input');

    if ($_SERVER['CONTENT_TYPE'] == 'application/x-www-form-urlencoded') return  $rawData;
    if ($_SERVER['CONTENT_TYPE'] == 'application/json') return json_decode($rawData, true);

    sendResponse(valid:false, message:'Unsuported media type', responseCode:415);
}

function handleCorsRequest() {
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Max-Age: 86400');
    header("Access-Control-Allow-Headers: Content-type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        sendResponse([],204);
    }
}

/**
 * Echo a response with data and a code
 * @param mixed $data
 * @param mixed $status
 * @return void
 */
function sendResponse($valid, $message, $data = null, $errors = null, $responseCode = 200) {
    header('Content-Type: application/json');

    $response = [
        'valid' => $valid,
        'message'=> $message,
    ]
    + ($data ? ['data'=> $data] : [])
    + ($valid ? ['warnings' => $errors] : ['errors'=> $errors]);

    http_response_code($responseCode);
    echo json_encode($response);
    exit; //Prevent further execution
}

function logError($errorMessage, $path = __FILE__) {
    file_put_contents(__DIR__.'/error.log', date("Y-m-d H:i:s")."\tAn error ocurred in ".$path.': '.$errorMessage.PHP_EOL, FILE_APPEND);
};