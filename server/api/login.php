<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config.php';

$data = json_decode(file_get_contents("php://input"));

$user_id = $data->user_id;
$name = $data->name;

// Check if user exists
$stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ? AND name = ?");
$stmt->bind_param("ss", $user_id, $name);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "success", "user_id" => $user_id]);
} else {
    // Create new user
    $stmt = $conn->prepare("INSERT INTO users (user_id, name) VALUES (?, ?)");
    $stmt->bind_param("ss", $user_id, $name);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "user_id" => $user_id]);
    } else {
        echo json_encode(["status" => "error"]);
    }
}
?>