<?php
require("db.php");

//get requested page, or die trying
if (!empty($_GET['form']))
{
	$form = $_GET['form'];
	$type = "form";
}
else if (!empty($_GET['method']))
{
	$method = $_GET['method'];
	$type = "method";
}
else
{
	die("no method provided");
}

//get arguments
if ($type == "form")
	$args = json_decode(json_encode($_POST)); //convert to object
else if ($type == "method")
	$args = json_decode(file_get_contents("php://input"));

//let method files make sure they're called via this script and not directly
$calledCorrectly = true;

//path to root directory
$root = "../../..";

//configuration file
$conf = json_decode(file_get_contents("$root/conf.json"));

//database
$db = new Database("$root/".$conf->dir->db);

//check whether token is valid
function verifyToken($token=false)
{
	if ($token == false)
		return false;

	global $root;
	$path = "$root/adminTokens";

	if (!file_exists($path))
		return false;

	$validTokens = explode("\n", file_get_contents($path));

	return in_array($token, $validTokens);
}

//reply to caller if success
function succeed($arr=[])
{
	$arr['success'] = true;
	die(json_encode($arr));
}

//reply to caller if failure
function fail($err="")
{
	$arr = [];
	$arr['success'] = false;
	$arr['error'] = $err;

	die(json_encode($arr));
}

function requireToken()
{
	global $args;

	if (!empty($args->token) && verifyToken($args->token))
	{
		return true;
	}
	else
	{
		fail("Invalid token");
	}
}

//include correct method or form
if ($type == "form")
	include "forms/$form.php";
else if ($type == "method")
	include "methods/$method.php";
