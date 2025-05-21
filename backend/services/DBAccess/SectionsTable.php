<?php
require_once __DIR__."/DBConnection.php";

class SectionsTable extends DBConnection {
    public function __construct()
    {
        parent::__construct("sections");
    }

    public function hasDuplicates($room_id, $sectionData) {
        $this->execPreparedQueryWithTransaction(
            "SELECT * FROM sections WHERE room_id = :room_id AND name = :name",
            [
                ':room_id' => $room_id,
                ':name'=> $sectionData['name']
            ]
        );
        $duplicates = $this->getAllRows();
        if (count($duplicates) > 0){
            return true;
        }
        return false;
    }

    public function createSection($data) {
        try {
            $this->beginTransaction();
            $this->execPreparedQuery(
                "SELECT MAX(position) as lastPosition FROM sections WHERE room_id = :room_id",
                [':room_id' => $data['room_id']]
            );
            $lastPosition = $this->getNextRow()['lastPosition'];
            $data['position'] = $lastPosition !== null ? $lastPosition+1 : 1;
            $result = $this->insert($data);

            //Retrive data
            $this->execPreparedQuery('SELECT * FROM sections WHERE id = LAST_INSERT_ID()');
            $sectionData = $this->getNextRow();
            $this->commit();

            return $sectionData;

        } catch (Error $e) {
            logError($e);
            $this->rollBack();
            throw $e;
        }
    }
}