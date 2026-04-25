<?php
$host   = 'localhost';
$dbname = 'ronsi_smartbite';
$user   = 'ronsi_test';
$pass   = 'C.kag{bXUco%D5[5';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB connection failed']);
    exit;
}
?>
