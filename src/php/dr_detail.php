<?php 
$dbserver ="localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "daln_dr.scheduling";
$mysqli = new mysqli($dbserver, $dbuser, $dbpass, $dbname);
$id ='';


echo "Database Output";
$method = $_SERVER['REQUEST_METHOD'];

if ($result = $mysqli-> query("SELECT * FROM dr_detail")) {

if(mysqli_num_rows($result)>0){
	
if ($method == 'GET') {
	if (!$id) echo '[';
	for ($i=0 ; $i < mysqli_num_rows($result) ; $i++){
		echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
	}
}
}
}
 ?>

</table>
