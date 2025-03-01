<?php
/**
 * This file defines the connection parameters for DBConnection's PDO instance
 */
class DBParams{
    public static function getParams()
    {
        return [
            'server' => 'localhost',
            'user' => 'SyncroDML',
            'password' => 'Syncro-DML-266349',
            'database' => 'Syncro'];
    }
    
}