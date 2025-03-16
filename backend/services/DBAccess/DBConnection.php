<?php

/**
 * Summary of DBConnection
 * Creates the connection to the database
 * Prepares and executes queries both simple and with prepared statements
 */
require __DIR__ . '/../../config.php';

class DBConnection {
    protected $server, $username, $password, $DB, $connection = null,
     $stmt, $table, $fields, $result, $rowNum, $colNum;

    /**
     * Initialize variables necessary to connect to a DBMS (DataBase Management System)
     * @param mixed $server
     * @param mixed $username
     * @param mixed $password
     */
    function __construct($table, $fields = '*') {
        $this->server = $_ENV['DB_SERVER'];//getenv('DB_SERVER');
        $this->username  = $_ENV['DB_USER'];//getenv('DB_USER');
        $this->password =  $_ENV['DB_PASSWORD'];//getenv('DB_PASSWORD');
        $this->DB =  $_ENV['DB_DATABASE'];//getenv('DB_DATABASE');
        $this->table = $table;
        $this->fields = $fields;
        $this->connect();
    }

    //------------------------------------------------------------//
    //Connection to Database
    //------------------------------------------------------------//
    
    /**
     * Creates the connection with the provided parameters
     * @return void
     */
    function connect(){
        try {
            $this->connection = new PDO("mysql:host=$this->server; dbname=$this->DB", $this->username, $this->password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            throw new Error("Couldn't connect to database");
        } catch (Throwable $t) {
            echo $t->getMessage();
        }
    }
    /**
     * Deletes the connection
     * @return void
     */
    function disconnect(){
        $this->connection = null;
    }
    function getConnection(){
        return $this->connection;
    }

    //------------------------------------------------------------//
    //Querying
    //------------------------------------------------------------//

    /**
     * Safe to use with simple SELECT statements WITHOUT user input see @method execPreparedQuery().
     * @param mixed $query
     * @return void
     */
    protected function execSimpleQuery ($query){ 
        $this->stmt = $this->connection->query($query);
    }
    /**
     * Executes a SQL query with binded parameters, uses transactions and rollbacks in case of error
     * @param mixed $query The query to execute
     * @param mixed $bindedParams Associative array [:values_to_replace => $variables]
     * @throws \Error
     * @return mixed true if the operations were executed succesfully
     */
    protected function execPreparedQuery($query, $bindedParams) {
        $this->connection->beginTransaction();
        try {
            //echo "<br>_-_EXECPREPAREDQUERY";
            //echo "<br>_-prepping";
            $this->stmt = $this->connection->prepare($query);
            
            //echo "<br>_-binding";
            //Bind parameters
            $success = empty($bindedParams)?
                $this->stmt->execute()
                : $this->stmt->execute($bindedParams);

            if (!$success) {
                throw new Error("ERROR ON QUERY");
            }
            //echo "<br> QUERY COMMITTED";
            $this->connection->commit();
            return $success;
        } catch (Throwable $e) {
            echo $e->getMessage();
            $this->connection->rollBack();
        }   
    }


    //------------------------------------------------------------//
    //Getting the results
    //------------------------------------------------------------//
    /**
     * Stores the $stmt results in the $result attribute one by one, best used inside a while loop
     * @return mixed The results of the $stmt attribute as an associative array or false when there's no more rows
     * @throws Error When theres no result to cycle through
     */
    protected function getNextRow() {
        if (empty($this->stmt)){
            throw new Error("Cannot fetch if no query was executed");
        }
        $this->result = $this->stmt->fetch(PDO::FETCH_ASSOC);
        return $this->result;
    }
    /**
     * Stores in $result the remaining results from a query $stmt
     * @throws \Error When there's no query to fetch results from
     * @return mixed The results as an associative array
     */
    protected function getAllRows() {
        if (empty($this->stmt)){
            throw new Error("Cannot fetchAll if no query was executed");
        }
        $this->result = $this->stmt->fetchAll(PDO::FETCH_ASSOC);
        return $this->result;
    }

    //------------------------------------------------------------//
    //CRUD OPERATIONS
    //------------------------------------------------------------//
    //SELECT

    /**
     * Selects all rows from $table
     * @return mixed
     */
    function selectAll() {
        $this->execPreparedQuery(
            "SELECT $this->fields FROM $this->table",
            []
        );
        return $this->getAllRows();
    }
    /**
     * Selects all rows from $this->table that match a specific value in a field
     * @param mixed $fieldName
     * @param mixed $fieldValue
     * @return mixed
     */
    function selectByField($fieldName, $fieldValue) {
        $this->execPreparedQuery(
            "SELECT $this->fields FROM $this->table WHERE $fieldName = :fieldValue",
            [
                ':fieldValue' => $fieldValue,
            ]
        );
        return $this->getAllRows();
    }

    /**
     * Selects all rows from $this->table that match the field => value pairs from the associative array $assocNameValues
     * comparison defaults to equal values but other operators (<, <=, >, >=) can be specified in the value (Ex: '>=2')
     *  @param mixed $assocNameValues
     *  @return mixed
     */
    function selectByFilters($assocNameValues) {
        $fields = [];
        foreach ($assocNameValues as $fieldName => $fieldValue) {
            $expressionCheck = substr($fieldValue,0,2);
            if ($expressionCheck == '<=' || $expressionCheck == '>=') {
                $expression = $expressionCheck;
            } else if ($expressionCheck[0] == '<' || $expressionCheck[0] == '>') {
                $expression = $expressionCheck[0];
            } else {
                $expression = '=';
            }
            $fields[] = $fieldName.$expression.' :'.$fieldName;
        }
        $filters = implode(' AND ', $fields);

        $bindings = [];
        foreach($assocNameValues as $field => $value) {
            $bindings[':'.$field] = $value;
        };

        $this->execPreparedQuery(
            "SELECT $this->fields FROM $this->table WHERE ". $filters,
            $bindings,
        );
        return $this->getAllRows();
    }

    //INSERT
    /**
     * Inserts into $table the values defined as [field => value, ...] in $valuesAssoc
     * @param mixed $valuesAssoc
     * @return mixed
     */
    function insert($valuesAssoc) {
        
        $fields = array_keys($valuesAssoc);

        $bindings = [];
        foreach($valuesAssoc as $field => $value) {
            $bindings[':'.$field] = $value;
        };
        return $this->execPreparedQuery(
            "INSERT INTO $this->table (".implode( ', ', $fields).") VALUES (:".implode(', :', $fields).")",
            $bindings,
        );
    }

    //DELETE
    /**
     * Deletes a record from $table that matches the id at $id
     * @param mixed $id
     * @return mixed
     */
    function delete($id): mixed{
        //echo "deleting ID:-->".$id."<--";
        return $this->execPreparedQuery(
            "DELETE FROM $this->table WHERE id = :id",
            [
                ":id" => $id,
            ]
        );
    }

    //UPDATE
    /**
     * Updates a record from $table that matches the id at $id with the values defined as [field => value, ...] in $valuesAssoc 
     * @param mixed $targetId
     * @param mixed $valuesAssoc
     * @return mixed
     */
    function update($targetId, $valuesAssoc){
        $bindings = [':targetId' => $targetId];
        foreach($valuesAssoc as $field => $value) {
            $bindings[':'.$field] = $value;
        };

        $formattedFields = implode(',',
            array_map( function ($key) {
                return "$key = :$key";
            },
            array_keys($valuesAssoc))
        );
        return $this->execPreparedQuery(
            "UPDATE $this->table SET $formattedFields WHERE id = :targetId",
            $bindings,
        );
    }
}
