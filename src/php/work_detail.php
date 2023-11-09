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
    $query1 = "SELECT dd.id AS doctor_id, COALESCE(wa.room, -1) AS room, COALESCE(wa.session, -1) AS session
    FROM dr_detail dd
    LEFT JOIN work_assign wa ON dd.id = wa.doctor_id
    ORDER BY dd.id";

    // Execute the query
    $result = $mysqli->query($query1);

    // Initialize arrays for Day-ol.csv and Day-off.csv
    $dayOlData = [];
    while ($row = $result->fetch_assoc()) {
        $doctorId = $row['doctor_id'] -1;
        if($row['room'] > 0) $room = $row['room']-1;
        else $room = $row['room'];
        if($row['session'] > 0)  $session = $row['session']-1;
        else $session = $row['session'];
        $dayOlData[] = [$doctorId, $room, $session];
    }

    // Query to select data from work_assign where room = -1
    $query2 = "SELECT dd.id AS doctor_id, COALESCE(wa.session, -1) AS session
    FROM dr_detail dd
    LEFT JOIN work_assign wa ON dd.id = wa.doctor_id
    ORDER BY dd.id";

    $result = $mysqli->query($query2);
    $dayOffData = [];
    while ($row = $result->fetch_assoc()) {
        $doctorId = $row['doctor_id'] - 1;
        if($row['session'] > 0)  $session = $row['session']-1;
        else $session = $row['session'];
        $dayOffData[] = [$doctorId, $session];
    }

    // Create Day-ol.csv
    $dayOlCsvFile = fopen('../../instance-generator/Day-ol.csv', 'w');
    fputcsv($dayOlCsvFile, ['doctorID', 'room', 'day']);
    foreach ($dayOlData as $row) {
        fputcsv($dayOlCsvFile, $row);
    }
    fclose($dayOlCsvFile);

    // Create Day-off.csv
    $dayOffCsvFile = fopen('../../instance-generator/Day-off.csv', 'w');
    fputcsv($dayOffCsvFile, ['doctorID','day']);
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