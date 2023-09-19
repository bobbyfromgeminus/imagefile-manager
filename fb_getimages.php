<?php
header("Content-Type: application/json");

include('fb_config.php');
$relativePath = ".".$path;
$absolutePath = __DIR__ . $path;

if (is_dir($relativePath)) {
    $fileList = [];

    if ($dh = opendir($relativePath)) {
        while (($file = readdir($dh)) !== false) {
            if ($file != "." && $file != "..") {
                $filePath = $relativePath . "/" . $file;
                $fileInfo = pathinfo($filePath);
                $fileExtension = isset($fileInfo['extension']) ? strtolower($fileInfo['extension']) : null;

                if (in_array($fileExtension, ["jpg", "jpeg", "png", "svg"])) {
                    $fileData = [
                        "name" => $file,
                        "url" => $relativePath.'/'.$file,
                        "abs_url" => $absolutePath.'/'.$file,
                        "extension" => $fileExtension,
                    ];

                    if (in_array($fileExtension, ["jpg", "jpeg", "png"])) {
                        $imageSize = getimagesize($filePath);
                        if ($imageSize) {
                            $fileData["width"] = $imageSize[0];
                            $fileData["height"] = $imageSize[1];
                        }
                    }

                    $fileList[] = $fileData;
                }
            }
        }
        closedir($dh);

        echo json_encode($fileList);
    } else {
        echo json_encode(["hiba" => "A mappa tartalmának listázása sikertelen."]);
    }
} else {
    echo json_encode(["hiba" => "A megadott mappa nem létezik."]);
}
?>
