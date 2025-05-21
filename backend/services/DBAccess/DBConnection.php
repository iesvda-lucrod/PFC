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
    public function __construct($table, $fields = '*') {
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
    public function connect(){
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
    public function disconnect(){
        $this->connection = null;
    }
    public function getConnection(){
        return $this->connection;
    }

    //------------------------------------------------------------//
    //Querying
    //------------------------------------------------------------//

    //Redefined functions for easier manual use
    protected function beginTransaction() {$this->connection->beginTransaction();}
    protected function commit() {$this->connection->commit();}
    protected function rollback() {$this->connection->rollBack();}

    /**
     * Safe to use with simple SELECT statements WITHOUT user input see @method execPreparedQuery().
     * @param mixed $query
     * @return void
     */
    protected function execSimpleQuery ($query){ 
        $this->stmt = $this->connection->query($query);
    }
    /**
     * Executes a SQL query with binded parameters, initiates a transaction to rollback in case of error
     * @param mixed $query The query to execute
     * @param mixed $bindedParams Associative array [:values_to_replace => $variables]
     * @throws \Error
     * @return mixed True if the query was successfull (Throws an error if it wasn't)
     */
    protected function execPreparedQueryWithTransaction($query, $bindedParams) {
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
            $this->commit();
            return $success;
        } catch (Throwable $e) {
            echo $e->getMessage();
            $this->rollBack();
        }   
    }

    /**
     * Executes a SQL query with binded parameters, 
     * allows multiple queries to be executed in the same transaction, 
     * but the transaction must be initiated manually 
     * @see execPreparedQueryWithTransaction
     * @param mixed $query
     * @param mixed $bindedParams
     * @throws \Error When query fails
     * @return bool True if the query was successfull (Throws an error if it wasn't)
     */
    protected function execPreparedQuery($query, $bindedParams = []) {
        //echo "<br>_-_EXECPREPAREDQUERY";
        //echo "<br>_-prepping";
        $this->stmt = $this->connection->prepare($query);
        
        //echo "<br>_-binding";
        //Bind parameters
        $success = empty($bindedParams)?
            $this->stmt->execute()
            : $this->stmt->execute($bindedParams);

        if (!$success) {
            throw new Error("ERROR ON QUERY: $query");
        }
        return $success; 
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
    public function selectAll() {
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
    public function selectByField($fieldName, $fieldValue) {
        $this->execPreparedQuery(
            "SELECT $this->fields FROM $this->table WHERE $fieldName = :fieldValue",
            [
                ':fieldValue' => $fieldValue,
            ]
        );
        return $this->getAllRows();
    }

    /**
     * Select the $this->table's rows that match the specified filters
     * @param mixed $filters Associative array containing the filters (field => value, field2 = value2, ...)
     * @param bool $strict Whether to apply all filters (AND) or any filter (OR).
     */
    public function filteredSelect($filters, $strict = true) {
        $argument = $strict ? ' AND ' : ' OR ';
        $filtersArray = [];
        $bindedParams = [];
        foreach( $filters as $key => $values ) {
            if (is_array($values)) {
                foreach($values as $index => $value) {
                    $filtersArray[] = "$key = :$key$index";
                    $bindedParams[":$key$index"] = $value;
                }
            } else {
                $filtersArray[] = "$key = :$key";
                $bindedParams[":$key"] = $values;
            }
        }

        $queryFilters = $filters ? 'WHERE '.implode(" $argument ", $filtersArray):'';

        //echo "SELECT $this->fields FROM $this->table WHERE $queryFilters \nBindings: ";var_dump($bindedParams);
        $this->execPreparedQuery(
            "SELECT $this->fields FROM $this->table $queryFilters",
            $bindedParams
        );
        return $this->getAllRows();
    }

    //INSERT
    /**
     * Inserts into $table the values defined as [field => value, ...] in $valuesAssoc
     * @param mixed $valuesAssoc
     * @return mixed
     */
    public function insert($valuesAssoc) {
        $fields = array_keys($valuesAssoc);

        $bindings = [];
        foreach($valuesAssoc as $field => $value) {
            $bindings[":$field"] = $value;
        };
        return $this->execPreparedQuery(
            "INSERT INTO $this->table (".implode( ', ', $fields).") VALUES (:".implode(', :', $fields).")",
            $bindings,
        );
    }
    
    /**
     * Inserts several rows at a time into $this->table
     * @param mixed $data An array containing the arrays of values, all value arrays must have the same format
     */
    public function multiInsert($data) {
        //echo "\n\nMULTI INSERT DATA:\n"; var_dump($data);
        $fields = implode(', ', array_keys($data[0]));
        $valueHolders = "";
        $subArrays = [];
        $bindings = [];
    
        for ($i = 0; $i < count($data); $i++) {
            $current = $data[$i];
            $subArrays[] = implode("$i, :", array_keys($current)).$i;
    
            for ($j = 0; $j < count($current); $j++) {
                $bindings[':'.array_keys($current)[$j].$i] = array_values($current)[$j];
            }
        }
        $valueHolders = "(:".implode('),(:', $subArrays).")";

        //echo "\n\nQuery:\n";echo "INSERT INTO $this->table ($fields) VALUES $valueHolders";
        //print_r($bindings);

        return $this->execPreparedQuery(
            "INSERT INTO $this->table ($fields) VALUES $valueHolders",
            $bindings
        );
    }

    //DELETE
    /**
     * Deletes a record from $table that matches the id at $id
     * @param mixed $id
     * @return mixed
     */
    public function delete($id): mixed{
        //echo "deleting ID:-->".$id."<--";
        return $this->execPreparedQuery(
            "DELETE FROM $this->table WHERE id = :id",
            [
                ":id" => $id,
            ]
        );
    }
    /**
     * Deletes all records that MATCH ALL of the filters provided
     * @param mixed $data Array with the conditions to delete [field => value]
     */
    public function multiDelete($data) {
        $conditionsArray = [];
        $bindings = [];
        foreach($data as $key => $value) {
            $conditionsArray[] = "$key = :$key";
            $bindings[":$key"] = $value;
        }
        $conditions = implode(' AND ', $conditionsArray);

        return $this->execPreparedQuery(
            "DELETE FROM $this->table WHERE $conditions",
            $bindings
        );
    }

     //----------//----------//
    //UPDATE
    //----------//----------//
    public function update($identifier, $data) {
        $fieldsArray = [];
        $bindings = [];
        foreach($data as $key => $value) {
            $fieldsArray[] = "$key = :$key";
            $bindings[":$key"] = $value;
        }
        $fields = implode(', ', $fieldsArray);

        $idenfifierField = array_keys($identifier)[0];
        $bindings[":$idenfifierField"] = $identifier[$idenfifierField];

        return $this->execPreparedQuery(
            "UPDATE $this->table SET $fields WHERE $idenfifierField=:$idenfifierField",
            $bindings
        );
    }

    public function multiUpdate($targets, $data, $strict = true) {
        $argument = $strict ? ' AND ' : ' OR ';
        $conditionsArray = [];
        $fieldsArray = [];
        $bindings = [];

        foreach($data as $key => $value) {
            $fieldsArray[] = "$key = :$key";
            $bindings[":$key"] = $value;
        }
        $fields = implode(', ', $fieldsArray);

        
        foreach($targets as $key => $value) {
            $keyname = isset($bindings[":CONDITION_$key"]) ? ":_CONDITION_$key" : ":CONDITION_$key";
            $bindings[$keyname] = $value ;
            $conditionsArray[] = "$key = $keyname";
        }
        $conditions = implode($argument, $conditionsArray);

        return $this->execPreparedQuery(
            "UPDATE $this->table SET $fields WHERE $conditions",
            $bindings
        );
    }
}