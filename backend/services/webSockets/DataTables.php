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

/**
 * Get the user id, profile_picture and room related to a FD
 * @param mixed $fd
 * @return array|bool|float|int|string|null
 */
function getConnectionInfo($fd) {
    global $connectionInformationTable;
    $data = $connectionInformationTable->get($fd);
    if (!$data) {echo "\n---empty---";return null;}
    return $data;
};
/**
 * Get the FDs related to a room
 * @param mixed $roomId
 */
function getRoomConnections($roomId) {
    global $roomConnectionsTable;
    $data = $roomConnectionsTable->get($roomId);
    if (!$data) return [];
    return json_decode($data['connections'], true);
}

/**
 * Get the user id, profile picture and room related to the FDs in the room
 * @param mixed $roomId
 * @return array<array|bool|float|int|string|null>
 */
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

/**
 * Adds a connection to a room taking care of duplicates
 * @param mixed $fd
 * @param mixed $userData
 * @param mixed $roomId
 * @return void
 */
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

/**
 * Removes a connection from a room
 * @param mixed $fd
 */
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