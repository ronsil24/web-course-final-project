<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// קריאת נתונים
$user_name    = trim($_POST['user_name']    ?? '');
$budget       = floatval($_POST['budget']   ?? 0);
$prep_time    = trim($_POST['prep_time']    ?? '');
$load_level   = trim($_POST['load_level']   ?? '');
$events       = implode(',', (array)($_POST['events']       ?? []));
$dietary_pref = implode(',', (array)($_POST['dietary_pref'] ?? []));

// ולידציות בצד שרת
if (mb_strlen($user_name) < 2) {
    echo json_encode(['success' => false, 'error' => 'שם חייב להכיל לפחות 2 תווים']);
    exit;
}

if ($budget < 50 || $budget > 5000) {
    echo json_encode(['success' => false, 'error' => 'תקציב לא תקין']);
    exit;
}

if (empty($dietary_pref)) {
    echo json_encode(['success' => false, 'error' => 'יש לבחור לפחות העדפה תזונתית אחת']);
    exit;
}

if (empty($prep_time) || empty($load_level)) {
    echo json_encode(['success' => false, 'error' => 'נא למלא את כל השדות']);
    exit;
}

// שמירה ל-DB
try {
    $stmt = $pdo->prepare(
        "INSERT INTO menu_preferences
            (user_name, budget, events, dietary_pref, prep_time, load_level)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([$user_name, $budget, $events, $dietary_pref, $prep_time, $load_level]);

    echo json_encode([
        'success'    => true,
        'id'         => $pdo->lastInsertId(),
        'load_level' => $load_level,
        'user_name'  => $user_name
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'שגיאת שמירה: ' . $e->getMessage()]);
}
?>
