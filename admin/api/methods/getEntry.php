<?php
if (!$calledCorrectly) die();
requireToken();

if (!isset($args->id)) fail();

$id = $mysqli->real_escape_string($args->id);
$entry = $mysqli->query("SELECT * FROM entries WHERE id='$id'")->fetch_assoc();

if ($mysqli->error) fail($mysqli->error);

succeed(
[
	"entry"=>$entry
]);
