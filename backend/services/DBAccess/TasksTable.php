<?php
require_once __DIR__."/DBConnection.php";

class TasksTable extends DBConnection {
    public function __construct()
    {
        parent::__construct("tasks");
    }

    private function getLastPosition($sectionId) {
        $this->execPreparedQuery(
            "SELECT MAX(position) as lastPosition FROM tasks WHERE section_id = :section_id",
            [':section_id' => $sectionId]
        );
        $lastPosition = $this->getNextRow()['lastPosition'];
        if (!$lastPosition) return null;
        return $lastPosition;
    }

    /**
     * Record the task in the database, assigns the position dynamically
     * @param mixed $data
     */
    public function createTask($data) {
        try {
            $this->beginTransaction();

            $lastPosition = $this->getLastPosition($data['section_id']);
            $data['position'] = $lastPosition !== null ? $lastPosition+1 : 1;

            $this->insert($data);

            $this->execPreparedQuery("SELECT * FROM tasks WHERE id = LAST_INSERT_ID()");
            $result = $this->getNextRow();

            $this->commit();
            return $result;
        }
        catch (Error $e) {
            logError($e, 'Database error');
            $this->rollBack();
            throw $e;
        }
    }

    /**
     * Delete a task from the database, updates the position of related tasks
     * @param mixed $taskInfo
     * @return void
     */
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
            logError($e, 'Database error');
        }

    }

    /**
     * Get the task's parent section by its 'section_id' attribute
     * @param mixed $taskData
     */
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
            logError($e, 'Database error');
            $this->rollBack();
            throw $e;
        }
    }

    public function changeSection($movedTask, $targetSection) {
        try {
            $this->beginTransaction();

            $this->execPreparedQuery("UPDATE tasks SET position = position -1 WHERE section_id = :movedSection AND position > :movedPosition",
            [
                    ':movedSection' => $movedTask['section_id'],
                    ':movedPosition' => $movedTask['position'],
                ]
            );

            $lastSectionPosition = $this->getLastPosition($targetSection['id']);
            $this->execPreparedQuery("UPDATE tasks SET section_id = :targetSectionId, position = :lastSectionPosition WHERE id = :movedId",
                [
                    ':targetSectionId' => $targetSection['id'],
                    ':lastSectionPosition' => ($lastSectionPosition !== null ? $lastSectionPosition + 1 : 1),
                    ':movedId' => $movedTask['id'],
                ]
            );
            
            $this->commit();
        } catch (Error $e) {
            logError($e, 'Database error');
            $this->rollBack();
            throw $e;
        }
    }


    /**
     * Changes the task's position
     * @param mixed $movedTask Task to move
     * @param mixed $targetTask Task with the position $movedTask is moved to
     * @param mixed $under Whether to place the $movedTask before or after $targetTask
     * @return void
     */
    public function reorderTask($movedTask, $targetTask, $under) {

        try {
            $this->beginTransaction();


            if ($movedTask['section_id'] !== $targetTask['section_id']) {
                $modifier = 0;
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

                if ($under) {}
            } else {
                $modifier = -1;
                $minPosition = $movedTask['position'];
                $maxPosition = $targetTask['position'];
                if ((int) $movedTask['position'] > (int) $targetTask['position']) {
                    $minPosition = $targetTask['position'];
                    $maxPosition = $movedTask['position'];
                    $modifier = 1;
                }

                $this->execPreparedQuery("UPDATE tasks SET position = position + :modifier WHERE section_id = :targetSection AND position >= :minPosition AND position <= :maxPosition ",
                    [
                        ':modifier' => $modifier,
                        ':targetSection' => $targetTask['section_id'],
                        ':minPosition' => $minPosition,
                        ':maxPosition' => $maxPosition,
                    ]
                );
            }

            $position = $targetTask['position'];
            $adjacentPosition = $targetTask['position'] + $modifier;
            $this->execPreparedQuery("UPDATE tasks SET position = :targetPosition, section_id = :targetSection WHERE id = :movedId",
                [
                    ':targetPosition' => ($under ? max([$position, $adjacentPosition]) : min($position, $adjacentPosition)),
                    ':targetSection' => $targetTask['section_id'],
                    ':movedId' => $movedTask['id'],
                ]
            );

            $this->execPreparedQuery("UPDATE tasks SET position = :targetPosition, section_id = :targetSection WHERE id = :targetId",
                [
                    ':targetPosition' => (!$under ? max([$position, $adjacentPosition]) : min($position, $adjacentPosition)),
                    ':targetSection' => $targetTask['section_id'],
                    ':targetId' => $targetTask['id'],
                ]
            );

            $this->commit();
        } catch (Error $e) {
            logError($e, 'Database error');
            $this->rollback();
        }
    }
}