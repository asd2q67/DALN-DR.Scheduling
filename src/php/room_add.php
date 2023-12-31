<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

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
$dbname = "daln_dr.scheduling"; // Replace with your actual database name

// Create a connection to the database
$mysqli = new mysqli($dbserver, $dbuser, $dbpass, $dbname);

// Check the connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

function generateCSV($mysqli)
{
    // Build the SQL query to select data from room_detail and demand tables
    $query = "SELECT rd.id AS roomID, rd.name, rd.load AS heavy, rd.priority, d.demand0, d.demand1, d.demand2
              FROM room_detail rd
              JOIN demand d ON rd.id = d.`room-id`";

    // Execute the query
    $result = $mysqli->query($query);

    // Create a file pointer connected to the output stream
    $output = fopen('../../instance-generator/Room.csv', 'w');

    // Write the CSV header
    fputcsv($output, array('roomID', 'name', 'heavy', 'priority', 'demand0', 'demand1', 'demand2'));

    // Write data rows from the database to the CSV file
    while ($row = $result->fetch_assoc()) {
        fputcsv($output, $row);
    }

    // Close the file pointer
    fclose($output);
}

// Handle POST request to add a new room
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from the request body
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if the expected keys exist in the received data
    if (isset($data['name'], $data['load'], $data['priority'], $data['demand0'], $data['demand1'], $data['demand2'])) {
        // Extract room data
        $roomName = $data['name'];
        $roomLoad = $data['load'];
        $roomPriority = $data['priority'];
        $demand0 = $data['demand0'];
        $demand1 = $data['demand1'];
        $demand2 = $data['demand2'];

        // Insert new room into the room_detail table
        $insertRoomQuery = "INSERT INTO room_detail (name, `load`, priority) VALUES ('$roomName', $roomLoad, $roomPriority)";
        if ($mysqli->query($insertRoomQuery) === TRUE) {
            // Get the ID of the newly inserted room
            $roomId = $mysqli->insert_id;

            // Insert new record into the demand table
            $insertDemandQuery = "INSERT INTO demand (`room-id`, demand0, demand1, demand2) VALUES ($roomId, $demand0, $demand1, $demand2)";
            if ($mysqli->query($insertDemandQuery) === TRUE) {

                $drDetailColumnsQuery = "ALTER TABLE dr_detail ADD COLUMN R$roomId INT DEFAULT 0";
                if ($mysqli->query($drDetailColumnsQuery) === TRUE) {
                    // Successfully added room, demand, and new column in dr_detail table
                    echo json_encode(["message" => "Room, demand record, and new column in dr_detail added successfully"]);

                    // Generate and save the CSV file
                    generateCSV($mysqli);
                } else {
                    // Error adding new column in dr_detail table
                    http_response_code(500); // Internal Server Error
                    echo json_encode(["error" => "Failed to add new column in dr_detail table"]);
                }
            } else {
                // Error adding demand record
                http_response_code(500); // Internal Server Error
                echo json_encode(["error" => "Failed to add demand record"]);
            }
        } else {
            // Error adding room
            http_response_code(500); // Internal Server Error
            echo json_encode(["error" => "Failed to add room"]);
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Invalid data format"]);
    }

    // Close the database connection
    $mysqli->close();
} else {
    // Handle unsupported request methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}