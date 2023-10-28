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

function generateCSV($mysqli) {
    // Build the SQL query to select data from dr_detail table
    $query = "SELECT * FROM dr_detail";

    // Execute the query
    $result = $mysqli->query($query);

    // Create a file pointer connected to the output stream
    $output = fopen('../instance-generator/Doctor.csv', 'w');

    // Write the CSV header
    $columnHeaders = array();
    for ($i = 1; $i <= $result->field_count-2; $i++) {
        $columnHeaders[] = 'R' . $i;
    }
    fputcsv($output, array_merge(['Name'], $columnHeaders));

    // Write data rows from the database to the CSV file
    while ($row = $result->fetch_assoc()) {
        $rowData = array($row['Name']);
        for ($i = 1; $i <= $result->field_count-2; $i++) {
            $columnName = 'R' . $i;
            $rowData[] = $row[$columnName];
        }
        fputcsv($output, $rowData);
    }

    // Close the file pointer
    fclose($output);
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Parse incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    // Extract data from JSON
    $name = $mysqli->real_escape_string($data['Name']);

    // Build the SQL query dynamically based on room IDs
    $insertColumns = ['Name'];
    $insertValues = ["'$name'"];
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
        generateCSV($mysqli); // Generate CSV after inserting data
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
