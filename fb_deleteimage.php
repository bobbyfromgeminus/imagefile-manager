<?php
header("Content-Type: application/json");

$imageUrl = json_decode(file_get_contents("php://input"), true);
$fileURL = explode('/',$imageUrl);
$fileName = end($fileURL);

if (file_exists($imageUrl)) {
    if (unlink($imageUrl)) {
        echo json_encode(["success" => "Fájl törölve: " . $fileName]);
    } else {
        echo json_encode(["error" => "A fájl törlése sikertelen: " . $fileName]);
    }
} else {
    echo json_encode(["error" => "Nincs ilyen fájl: " . $fileName]);
}
?>