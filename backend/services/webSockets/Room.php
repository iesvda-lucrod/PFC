<?php
require_once __DIR__."/../../vendor/autoload.php";
use OpenSwoole\WebSocket\Server;
use OpenSwoole\Http\Request;
use OpenSwoole\WebSocket\Frame;
use Predis\Consumer\Push\PushResponseInterface;
use Predis\Consumer\Push\DispatcherLoopInterface;
Co::set(['hook_flags'=> OpenSwoole\Runtime::HOOK_ALL]);


// ✅ Shared table for storing active clients
$clientsTable = new Swoole\Table(1024);
$clientsTable->column('fd', Swoole\Table::TYPE_INT);
$clientsTable->column('respond', Swoole\Table::TYPE_INT, 1);
$clientsTable->column('room', Swoole\Table::TYPE_SSTR);
$clientsTable->create();



$server = new Server("0.0.0.0", 9503);

$server->on("Start", function(Server $server)
{
    echo "OpenSwoole WebSocket Server is started at http://127.0.0.1:9502\n";
/*
    // Make sure that RESP3 protocol enabled and read_write_timeout set 0,
    // so connection won't be killed by timeout.
    $client = new Predis\Client(['read_write_timeout' => 0, 'protocol' => 3]);

    // Create push notifications consumer.
    // Provides callback where current consumer subscribes to few channels before
    // enter the loop.
    $push = $client->push(static function ( $client) {
        $response = $client->subscribe('channel', 'control');
        $status = ($response[2] === 1) ? 'OK' : 'FAILED';
        echo "Channel subscription status: {$status}\n";
    });
*/
});

$server->on('Open', function(Server $server, OpenSwoole\Http\Request $request) use ($clientsTable) 
{
    $fd = $request->fd;
    echo "Connection open: {$fd}\n";
    $clientsTable->set((string)$fd, ['fd' => $fd]);

    echo "Current clients: ";
    foreach ($clientsTable as $row) {
        echo $row['fd'] . " ";
    }
    echo "\n";
});

$server->on('Message', function(Server $server, Frame $frame) use ($clientsTable)
{
    echo "\nreceived message: {$frame->data}\n";

   foreach ($clientsTable as $row) {
        $clientFD = $row['fd'];
        if ($server->isEstablished($clientFD)) {
            $server->push($clientFD, json_encode([
                'msg' => $frame->data,
                'from' => $frame->fd,
                'time' => time()
            ]));
        }
    }
    
});

$server->on('Close', function(Server $server, int $fd)use ($clientsTable)
{
    $clientsTable->del((string)$fd);
    echo "connection close: {$fd}\n";
});

$server->on('Disconnect', function(Server $server, int $fd)
{
    echo "connection disconnect: {$fd}\n";
});

$server->start();