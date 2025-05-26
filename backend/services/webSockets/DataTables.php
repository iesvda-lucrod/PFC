<?php
// Shared table for data persistence
// Fast access to room connections for broadcasting
$roomConnectionsTable = new Swoole\Table(1024);
$roomConnectionsTable->column('connections', Swoole\Table::TYPE_STRING, 400);
$roomConnectionsTable->create();
// Fast accesss to connection's related room for deleting a connection
$connectionInformationTable = new Swoole\Table(1024);
$connectionInformationTable->column('user', Swoole\Table::TYPE_INT);
$connectionInformationTable->column('profile_picture', Swoole\Table::TYPE_STRING, 50);
$connectionInformationTable->column('room', Swoole\Table::TYPE_INT);
$connectionInformationTable->create();


/*
//periodic sweep
Swoole\Timer::tick(20000, function() use ($server, &$roomToFdsMap, $fdToRoomTable) {
    foreach ($roomToFdsMap as $room => $fds) {
        $roomToFdsMap[$room] = array_filter($fds, function($fd) use ($server, $fdToRoomTable) {
            return $server->isEstablished($fd) && $fdToRoomTable->exist($fd);
        });
    }
});*/


function getConnectionInfo($fd) {
    global $connectionInformationTable;
    $data = $connectionInformationTable->get($fd);
    if (!$data) {echo "\n---empty---";return null;}
    return $data;
};
function getRoomConnections($roomId) {
    global $roomConnectionsTable;
    $data = $roomConnectionsTable->get($roomId);
    if (!$data) return [];
    return json_decode($data['connections'], true);
}

function getRoomConnectionsInfo($roomId) {
    $currentConnections = getRoomConnections($roomId);
    echo "\n Getting the connections: \n";var_dump($currentConnections);echo "\n";
    $data = [];
    foreach ($currentConnections as $index => $connection) {
        $data[$connection] = getConnectionInfo($connection);
        echo "-----$index -> ";var_dump($connection); echo " ->"; var_dump($data[$connection]);
    }
    return $data;
}

function addRoomConnection($fd, $userData, $roomId) {
    global $roomConnectionsTable; global $connectionInformationTable;
    //Check for duplicate users
    $currentConnections = getRoomConnectionsInfo($roomId);
    $deduplicatedConnections = array_filter($currentConnections, function($connection) use ($userData){
        return $connection['user'] !== $userData['id'];
    });
    //Add to individual row
    $connectionInformationTable->set($fd, ['user' => $userData['id'], 'profile_picture' => $userData['profile_picture'], 'room' => $roomId]);
    //Add to room connections row (only the fds)
    $fdList = array_keys($deduplicatedConnections);
    $fdList[] = $fd;
    $roomConnectionsTable->set($roomId, ['connections' => json_encode($fdList)]);
}
function removeConnectionFromRoom($fd) {
    global $roomConnectionsTable; global $connectionInformationTable;

    $roomId = $connectionInformationTable->get($fd, 'room');
    //Remove from room connections row
    $currentConnections = getRoomConnections($roomId);
    $newConnections = array_filter($currentConnections, function($item) use ($fd) {return $item != $fd;});

    if (count($newConnections)) {
        $roomConnectionsTable->set($roomId, ['connections' => json_encode(array_values($newConnections))]);
    } else {
        $roomConnectionsTable->del($roomId);
    }
    //Remove from individual row
    $connectionInformationTable->del($fd);
    return $newConnections;
}