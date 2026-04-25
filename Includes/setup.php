<?php
/**
 * setup.php – הרץ פעם אחת כדי ליצור את טבלת menu_preferences
 * Run once: https://your-server/Includes/setup.php
 */
require_once 'db.php';

$sql = "CREATE TABLE IF NOT EXISTS menu_preferences (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_name    VARCHAR(100)  NOT NULL,
    budget       DECIMAL(10,2) NOT NULL,
    events       VARCHAR(255)  DEFAULT '',
    dietary_pref VARCHAR(255)  NOT NULL,
    prep_time    VARCHAR(20)   NOT NULL,
    load_level   VARCHAR(20)   NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;";

try {
    $pdo->exec($sql);
    echo '<p style="font-family:sans-serif;color:green;font-size:1.3rem;">
            ✅ טבלת menu_preferences נוצרה בהצלחה (או כבר קיימת).
          </p>';
} catch (PDOException $e) {
    echo '<p style="color:red;">שגיאה: ' . htmlspecialchars($e->getMessage()) . '</p>';
}
?>
