<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

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
    // Build the SQL query
    $query = "SELECT * FROM work_assign";

    // Execute the query
    $result = $mysqli->query($query);

    // Check if the query was successful
    if ($result) {
        // Fetch data from the result set
        $workAssignments = [];
        while ($row = $result->fetch_assoc()) {
            $workAssignments[] = $row;
        }

        // Send the JSON response
        echo json_encode($workAssignments);
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