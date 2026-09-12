<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success'=>false,'message'=>'Method not allowed.']);
    exit;
}

$email = strtolower(trim($_POST['email'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
    http_response_code(422);
    echo json_encode(['success'=>false,'message'=>'Please enter a valid email address.']);
    exit;
}

/* =========================================================
   DATABASE SETTINGS
   Replace these with your hosting database details.
   ========================================================= */
$dbHost = 'localhost';
$dbName = 'trip_raja';
$dbUser = 'YOUR_DATABASE_USERNAME';
$dbPass = 'YOUR_DATABASE_PASSWORD';

try {
    $pdo = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    $sql = "INSERT INTO launch_subscribers
              (email, submitted_at_utc, last_seen_at_utc)
            VALUES
              (:email, UTC_TIMESTAMP(), UTC_TIMESTAMP())
            ON DUPLICATE KEY UPDATE
              last_seen_at_utc = UTC_TIMESTAMP()";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':email'=>$email]);

    echo json_encode([
        'success'=>true,
        'message'=>'Thank you! We will notify you when Trip Raja launches.'
    ]);

} catch (Throwable $e) {
    error_log('Trip Raja signup: '.$e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success'=>false,
        'message'=>'We could not save your email right now. Please try again.'
    ]);
}
?>
