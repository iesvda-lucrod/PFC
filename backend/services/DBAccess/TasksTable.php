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
            $this->insert($data);

            $this->execPreparedQuery("SELECT * FROM tasks WHERE id = LAST_INSERT_ID()");
            $result = $this->getNextRow();

            $this->commit();
            return $result;
        }
        catch (Error $e) {
            logError($e);
            $this->rollBack();
            throw $e;
        }
    }

    public function getParentSection($taskData) {
        try {
            $this->beginTransaction();
            if (!$taskData['section_id']) {
                $this->execPreparedQuery(
                    "SELECT section_id FROM tasks WHERE id = :id",
                    ['id' => $taskData['id']]);
                $taskData['section_id'] = $this->getNextRow();
            } 
            $this->execPreparedQuery(
                "SELECT * from sections WHERE id = :section_id",
                ['section_id' => $taskData['section_id']]
            );
            $section = $this->getNextRow();
            $this->commit();
            return $section;
        } catch (Error $e) {
            logError($e);
            $this->rollBack();
            throw $e;
        }
    }
}