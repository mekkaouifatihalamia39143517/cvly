<?php
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

$stmt = $conn->prepare("
SELECT * FROM users_cv
WHERE user_id = ?
ORDER BY id DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$cvs = [];
while($row = $result->fetch_assoc()){
    $cvs[] = $row;
}
echo json_encode([
    "success" => true,
    "cvs" => $cvs
]);
$stmt->close();
$conn->close();
?>