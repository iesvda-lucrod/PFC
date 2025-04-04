<?php
require_once __DIR__."/DBConnection.php";

class RoomsTable extends DBConnection {
    public function __construct()
    {
        parent::__construct("rooms");
    }

    public function createSection($data) {
        echo $data;
        //$this->table = 'sections';
        //$this->insert($data);
        return;
    }
}