<?php
// Database credentials
$servername = "http://localhost/jybon/db_connection.php";
$username = "Catacodes";
$password = "Catacodes";
$dbname = "food_orders";

// Create connection
$conn = new mysqli('localhost', 'Catacodes', 'password', 'food_orders');


// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>
