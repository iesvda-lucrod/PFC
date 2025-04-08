<?php
require_once __DIR__."/DBConnection.php";

class RoomsTable extends DBConnection {
    public function __construct()
    {
        parent::__construct("rooms");
    }

    //Complex selects
    public function hasDuplicates($userId, $payload) {
        $this->execPreparedQueryWithTransaction(
            "SELECT * FROM rooms r JOIN users_rooms u_r ON r.id = u_r.room_id WHERE user_id = :user_id AND name = :name",
            [
                ':user_id' => $userId,
                ':name'=> $payload['room']['name']
            ]
        );
        $duplicates = $this->getAllRows();
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
    public function getUserRooms($user_id) {
        $this->execPreparedQuery(
            "SELECT rooms.*, users_rooms.user_id FROM rooms JOIN users_rooms ON rooms.id = users_rooms.room_id WHERE users_rooms.user_id = :user_id",
            [':user_id' => $user_id]
        );
        $result = $this->getAllRows();
        return $result;
    }

    //INSERT
    public function createRoom($data) { 
        $user_id = $data['user_id'];
        $roomData = $data['room'];

        $this->beginTransaction();
        try {
            $this->insert($roomData);
            $result = $this->execPreparedQuery(
                "INSERT INTO users_rooms (user_id, room_id, role) VALUES (:user_id, (SELECT LAST_INSERT_ID()), 'owner')",
                [':user_id' => $user_id]
            );
            $this->commit();
            return $result;
        }
        catch (Error $e) {
            $this->rollBack();
            return false;
        }
    }
}