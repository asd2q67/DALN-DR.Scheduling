<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: PUT, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    http_response_code(200);
    exit();
}

// Database configuration
$dbserver = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "daln_dr.scheduling";

// Get the PUT data
$input_data = file_get_contents("php://input");
$data = json_decode($input_data, true);

// Check if the required fields are present in the data
if(isset($data['id'])) {
    $id = $data['id'];
    $name = $data['Name'];
    $r1 = $data['R1'];
    $r2 = $data['R2'];
    $r3 = $data['R3'];
    $r4 = $data['R4'];
    $r5 = $data['R5'];
    $r6 = $data['R6'];
    $r7 = $data['R7'];
    $workload = $data['workload'];

    // Create a connection to the database
    $mysqli = new mysqli($dbserver, $dbuser, $dbpass, $dbname);

    // Check the connection
    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    // Prepare and execute the SQL query to update the record
    $query = "UPDATE dr_detail SET 
              Name = '$name',
              R1 = '$r1',
              R2 = '$r2',
              R3 = '$r3',
              R4 = '$r4',
              R5 = '$r5',
              R6 = '$r6',
              R7 = '$r7',
              workload = '$workload'
              WHERE id = '$id'";

    if ($mysqli->query($query) === TRUE) {
        // If the update is successful, return success response
        http_response_code(200); // OK
        echo json_encode(["message" => "Record updated successfully"]);
    } else {
        // If the update fails, return error response
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Error updating record: " . $mysqli->error]);
    }

    // Close the database connection
    $mysqli->close();
} else {
    // If required fields are not present, return error response
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "Bad Request: Missing required fields"]);
}
?>
