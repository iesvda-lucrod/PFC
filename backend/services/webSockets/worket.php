<?php
//Swoole\Runtime::enableCoroutine();
require __DIR__."/../../vendor/autoload.php";

$client = null;


// Open the connection
function createConnection() {
    global $client;
    OpenSwoole\Coroutine::run(function () use (&$client){
    // Create a WebSocket client instance, connecting to localhost at port 9502
    $client = new Swoole\Coroutine\Http\Client('127.0.0.1', 9502);
    //echo "1";
    // Upgrade HTTP connection to WebSocket
    if (!$client->upgrade('/')) {
        echo "WebSocket connection failed\n";
        return;
    }
    //echo "2";



    // Optionally receive a response from the server
    /**$message = $client->recv();
    if ($message) {
        echo "Received from server: " . $message->data . "\n";
    }*/
});
}

// Send a message to the WebSocket server (which can broadcast to browsers)
function sendSomething() {
    global $client;
    echo "sending";
    if ($client) $client->push("Hello browsers!");
}

// Close the connection
function sendSomethingElse() {
    global $client;
    echo "sending";
    if ($client) $client->push("Hello browsers!  d");
}


function closeConnection() {
    global $client;
    if ($client) $client->close();
}

createConnection();