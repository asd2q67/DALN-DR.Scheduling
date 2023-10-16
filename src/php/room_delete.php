<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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

// Handle DELETE request to delete a room
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get room ID from the URL parameter
    parse_str(file_get_contents("php://input"), $deleteData);
    // Get room ID from the URL parameter
    $roomId = $_GET['id'];

    // Delete corresponding record from demand table
    $deleteDemandQuery = "DELETE FROM demand WHERE `room-id` = $roomId";
    if ($mysqli->query($deleteDemandQuery) === TRUE) {
        // Delete room from room_detail table
        $deleteRoomQuery = "DELETE FROM room_detail WHERE id = $roomId";
        if ($mysqli->query($deleteRoomQuery) === TRUE) {
            // Delete corresponding columns from dr_detail table
            $deleteDrDetailColumnsQuery = "ALTER TABLE dr_detail DROP COLUMN R$roomId";
            if ($mysqli->query($deleteDrDetailColumnsQuery) === TRUE) {
                // Successfully deleted room and corresponding columns in dr_detail table
                echo json_encode(["message" => "Room and corresponding columns in dr_detail deleted successfully"]);
            } else {
                // Error deleting columns from dr_detail table
                http_response_code(500); // Internal Server Error
                echo json_encode(["error" => "Failed to delete corresponding columns in dr_detail table"]);
            }
        } else {
            // Error deleting room
            http_response_code(500); // Internal Server Error
            echo json_encode(["error" => "Failed to delete room"]);
        }
    } else {
        // Error deleting room
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Failed to delete room"]);
    }

    // Close the database connection
    $mysqli->close();
} else {
    // Handle unsupported request methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}
?>