<?php
echo"0conf<br>";
require __DIR__.'/../vendor/autoload.php'; // Load Composer packages
echo"1conf<br>";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
