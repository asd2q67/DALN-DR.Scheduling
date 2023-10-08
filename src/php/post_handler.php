<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle CORS preflight request (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
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
    // Get JSON data from the request body
    $json_data = file_get_contents("php://input");

    // Validate and decode JSON data
    $data = json_decode($json_data, true);

    // Check if JSON data is valid
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Invalid JSON data"]);
    } else {
        // Extract data from JSON
        $name = $mysqli->real_escape_string($data['Name']);
        $r1 = $mysqli->real_escape_string($data['R1']);
        $r2 = $mysqli->real_escape_string($data['R2']);
        $r3 = $mysqli->real_escape_string($data['R3']);
        $r4 = $mysqli->real_escape_string($data['R4']);
        $r5 = $mysqli->real_escape_string($data['R5']);
        $r6 = $mysqli->real_escape_string($data['R6']);
        $r7 = $mysqli->real_escape_string($data['R7']);

        // Prepare and execute SQL query
        $query = "INSERT INTO dr_detail (Name, R1, R2, R3, R4, R5, R6, R7) 
                  VALUES ('$name', '$r1', '$r2', '$r3', '$r4', '$r5', '$r6', '$r7')";
        $result = $mysqli->query($query);

        // Check for errors
        if ($result) {
            http_response_code(201); // Created
            echo json_encode(["message" => "Data inserted successfully"]);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(["error" => "Failed to insert data"]);
        }
    }

    // Close the database connection
    $mysqli->close();
} else {
    // Handle unsupported request methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}
?>
