<?php

include('fb_config.php');
$targetDirectory = '.' . $path;
$targetFile = $targetDirectory . basename($_FILES['file']['name']); // Fájl elérési útvonala

// Ellenőrizzük, hogy a fájl már létezik-e
if (file_exists($targetFile)) {
    $response = ['message' => 'A fájl már létezik.'];
    echo json_encode($response);
    die();
}

// Ellenőrizzük a fájl méretét
if ($_FILES['file']['size'] > 10 * 1024 * 1024) { // Például 10 MB a maximális méret
    $response = ['message' => 'A fájl túl nagy. Maximum 10 MB méretű fájlok engedélyezettek.'];
    echo json_encode($response);
    die();
}

// Fájl feltöltése
if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
    $response = ['message' => 'A fájl sikeresen feltöltve.'];
    echo json_encode($response);
} else {
    $response = ['message' => 'Hiba történt a fájl feltöltése során.'];
    echo json_encode($response);
}
?>