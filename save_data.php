<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

header('Content-Type: application/json');

include 'connect.php';

if(!isset($_SESSION['user_id'])){

    echo json_encode([
        "success" => false,
        "message" => "Not logged in"
    ]);

    exit;
}

$user_id = $_SESSION['user_id'];

$raw_data = file_get_contents("php://input");

$data = json_decode($raw_data, true);

if(!$data){

    echo json_encode([
        "success" => false,
        "message" => "No data received"
    ]);

    exit;
}

$full_name = $data['name'] ?? 'Unnamed';

$title = $data['job'] ?? 'Untitled';

$cv_email = $data['email'] ?? '';

$stmt = $conn->prepare("
INSERT INTO users_cv
(user_id, full_name, title, email, cv_data)
VALUES (?, ?, ?, ?, ?)
");

if(!$stmt){

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}

$stmt->bind_param(
    "issss",
    $user_id,
    $full_name,
    $title,
    $cv_email,
    $raw_data
);

if($stmt->execute()){

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();

$conn->close();

?>