<?php
session_start();
include 'connect.php';

if(!isset($_SESSION['user_id']) || !isset($_GET['id'])){
    echo json_encode(["success" => false]);
    exit;
}

$cv_id = intval($_GET['id']);
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT cv_data FROM users_cv WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $cv_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if($row = $result->fetch_assoc()){
    echo json_encode(["success" => true, "cv_data" => $row['cv_data']]);
} else {
    echo json_encode(["success" => false]);
}
?>