<?php
require_once __DIR__ . '/DBConnection.php';

class UsersTable extends DBConnection{ 
    public function __construct()
    {
        parent::__construct("users", 'id, email, username');
    }

    /**
     * Check if user is duplicated by its email
     * @param mixed $data
     * @return bool
     */
    public function hasDuplicates($data) {
        global $table;
        $result = $table->selectByField('email', $data['email']);
        if (count($result) > 0) {
            return true;
        }
        return false;
    }

    public function getUserCredentials($userData) {
        $this->fields = 'id, email, username, password';
        $credentials = $this->selectByField('email', $userData['email'])[0];
        $this->fields = 'id, email, username, password';
        return $credentials;
    }
}