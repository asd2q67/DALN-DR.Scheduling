<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
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

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Prepare the SQL query to fetch data from room_detail table
    $query = "SELECT id, name, `load`, priority FROM room_detail";


    // Execute the query
    $result = $mysqli->query($query);

    // Check for errors
    if (!$result) {
        die("Query failed: " . $mysqli->error);
    }

    // Fetch the results as an associative array
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Output the data as JSON
    header('Content-Type: application/json');
    echo json_encode($data);

    // Close the database connection
    $mysqli->close();
} else {
    // Handle unsupported request methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}
?>