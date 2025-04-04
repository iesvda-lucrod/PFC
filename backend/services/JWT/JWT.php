<?php
require_once __DIR__ ."/../../config.php";
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
function generateJWT($userData) {
    $userPayload = $userData !== null ? ['user' => $userData] : [];
    $payload = [
        'iss' => 'Syncro',
        'iat' => time(),
        'exp' => (time()+60*60), //1h login time
    ] + $userPayload;

    $jwt = JWT::encode($payload, $_SERVER['JWT_KEY'], 'HS256');
    return $jwt;
}

function decodeJWT($jwt) {
    try {
        JWT::$leeway = 60; // $leeway in seconds
        $decodedToken = JWT::decode($jwt, new Key($_SERVER['JWT_KEY'], 'HS256'));
        return $decodedToken;
    } catch(UnexpectedValueException  $e) {
        return [];
    }    
}