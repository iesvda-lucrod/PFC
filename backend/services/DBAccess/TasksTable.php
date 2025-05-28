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

    public function deleteTask($taskInfo)  {
        try {
            $this->beginTransaction();
            $targetPosition = $taskInfo['position'];

            $this->delete($taskInfo['id']);
            $this->execPreparedQuery(
                "UPDATE tasks SET position = position - 1 WHERE position > :position",
                [':position' => $targetPosition]
            );

            $this->commit();
        } catch (Error $e) {
            $this->rollback();
            logError($e);
        }

    }

    public function reorderTask($movedTask, $targetTask) {

        try {
            $this->beginTransaction();


            if ($movedTask['section_id'] !== $targetTask['section_id']) {
                $this->execPreparedQuery("UPDATE tasks SET position = position -1 WHERE section_id = :movedSection AND position > :movedPosition",
                [
                        ':movedSection' => $movedTask['section_id'],
                        ':movedPosition' => $movedTask['position'],
                    ]
                );

                $this->execPreparedQuery("UPDATE tasks SET position = position +1 WHERE section_id = :targetSection AND position > :targetPosition",
                [
                        ':targetSection' => $targetTask['section_id'],
                        ':targetPosition' => $targetTask['position'],
                    ]
                );
            } else {
                $modifier = -1;
                $minPosition = $movedTask['position'];
                $maxPosition = $targetTask['position'];
                if ((int) $movedTask['position'] > (int) $targetTask['position']) {
                    $minPosition = $targetTask['position'];
                    $maxPosition = $movedTask['position'];
                    $modifier = 1;
                }

                /*
                echo "changing tasks between $minPosition and $maxPosition";
                echo "UPDATE tasks SET position = position + :modifier WHERE section_id = :targetSection AND position > :minPosition AND position < :maxPosition ";
                var_dump([
                        ':modifier' => $modifier,
                        ':targetSection' => $targetTask['section_id'],
                        ':minPosition' => $minPosition,
                        ':maxPosition' => $maxPosition,
                ]);*/
                $this->execPreparedQuery("UPDATE tasks SET position = position + :modifier WHERE section_id = :targetSection AND position >= :minPosition AND position <= :maxPosition ",
                    [
                        ':modifier' => $modifier,
                        ':targetSection' => $targetTask['section_id'],
                        ':minPosition' => $minPosition,
                        ':maxPosition' => $maxPosition,
                    ]
                );
            }

            $this->execPreparedQuery("UPDATE tasks SET position = :targetPosition, section_id = :targetSection WHERE id = :movedId",
                [
                    ':targetPosition' => $targetTask['position'],
                    ':targetSection' => $targetTask['section_id'],
                    ':movedId' => $movedTask['id'],
                ]
            );

            $this->execPreparedQuery("UPDATE tasks SET position = :targetPosition, section_id = :targetSection WHERE id = :movedId",
                [
                    ':targetPosition' => $targetTask['position'],
                    ':targetSection' => $targetTask['section_id'],
                    ':movedId' => $movedTask['id'],
                ]
            );

            $this->commit();
        } catch (Error $e) {
            logError($e);
            $this->rollback();
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