<?php 
include("database_dr.php");

$conn = mysqli_connect("localhost","root","","daln_dr.scheduling");
$query = "SELECT * FROM dr_detail ORDER BY id desc";
$result = mysqli_query($conn,$query);

?>
<form method="post" action="export.php">
    <input type="submit" name="export" value="CSV export"/>
</form>
<?php

while ($row = mysqli_fetch_array($result)) {
?>

<?php
}
?>