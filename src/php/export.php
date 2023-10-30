<?php  
if (isset($_POST["export"])) {
    $conn = mysqli_connect("localhost","root","","daln_dr.scheduling");
    header('Content-Type: text/csv; charset=utf8_general_ci');
    header('Content-Disposition: attachment; filename=data.csv');
    $output = fopen("php://output","w");
    fputcsv($output, array('id','Name','R1','R2','R3','R4','R5','R6','R7','workload'));
    $query = "SELECT * FROM dr_detail ORDER BY id DESC";
    $result = mysqli_query($conn, $query);

    while ($row = mysqli_fetch_assoc($result)) {
        fputcsv($output, $row);
    }  
    fclose($output);
}
?>