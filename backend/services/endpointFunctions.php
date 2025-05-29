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

    if (    str_starts_with($_SERVER['CONTENT_TYPE'], 'application/x-www-form-urlencoded')
    || str_starts_with($_SERVER['CONTENT_TYPE'], 'multipart/form-data')) return  $_POST;

    if ($_SERVER['CONTENT_TYPE'] === 'application/json') return json_decode($rawData, true);

    sendResponse(valid:false, message:'Unsuported media type', responseCode:415);
}

function handleCorsRequest() {
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Max-Age: 86400');
    header("Access-Control-Allow-Headers: Content-type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        sendResponse(true,'Pass preflight request', responseCode:204);
    }
}

/**
 * Echo a response with data and a code
 * @param mixed $valid Whether if the operation was successful (operation can not be successfull without having any errors)
 * @param mixed $message Message to return with the request
 * @param mixed $data Optional. Relevant data to include in the response
 * @param mixed $errors Optional. Relevant data to include in the response
 * @param mixed $responseCode The response code to use (defaults to 200)
 * @return never
 */
function sendResponse($valid, $message, $data = null, $errors = null, $responseCode = 200) {

    $response = [
        'valid' => $valid,
        'message'=> $message,
    ]
    + (isset($data) ? ['data'=> $data] : [])
    + (isset($errors) ? ['errors'=> $data] : []);

    http_response_code($responseCode);
    echo json_encode($response);
    exit; //Prevent further execution
}

/**
 * Log an error to the /backend/services/error.log file
 * @param Throwable $error
 * @param mixed $customMessage
 * @return void
 */
function logError(Throwable $error, $customMessage = '') {
    $logMessage = "\tERROR in {$error->getFile()}({$error->getLine()}): {$error->getMessage()}.";
    file_put_contents(__DIR__.'/error.log', date("Y-m-d H:i:s") . $customMessage . '\t' . $logMessage . PHP_EOL, FILE_APPEND);
};