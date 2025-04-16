<?php
require_once __DIR__."/DBConnection.php";

class TasksTable extends DBConnection {
    public function __construct()
    {
        parent::__construct("tasks");
    }

    public function hasDuplicates($section_id, $taskData) {
        $this->execPreparedQueryWithTransaction(
            "SELECT * FROM tasks WHERE section_id = :section_id AND title = :title",
            [
                ':section_id' => $section_id,
                ':title'=> $taskData['title']
            ]
        );
        $duplicates = $this->getAllRows();
        if (count($duplicates) > 0){
            return true;
        }
        return false;
    }

    public function createTask($data) {
        try {

            $this->beginTransaction();
            $this->execPreparedQuery(
                "SELECT MAX(position) as lastPosition FROM tasks WHERE section_id = :section_id",
                [':section_id' => $data['section_id']]
            );
            $lastPosition = $this->getNextRow()['lastPosition'];
            $data['position'] = $lastPosition !== null ? $lastPosition+1 : 1;
            //var_dump($data);
            $result = $this->insert($data);

            $this->commit();
            return $result;
        }
        catch (Error $e) {
            echo $e->getMessage();
            logError($e->getMessage());
            $this->rollBack();
            return false;
        }
    }
}