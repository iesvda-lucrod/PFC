<?php

class UsersTable extends DBConnection{ 
    public function __construct()
    { 
        parent::__construct("users", 'id, email, username');
    }

    //Define here overrides to queries
}