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
    $name = $mysqli->real_escape_string($data['Name']);
    $workload = $mysqli->real_escape_string($data['workload']);

    // Build the SQL query dynamically based on room IDs
    $insertColumns = ['Name', 'workload'];
    $insertValues = ["'$name'", "'$workload'"];
    foreach ($data as $key => $value) {
        if (strpos($key, 'R') === 0) {
            $roomId = $mysqli->real_escape_string($value);
            $insertColumns[] = "`$key`";
            $insertValues[] = "'$roomId'";
        }
    }

    // Prepare the SQL query
    $columns = implode(", ", $insertColumns);
    $values = implode(", ", $insertValues);
    $query = "INSERT INTO dr_detail ($columns) VALUES ($values)";

    // Insert new doctor data
    if ($mysqli->query($query)) {
        // Send success response
        echo json_encode(["message" => "Doctor created successfully"]);
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
