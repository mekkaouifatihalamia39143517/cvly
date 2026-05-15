<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$data = json_decode(file_get_contents("php://input"), true);

$text = $data['text'] ?? '';
$target = $data['target'] ?? 'ar';

if(empty($text)){
    echo json_encode([
        "success" => false,
        "translated" => ""
    ]);
    exit;
}

$url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=$target&dt=t&q=" . urlencode($text);

$response = @file_get_contents($url);

if($response){

    $result = json_decode($response, true);

    $translated = '';

    foreach($result[0] as $part){
        $translated .= $part[0];
    }

    echo json_encode([
        "success" => true,
        "translated" => $translated
    ]);

} else {

    echo json_encode([
        "success" => false,
        "translated" => $text
    ]);
}
?>