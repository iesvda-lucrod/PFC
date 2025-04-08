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
 * Retrieves, verifies and returns the JWT token data,
 * sends invalid response if token is not valid or present
 * @return stdClass|null
 */
function verifyToken() {
    $headers = apache_request_headers();
    if (!isset($headers['Authorization'])) {
        sendResponse(['valid' => false, 'error' => 'Token not found'], 401);
    }

    $jwt = trim(str_replace('Bearer ', '', $headers['Authorization']));
    $decodedToken = decodeJWT($jwt);
    if (!$decodedToken) {
        sendResponse(['valid' => false, 'error' => 'Invalid token'], 401);
    }

    return $decodedToken;
};

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
function sendResponse($data = null, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function logError($errorMessage, $path = __FILE__,) {
    file_put_contents(__DIR__.'/error.log', date("Y-m-d H:i:s")."\tAn error ocurred in ".$path.': '.$errorMessage.PHP_EOL, FILE_APPEND);
};