<?php
if (!$calledCorrectly) die();
requireToken();

$id = $mysqli->real_escape_string($args->id);
$mysqli->query("DELETE FROM categories WHERE id=$id");

if ($mysqli->error)
{
	fail(
	[
		"error"=>$mysqli->error
	]);
}
else
{
	succeed();
}