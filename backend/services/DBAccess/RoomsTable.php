<?php
require_once __DIR__."/DBConnection.php";

class RoomsTable extends DBConnection {
    public function __construct()
    {
        parent::__construct("rooms");
    }


    //TODO method to user from rooms
}