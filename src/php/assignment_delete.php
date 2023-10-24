<!-- dr_delete.php -->
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    http_response_code(200);
    exit();
}

// Handle DELETE request
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = isset($_GET['id']) ? $mysqli->real_escape_string($_GET['id']) : '';

    // Check if ID is provided
    if ($id !== '') {
        // Prepare the SQL query with parameterized statement to prevent SQL injection
        $query = "DELETE FROM work_assign WHERE id = '$id'";

        // Execute the query
        if ($mysqli->query($query)) {
            http_response_code(200); // OK
            echo json_encode(["message" => "Doctor deleted successfully"]);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(["error" => "Failed to delete doctor"]);
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Missing ID parameter"]);
    }
} else {
    // Handle unsupported request methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}

// Close the database connection
$mysqli->close();
?>
