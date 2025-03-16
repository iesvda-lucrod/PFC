<?php
require __DIR__.'/../vendor/autoload.php'; // Load Composer packages

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
