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

?>
	<table border="1">
	<tr>
		<th>id</th>
		<th>TITLE</th>
		<th>CONTENT</th>
		<th>DATE</th>
		<th><a href="news.php">Add</a></th>
	</tr>
	
<?php 
/*
	while($row = mysqli_fetch_assoc($result)){
?>
	<tr>
		<td><?php echo $row["id"]  ?> </td>
		<td> <?php echo $row["title"] ?> </td>
		<td> <?php echo $row["content"] ?> </td>
		<td> <?php echo $row["date"]  ?></td>
		<td><a href="update.php?id=<?php echo $row['id']; ?>">edit</a> | <a href="delete.php?id=<?php echo $row['id']; ?>">remove</a></td>
	</tr>

	<?php
	}
}
else{
	echo "Không có dữ liệu";
}
}
*/

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