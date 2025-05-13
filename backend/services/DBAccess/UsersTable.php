<?php
require_once __DIR__ . '/DBConnection.php';

class UsersTable extends DBConnection{ 
    public function __construct()
    {
        parent::__construct("users", 'id, email, password, username');
    }

    public function getUserFromEmail($userData) {
        $result = $this->selectByField('email', $userData['email']);
        return isset($result[0]) ? $result[0] : null;
    }
    public function getFullUserFromEmail($userData) {
        $this->fields = '*';
        $result = $this->getUserFromEmail($userData);
        $this->fields = 'id, email, password, username';
        return $result;
    }


    public function getUserCredentials($userData) {
        $this->fields = 'id, email, username, password';
        $credentials = $this->selectByField('email', $userData['email'])[0];
        $this->fields = 'id, email, username, password';
        return $credentials;
    }

    public function registerUserData($userData) {
        try {
            $this->beginTransaction();
            $this->insert($userData);
            $this->execPreparedQuery('SELECT * FROM users WHERE id = LAST_INSERT_ID()');
            $result = $this->getAllRows()[0];
            unset($result['password']);
            $this->commit();
            return $result;
        } catch (PDOException $e) {
            $this->rollback();
            throw $e;
        }
    }
    
}