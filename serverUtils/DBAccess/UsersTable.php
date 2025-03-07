<?php

class UsersTable extends DBConnection{ 
    public function __construct()
    { 
        parent::__construct("users");
    }

    //Define here overrides to queries

    //User password must never be sent server to client
    
}