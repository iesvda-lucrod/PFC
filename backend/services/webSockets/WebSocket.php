<?php

require_once __DIR__."/../../vendor/autoload.php";
require_once __DIR__."/DataTables.php";
require_once __DIR__."/../JWT/JWT.php";

use OpenSwoole\WebSocket\Server;
use OpenSwoole\WebSocket\Frame;

Co::set(['hook_flags'=> OpenSwoole\Runtime::HOOK_ALL]);

// Create the WebSocket server and define listeners
$server = new Server("0.0.0.0", 9502);
$server->set([
    'heartbeat_check_interval' => 60*5,   // Check every 30 seconds
    'heartbeat_idle_time' => 60*20,       // Disconnect if idle for 60 seconds
]);

$client = new Predis\Client('tcp://127.0.0.1:6379'."?read_write_timeout=-1");
$pubsub = $client->pubSubLoop();

$server->on("Start", function(Server $server) use ($pubsub)
{
    echo "OpenSwoole WebSocket Server is started at http://127.0.0.1:9502\n";

    go(function () use ($pubsub) {
        $pubsub->subscribe('Syncro');
        echo "Starting Redis PubSub loop\n";
        foreach ($pubsub as $message) {
            if ($message->kind === 'message') {
                echo "Received from redis PubSub: {$message->payload}\n";
                processMessage(json_decode($message->payload, true));
            }
        }
    });
});

$server->on('Open', function(Server $server, OpenSwoole\Http\Request $request) {
    echo "New connection: {$request->fd}\n";
    $server->push( $request->fd, json_encode(['targetType' => 'connection', 'operationType' => 'ping']));
});
$server->on('Close', function(Server $server, int $fd){
    echo "Closed connection: {$fd}\n";

    $data = getConnectionInfo($fd);
    
    processMessage(['action' => 'leaveRoom', 'room' => $data['room'], 'user' => $data['user']], $fd);
});
    

$server->on('Disconnect', function(Server $server, int $fd){echo "connection disconnect: {$fd}\n";});

$server->on('Message', function(Server $server, Frame $frame)
{
    $data = json_decode($frame->data, true);

    $token = $data['token'];
    $isValid = decodeJWT($token);
    if (!$isValid) {$server->publish($frame->fd, ['action' => 'unauthorized']); return;};

    
    
    echo "received message from: {$frame->fd} action {$data['action']}\n";
    processMessage(json_decode($frame->data, true), $frame->fd);
});

$server->start();

function setupPubSub() {
    
}

function sendToRoom($roomName, $message) {
    global $server;
    echo "sending message to room $roomName \n";
    $connections = getRoomConnections($roomName);
    foreach($connections as $connection) {
        if ($server->isEstablished($connection)) $server->push($connection, json_encode($message));
        else {$server->disconnect($connection);}
    }
}

function processMessage($messageData, $fd = null) {
    echo "\n---------------------------------------\n";
    echo "Processing: {$messageData['action']}\n";
    switch ($messageData['action']) {
        case 'joinRoom':
            echo "\n\n-->connection $fd with id joining room {$messageData['room']}\n";
            addRoomConnection($fd, $messageData['data']['user'], (int) $messageData['data']['room']);
            
            $data = array_values(getRoomConnectionsInfo($messageData['room']));
            echo "\n-->sending back: "; var_dump($data);
            sendToRoom($messageData['room'], ['targetType' => 'connection', 'operationType' => 'updateActiveUsers', 'data' => $data]);
            break;
        case 'leaveRoom':
            echo "-->Removing connection $fd from tables\n";
            removeConnectionFromRoom($fd);

            $data = array_values(getRoomConnectionsInfo($messageData['room']));
            echo "\n-->sending back: "; var_dump($data);
            sendToRoom($messageData['room'], ['targetType' => 'connection', 'operationType' => 'updateActiveUsers', 'data' => $data]);
            break;
        case 'broadcast':
            sendToRoom($messageData['room'], ['targetType' => $messageData['targetType'], 'operationType' => $messageData['operationType'], 'data' => $messageData['data']]);
            break;

        default:
        echo "action not recognized\n";
            break;
    }
}





