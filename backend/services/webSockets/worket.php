<?php
//Swoole\Runtime::enableCoroutine();
require __DIR__."/../../vendor/autoload.php";


OpenSwoole\Coroutine::run(function () {
    // Create a WebSocket client instance, connecting to localhost at port 9502
    $client = new Swoole\Coroutine\Http\Client('127.0.0.1', 9503);
    //echo "1";
    // Upgrade HTTP connection to WebSocket
    if (!$client->upgrade('/')) {
        echo "WebSocket connection failed\n";
        return;
    }
    //echo "2";

    // Send a message to the WebSocket server (which can broadcast to browsers)
    $client->push("Hello browsers!");
    //echo "3";

    // Optionally receive a response from the server
    /**$message = $client->recv();
    if ($message) {
        echo "Received from server: " . $message->data . "\n";
    }*/
    //echo "4";

    // Close the connection
    $client->close();
});