<?php
require_once __DIR__ . '/DBConnection.php';

class UsersTable extends DBConnection{ 
    public function __construct()
    {
        parent::__construct("users", 'id, email, username');
    }

    //TODO method to retrieve rooms from user

    public function getUserCredentials($userData) {
        $this->fields = 'id, email, username, password';
        $credentials = $this->selectByField('email', $userData['email'])[0];
        $this->fields = 'id, email, username, password';
        return $credentials;
    }
}