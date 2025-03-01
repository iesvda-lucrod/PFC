<?php
/* EXAMPLE FILE */

class DBProductes extends DBConnection{

public function __construct()
{ 
    parent::__construct("productos");
  
}

function selectAll() {
    /*
    $this->execPreparedQuery(
        "SELECT P.*, C.nombre as categoria FROM $this->table P JOIN categorias C ON C.id = P.catid", 
        []
    );*/
    $this->execSimpleQuery("SELECT P.id, P.nombre, P.descripcion, P.referencia, P.pvp, P.img_url, C.nombre as categoria FROM $this->table P JOIN categorias C ON C.id = P.catid");
    return $this->getAllRows();
}

function selectByFilters($assocNameValues) {
    //echo "Select by filters from dbproductes with:"; var_dump($assocNameValues);
    $fields = [];
    $bindings = [];

    foreach ($assocNameValues as $fieldName => $fieldValue) {
        $expressionCheck = substr($fieldValue,0,2);

        if ($expressionCheck == '<=' || $expressionCheck == '>=') {
            $expression = $expressionCheck;
            $fieldValue = substr($fieldValue, 2);
        } else if ($expressionCheck[0] == '<' || $expressionCheck[0] == '>') {
            $expression = $expressionCheck[0];
            $fieldValue = substr($fieldValue, 2);
        } else {
            $expression = '=';
        }

        $bindings[':'.$fieldName] = $fieldValue;

        $text = '';
        if ($fieldName == 'nombre') { 
            $text .= 'P.nombre'; //Prevent ambiguity error
        } else if ($fieldName == 'minPrice' || $fieldName == 'maxPrice') {
            $text .= 'pvp'; //Assign minPrice and maxPrice to the field pvp
        } else {
            $text .= $fieldName;
        }
        $text .= $expression.' :'.$fieldName;
        $fields[] = $text;
    }
    //echo"\n\nFIELDS---->"; var_dump($fields); //echo"\n\n";
    $filters = implode(' AND ', $fields);
    //echo"\n\nFILTERS----> $filters\n\n";
    //echo"\n\nBINDINGS---->"; var_dump($bindings); //echo"\n\n";
    $this->execPreparedQuery(
        "SELECT P.id, P.nombre, P.descripcion, P.referencia, P.pvp, P.img_url, C.nombre as categoria FROM $this->table P JOIN categorias C ON C.id = P.catid WHERE ". $filters,
        $bindings,
    );
    return $this->getAllRows();
}
}
