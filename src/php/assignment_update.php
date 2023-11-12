<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
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

// Handle PUT request
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Parse incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    // Extract data from JSON
    $id = $mysqli->real_escape_string($data['id']);
    $room = $mysqli->real_escape_string($data['room']);
    $date = $mysqli->real_escape_string($data['date']);
    $doctor_id = $mysqli->real_escape_string($data['doctor_id']);
    $apm = floatval($mysqli->real_escape_string($data['apm']));

    $start_date = '2023-11-6'; // Format: YYYY-MM-DD
    $session = floor((strtotime($date) - strtotime($start_date)) / (60 * 60 * 12)) + 1 + $apm;
    $date = date('Y-m-d', strtotime($date . ' + 1 day'));

    // Build the SQL query dynamically based on input data
    $query = "UPDATE work_assign SET room='$room', date='$date', doctor_id='$doctor_id', session='$session' WHERE id='$id'";

    // Update assignment data
    if ($mysqli->query($query)) {
        // Send success response
        echo json_encode(["message" => "Assignment updated successfully"]);
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
