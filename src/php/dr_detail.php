<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

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
    // Build the SQL query to select data from dr_detail table
    $query = "SELECT * FROM dr_detail";

    // Execute the query
    $result = $mysqli->query($query);

    // Create a file pointer connected to the output stream
    $output = fopen('../../instance-generator/Doctor.csv', 'w');

    // Write the CSV header
    $columnHeaders = array();
    for ($i = 1; $i <= $result->field_count - 2; $i++) {
        $columnHeaders[] = 'R' . $i;
    }
    fputcsv($output, array_merge(['Id'], $columnHeaders));

    // Write data rows from the database to the CSV file
    while ($row = $result->fetch_assoc()) {
        $rowData = array($row['id']);
        for ($i = 1; $i <= $result->field_count - 2; $i++) {
            $columnName = 'R' . $i;
            $rowData[] = $row[$columnName];
        }
        fputcsv($output, $rowData);
    }

    $output2 = fopen('../../instance-generator/Workload.csv', 'w');
    $columnHeaders = array();
    for ($i = 0; $i <= $result->field_count - 3; $i++) {
        $columnHeaders[] = 'R' . $i;
    }
    fputcsv($output2, $columnHeaders);
    
    // Fetch the IDs from the database and count the number of rows
    $idCountQuery = "SELECT COUNT(id) AS rowCount FROM dr_detail";
    $rowCountResult = $mysqli->query($idCountQuery);
    $rowCountData = $rowCountResult->fetch_assoc();
    $rowCount = $rowCountData['rowCount'];

    // Write data rows for Workload.csv with all 'R' values set to 0
    for ($rowIndex = 0; $rowIndex < $rowCount; $rowIndex++) {
        $rowData = array();
        for ($i = 0; $i < $result->field_count - 2; $i++) {
            // Set all 'R' values to 0
            $rowData[] = 0;
        }
        fputcsv($output2, $rowData);
    }

    // Close the file pointer
    fclose($output);
    fclose($output2);
}

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = isset($_GET['id']) ? $mysqli->real_escape_string($_GET['id']) : '';

    // Prepare the SQL query with parameterized statement to prevent SQL injection
    $query = "SELECT * FROM dr_detail";
    if ($id !== '') {
        $query .= " WHERE id = '$id'";
    }

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
    // Send success response
    generateCSV($mysqli); // Generate CSV after inserting data
    // Close the database connection
    $mysqli->close();
} else {
    // Handle unsupported request methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}
?>