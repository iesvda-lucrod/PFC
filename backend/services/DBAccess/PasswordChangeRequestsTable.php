<?php
require_once __DIR__."/DBConnection.php";

class PasswordChangeRequestsTable extends DBConnection {
    public function __construct()
    {
        parent::__construct("password_change_requests");
    }


    /**
     * Get the related user's password change request
     * @param mixed $userId
     * @return mixed The request or null if not found
     */
    public function getPasswordChangeRequest($userId): mixed {
        $result = $this->filteredSelect(['user_id' => $userId]);
        return isset($result[0]) ? $result[0] : null;
    }
}