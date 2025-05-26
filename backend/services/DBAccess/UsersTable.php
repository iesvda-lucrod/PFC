<?php
require_once __DIR__ . '/DBConnection.php';

class UsersTable extends DBConnection{ 
    public function __construct()
    {
        parent::__construct("users", "id, email, username, profile_picture");
    }

    //Check if the user is present in the database
    public function isRegistered($data) {
        $duplicates = $this->getUserFromEmail($data['email']);
        if ($duplicates) {
            return true;
        }
        return false;
    }

    /**
     * Get the user's information from their email
     * @param mixed $userData An array that must contain an 'email' clause to extract the email from
     */
    public function getUserFromEmail($userEmail) {
        $result = $this->selectByField('email', $userEmail);
        return isset($result[0]) ? $result[0] : null;
    }
    /**
     * INCLUDES SENSITIVE DATA,
     * BE SURE TO UNSET THE FIELDS BEFORE INCLUDING THE RESULT IN A RESPONSE
     * Get the user's information from their email.
     * @param mixed $userData
     * 
     */
    public function getUnprotectedUserFromEmail($userEmail) {
        $this->fields = '*';
        $result = $this->getUserFromEmail($userEmail);
        $this->fields = 'id, email, username';
        return $result;
    }

    public function isUserEmailVerified($userEmail) {
        $result = $this->getUnprotectedUserFromEmail($userEmail);
        return $result['verified'];
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