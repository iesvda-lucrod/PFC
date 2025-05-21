<?php
require_once __DIR__ . '/DBConnection.php';

class InvitationsTable extends DBConnection{ 
    public function __construct()
    {
        parent::__construct("invitations");
    }

    public function getInvitation($userId, $roomId): mixed {
        $result = $this->filteredSelect(['user_id' => $userId, 'room_id' => $roomId]);
        return isset($result[0]) ? $result[0] : null;
    }

    public function processInvitation($invitation) {
        try {
            $this->beginTransaction();
            $this->execPreparedQuery(
                "INSERT INTO users_rooms (user_id, room_id, role) VALUES (:user_id, :room_id, :role)",
                [
                    ':user_id' => $invitation['user_id'],
                    ':room_id' => $invitation['room_id'],
                    ':role' => $invitation['role'],
                ]
            );

            $this->delete($invitation['id']);
            $this->commit();
        } catch (Error $e) {
            $this->rollback();
            throw $e;
        }
        
    }
}