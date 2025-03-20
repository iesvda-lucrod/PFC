<?php
require_once __DIR__."/DBConnection.php";

class RoomsTable extends DBConnection {
    public function __construct()
    {
        parent::__construct("rooms");
    }


    public function insertRoom($roomName) {
        //echo "0.1";var_dump($roomName);
        $result = $this->insert(['name' => $roomName]);
        //echo "0.2";

        if (!$result) {
            throw new Error('Could not insert data');
        }
        $this->execSimpleQuery("SELECT LAST_INSERT_ID() AS id");
        //echo "0.3";

        return $this->getNextRow();
    }

    //TODO method to user from rooms
    public function getRoomUsers($roomId) {
        //do
    }

    public function linkUsers($roomId, $users) {
        $this->table = 'users_rooms';
        $users = [1,2];
        var_dump('ri'. $roomId .'us'. $users); //TODO Multi user is not working cause of wrong bindings

        $rows = ["room_id" => $roomId, "user_id" => $users];
        if (is_array($users)) {
            echo "iarr";
            $rows = [];

            foreach($users as $user) {
                $rows[] = ["room_id" => $roomId, "user_id" => $user];
            }
        }
        
        $this->multiInsert([$rows]); //TODO change to multi insert
        $this->table = 'rooms';
    }
}