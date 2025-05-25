<?php
// Shared table for data persistence
// Fast access to room connections for broadcasting
$roomConnectionsTable = new Swoole\Table(1024);
$roomConnectionsTable->column('connections', Swoole\Table::TYPE_STRING, 400);
$roomConnectionsTable->create();
// Fast accesss to connection's related room for deleting a connection
$connectionRoomTable = new Swoole\Table(1024);
$connectionRoomTable->column('room', Swoole\Table::TYPE_INT);
$connectionRoomTable->create();

/*
//periodic sweep
Swoole\Timer::tick(60000, function() use ($server, &$roomToFdsMap, $fdToRoomTable) {
    foreach ($roomToFdsMap as $room => $fds) {
        $roomToFdsMap[$room] = array_filter($fds, function($fd) use ($server, $fdToRoomTable) {
            return $server->isEstablished($fd) && $fdToRoomTable->exist($fd);
        });
    }
});
*/

function getRoomConnections($roomId) {
    global $roomConnectionsTable;
    $data = $roomConnectionsTable->get($roomId);
    if (!$data) return [];
    return json_decode($data['connections'], true);
}
function addRoomConnection($roomId, $fd) {
    global $roomConnectionsTable; global $connectionRoomTable;
    //Add to individual row
    $connectionRoomTable->set($fd, ['room' => $roomId]);
    //Add to room connections row
    $connections = getRoomConnections($roomId);
    $connections[] = $fd;
    $roomConnectionsTable->set($roomId, ['connections' => json_encode($connections)]);
    return $connections;
}
function removeConnectionFromRoom($fd) {
    global $roomConnectionsTable; global $connectionRoomTable;
    $roomId = $connectionRoomTable->get($fd, 'room');
    //Remove from room connections row
    $currentConnections = getRoomConnections($roomId);
    $newConnections = array_filter($currentConnections, function($item) use ($fd) {return $item != $fd;});
    if (count($newConnections)) {
        $roomConnectionsTable->set($roomId, ['connections' => json_encode($newConnections)]);
    } else {
        $roomConnectionsTable->del($roomId);
    }
    //Remove from individual row
    $connectionRoomTable->del($fd);
    return $newConnections;
}