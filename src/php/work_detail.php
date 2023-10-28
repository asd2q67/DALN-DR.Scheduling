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
function generateCSV($mysqli)
{
    // Query to select data from work_assign
    $query = "SELECT room, session, doctor_id FROM work_assign";

    // Execute the query
    $result = $mysqli->query($query);

    // Initialize arrays for Day-ol.csv and Day-off.csv
    $dayOlData = [];
    $dayOffData = [];

    while ($row = $result->fetch_assoc()) {
        $room = $row['room'];
        $session = $row['session'];
        $doctorId = $row['doctor_id'];

        if ($room == -1) {
            // If room is -1, it's a day off (Day-off)
            $dayOffData[] = [$session, $doctorId];
            
        } else {
            // If room is not -1, it's a working day (Day-ol)
            $dayOlData[] = [$room, $session, $doctorId];
        }
    }

    // Create Day-ol.csv
    $dayOlCsvFile = fopen('../instance-generator/Day-ol.csv', 'w');
    fputcsv($dayOlCsvFile, ['roomId', 'session', 'doctorId']);
    foreach ($dayOlData as $row) {
        fputcsv($dayOlCsvFile, $row);
    }
    fclose($dayOlCsvFile);

    // Create Day-off.csv
    $dayOffCsvFile = fopen('../instance-generator/Day-off.csv', 'w');
    fputcsv($dayOffCsvFile, ['session', 'doctorId']);
    foreach ($dayOffData as $row) {
        fputcsv($dayOffCsvFile, $row);
    }
    fclose($dayOffCsvFile);
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
        // Generate and save the CSV files
        generateCSV($mysqli);
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