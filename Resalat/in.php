<?php
/* Attempt MySQL server connection. Assuming you are running MySQL
server with default setting (user 'root' with no password) */
$link = mysqli_connect("localhost", "cp41857_n", "y1LMR-m{u96b", "cp41857_nokhbe");
 
// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
 
// Escape user inputs for security
$name = mysqli_real_escape_string($link, $_REQUEST['name']);
$phone = mysqli_real_escape_string($link, $_REQUEST['phone']);
$prize = mysqli_real_escape_string($link, $_REQUEST['prize']);
$code = mysqli_real_escape_string($link, $_REQUEST['code']);

 
// Attempt insert query execution
$sql = "INSERT INTO id (name, phone, prize, code) VALUES ('$name', '$phone', '$prize', '$code')";
if(mysqli_query($link, $sql)){
    echo "Records added successfully.";
} else{
    echo "ERROR: Could not able to execute $sql. " . mysqli_error($link);
}
 
// Close connection
mysqli_close($link);
?>