<?php
session_start();
header('Content-Type: application/json');
include 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No data received"
    ]);
    exit;
}
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$passwordRaw = trim($data['password'] ?? '');

if (empty($name) || empty($email) || empty($passwordRaw)) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);
    exit;
}
$password = password_hash($passwordRaw, PASSWORD_DEFAULT);

$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();

$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email already exists"
    ]);
    exit;
}
$stmt = $conn->prepare("
INSERT INTO users (name, email, password)
VALUES (?, ?, ?)
");

$stmt->bind_param("sss", $name, $email, $password);

if ($stmt->execute()) {
    $_SESSION['user_id'] = $conn->insert_id;
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