<?php

if($_SERVER['HTTP_HOST'] == "localhost"){
    // LOCAL
    $host = "localhost";
    $user = "root";
    $pass = "";
    $dbname = "cvly_db";
} else {
    // ONLINE
    $host = "sql300.infinityfree.com";
    $user = "if0_41860918";
    $pass = "20062701m";
    $dbname = "if0_41860918_cvly";
}

$conn = new mysqli($host, $user, $pass, $dbname);

if($conn->connect_error){
    die(json_encode(["success"=>false,"message"=>"DB error"]));
}

$conn->set_charset("utf8mb4");
?>