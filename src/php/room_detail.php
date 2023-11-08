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
function generateCSV($mysqli)
{
    // Build the SQL query to select data from room_detail and demand tables
    $query = "SELECT rd.id AS roomID, rd.load AS heavy, d.demand1, d.demand2
              FROM room_detail rd
              JOIN demand d ON rd.id = d.`room-id`";

    // Execute the query
    $result = $mysqli->query($query);

    // Create a file pointer connected to the output stream
    $output = fopen('../../instance-generator/Room.csv', 'w');

    // Write the CSV header
    fputcsv($output, array('roomID', 'heavy', 'demand1', 'demand2'));

    // Write data rows from the database to the CSV file
    while ($row = $result->fetch_assoc()) {
        fputcsv($output, $row);
    }

    // Close the file pointer
    fclose($output);
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

    // Generate and save the CSV file
    generateCSV($mysqli);

    // Close the database connection
    $mysqli->close();
} else {
    // Handle unsupported request methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}
?>