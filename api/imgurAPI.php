<?php
header('Content-Type: application/json; charset=utf-8');
if(strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest') {
  die();
}
$ClientId = require 'clientid.php';
$ch = curl_init(); 

curl_setopt($ch, CURLOPT_URL, "https://api.imgur.com/3/album/$_GET[album_id]");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Client-ID $ClientId"]);

echo curl_exec($ch);
curl_close($ch);