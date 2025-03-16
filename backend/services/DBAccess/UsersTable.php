<?php
echo "0ut<br>";
require_once __DIR__ . '/DBConnection.php';
echo "1ut<br>";

class UsersTable extends DBConnection{ 
    public function __construct()
    {
        parent::__construct("users", 'id, email, username');
    }

    //Define here overrides to queries
}