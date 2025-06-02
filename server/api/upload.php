<?php
include '../config.php';

// Create uploads directory if it doesn't exist
if (!file_exists('../uploads')) {
    mkdir('../uploads', 0777, true);
}

$user_id = $_POST['user_id'];
$text_content = $_POST['text_content'];
$media_path = "";

if(isset($_FILES['media_file'])) {
    $target_dir = "../uploads/";
    $file_extension = pathinfo($_FILES["media_file"]["name"], PATHINFO_EXTENSION);
    $new_filename = uniqid() . '.' . $file_extension;
    $target_file = $target_dir . $new_filename;
    
    // Check file size (max 10MB)
    if ($_FILES["media_file"]["size"] > 10000000) {
        echo json_encode(["status" => "error", "message" => "File is too large (max 10MB)"]);
        exit;
    }
    
    // Allow only certain file formats
    $allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'];
    if (!in_array(strtolower($file_extension), $allowed_types)) {
        echo json_encode(["status" => "error", "message" => "Only JPG, PNG, GIF, MP4, MOV files are allowed"]);
        exit;
    }

    if (move_uploaded_file($_FILES["media_file"]["tmp_name"], $target_file)) {
        $media_path = "uploads/" . $new_filename;
    } else {
        echo json_encode(["status" => "error", "message" => "File upload failed"]);
        exit;
    }
}

$stmt = $conn->prepare("INSERT INTO posts (user_id, text_content, media_path) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $user_id, $text_content, $media_path);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "media_path" => $media_path]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
}
?>