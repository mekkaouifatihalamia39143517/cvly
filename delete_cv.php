<?php
include 'connect.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $sql = "DELETE FROM users_cv WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        header("Location: dashboard.php"); 
    } else {
        echo "Deletion error: " . $conn->error;
    }
}
?>