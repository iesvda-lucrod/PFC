<?php
require_once __DIR__."/../../vendor/autoload.php";
use OpenSwoole\WebSocket\Server;
use OpenSwoole\Http\Request;
use OpenSwoole\WebSocket\Frame;
use Predis\Consumer\Push\PushResponseInterface;
use Predis\Consumer\Push\DispatcherLoopInterface;
use Predis\Consumer\PubSub;

Co::set(['hook_flags'=> OpenSwoole\Runtime::HOOK_ALL]);

// Shared table for data persistence (used for client connections)
$roomConnectionsTable = new Swoole\Table(1024);
$roomConnectionsTable->column('connections', Swoole\Table::TYPE_STRING, 400);
$roomConnectionsTable->create();

// Create the WebSocket server and define listeners
$server = new Server("0.0.0.0", 9502);

$server->on("Start", function(Server $server)
{
    echo "OpenSwoole WebSocket Server is started at http://127.0.0.1:9502\n";
    go(setupPubSub());
});

$server->on('Open', function(Server $server, OpenSwoole\Http\Request $request) {echo "New connection: {$request->fd}\n";});
$server->on('Close', function(Server $server, int $fd){echo "connection close: {$fd}\n";});
$server->on('Disconnect', function(Server $server, int $fd){echo "connection disconnect: {$fd}\n";});

$server->on('Message', function(Server $server, Frame $frame) use ($roomConnectionsTable)
{
    $data = json_decode($frame->data, true);
    $token = $data['token'];
    $isValid = decodeJWT($token);
    if (!$isValid) {$server->publish($frame->fd, ['action' => 'unauthorized']); return;};

    echo "\nreceived message: {$frame->data}\n";
    processMessage(json_decode($frame->data, true), $frame->fd);
});

$server->start();


function getRoomConnections($roomName) {
    global $roomConnectionsTable;
    $data = $roomConnectionsTable->get($roomName);
    if (!$data) return [];
    return json_decode($data, true);
}
function addRoomConnection($roomName, $fd) {
    global $roomConnectionsTable;
    $currentConnections = getRoomConnections($roomName);
    $newConnections = array_push($currentConnections, $fd);
    $roomConnectionsTable->set($roomName, ['connetions' => json_encode($newConnections)]);
    return $newConnections;
}
function removeRoomConnection($roomName, $fd) {
    global $roomConnectionsTable;
    $currentConnections = getRoomConnections($roomName);
    $newConnections = array_filter($currentConnections, function($item) use ($fd) {return $item != $fd;});
    if (count($newConnections)) {
        $roomConnectionsTable->set($roomName, ['connections' => json_encode($newConnections)]);
    } else {
        $roomConnectionsTable->del($roomName);
    }
    return $newConnections;
}

function sendToRoom($roomName, $message) {
    global $server;
    $connections = getRoomConnections($roomName);
    foreach($connections as $connection) {
        $server->push($connection, json_encode($message));
    }
}


function setupPubSub() {
    $client = new Predis\Client('tcp://127.0.0.1:6379'."?read_write_timeout=-1");
    $pubsub = $client->pubSubLoop();
    $pubsub->subscribe('main');
    echo "Starting Redis PubSub loop\n";
    foreach ($pubsub as $message) {
        if ($message->kind === 'message') {
            echo "Received from redis PubSub: {$message->payload}\n";
            processMessage(json_decode($message->payload, true));
        }
    }
}

function processMessage($data, $fd = null) {
    global $pubsub;
    global $roomConnectionsTable;
    switch ($data['action']) {
        case 'joinRoom':
            $pubsub->subscribe($data['room']);
            addRoomConnection($data['room'], $fd);
            break;
        case 'leaveRoom':
            removeRoomConnection($data['room'], $fd);
            break;
        case 'CRUDOperation':
            sendToRoom($data['room'], ['operationType' => $data['CRUD'],'targetType' => $data['targetType'], 'data' => $data['data']]);
            break;

        default:
            break;
    }
}