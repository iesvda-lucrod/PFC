<?php
require_once __DIR__."/DBConnection.php";

class RoomsTable extends DBConnection {
    public function __construct()
    {
        parent::__construct("rooms");
    }

    //Complex selects

    public function hasDuplicates($payload) {
        $duplicates = $this->selectByField('id', $payload['id']);
        if (count($duplicates) > 0){
            return true;
        }
        return false;
    }

    public function getRoomUsers($roomId) {
        $this->execPreparedQuery(
            "SELECT users.id, users.username users.email FROM users JOIN users_rooms ON users.id = users_rooms.user_id WHERE users_rooms.room_id = :roomId",
            [':roomId' => $roomId]
        );
        $result = $this->getAllRows();
        return $result;
    }
    public function getUserRooms($userId) {
        $this->execPreparedQuery(
            "SELECT rooms.*, users_rooms.user_id FROM rooms JOIN users_rooms ON rooms.id = users_rooms.room_id WHERE users_rooms.user_id = :userId",
            [':userId' => $userId] 
        );
        $result = $this->getAllRows();
        return $result;
    }
}