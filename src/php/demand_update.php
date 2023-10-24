<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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

// Create a connection to the database
$mysqli = new mysqli($dbserver, $dbuser, $dbpass, $dbname);

// Check the connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Handle PUT request
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Get the PUT data
    $input_data = file_get_contents("php://input");
    $data = json_decode($input_data, true);

    // Check if the required fields are present in the data
    if (isset($data['id']) && isset($data['demand0']) && isset($data['demand1']) && isset($data['demand2'])) {
        $id = $data['id'];
        $demand0 = $data['demand0'];
        $demand1 = $data['demand1'];
        $demand2 = $data['demand2'];

        // Prepare and execute the SQL query to update the demand record
        $query = "UPDATE demand SET 
                  demand0 = '$demand0',
                  demand1 = '$demand1',
                  demand2 = '$demand2'
                  WHERE id = '$id'";

        if ($mysqli->query($query) === TRUE) {
            // If the update is successful, return success response
            http_response_code(200); // OK
            echo json_encode(["message" => "Demand updated successfully"]);
        } else {
            // If the update fails, return error response
            http_response_code(500); // Internal Server Error
            echo json_encode(["error" => "Error updating demand: " . $mysqli->error]);
        }
    } else {
        // If required fields are not present, return error response
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Bad Request: Missing required fields"]);
    }

    // Close the database connection
    $mysqli->close();
} else {
    // Handle unsupported request methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}
?>
