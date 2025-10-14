<?php
header(
    "Access-Control-Allow-Origin: *"
); // Permite que Angular (otro puerto) acceda
header(
    "Access-Control-Allow-Headers: Content-Type"
);
header(
    'Content-Type: application/json'
);

$aux = file_get_contents('php://input');

$dades = $aux? json_decode($aux, true): ['status'=>'error', 'message'=>'Les dades han arribat buides al php'];

$nom = htmlspecialchars($data['nom']?? '');
$correu = htmlspecialchars($data['correu']?? '');
$tel = htmlspecialchars($data['telefon']?? '');
$text = htmlspecialchars($data['text']?? '');

// if(!$nom || $correu || $text) {
//     echo json_encode([
//         'status' => 'error',
//         'message' => 'Falta algun camp, tots són obligatoris',
//     ]);
//     exit;
// }

$to = 'jorgeperiguell@gmail.com';
$asunto = `Missatge del formulari del porfoli de $nom`;
$body = `Emisor: $nom\nTelèfon: $tel\nCorreu: $correu\nMissatge: $text`;
$headers = "From: $correu\r\n";

// if(mail($to, $asunto, $body, $headers)){
//     echo json_encode([
//         'status' => 'ok'
//     ]);
// } else {
//     echo json_encode([
//         'status' => 'error',
//         'message' => "No s'ha pogut enviar el missatge de correu"
//     ]);
// }
echo json_encode([
    'status' => 'ok',
    'message' => "Dades enviades",
    'data' => $dades
]);
?>