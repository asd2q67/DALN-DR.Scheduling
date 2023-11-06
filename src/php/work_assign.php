<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    http_response_code(200);
    exit();
}

// Database configuration
$dbserver = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "daln_dr.scheduling";

// Create a connection to the database
$mysqli = new mysqli($dbserver, $dbuser, $dbpass, $dbname);

// Check the connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Parse incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    // Extract data from JSON
    $room = $mysqli->real_escape_string($data['room']);
    $date = $mysqli->real_escape_string($data['date']);
    $doctor_id = $mysqli->real_escape_string($data['doctor_id']);
    $apm = $mysqli->real_escape_string($data['apm']);
    $doctorNum = $mysqli->real_escape_string($data['doctorNum']);

    // Calculate session based on date and start date (1/8/2023)
    $start_date = '2023-10-30'; // Format: YYYY-MM-DD
    $session = floor((strtotime($date) - strtotime($start_date)) / (60 * 60 * 12)) + 1 + $apm;

    // Prepare the SQL query
    $query = "INSERT INTO work_assign (room, date, doctor_id, session, doctorNum) VALUES ('$room', '$date', '$doctor_id', '$session', '$doctorNum')";

    // Insert new work assignment data
    if ($mysqli->query($query)) {
        // Send success response
        echo json_encode(["message" => "Work assignment created successfully"]);
    } else {
        // Send error response
        echo json_encode(["error" => "Query failed: " . $mysqli->error]);
    }

    // Close the database connection
    $mysqli->close();
} else {
    // Handle unsupported request methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}
?>
