<?php

    define('FORCE_HTTPS', true);
    define('PATH_SERVER', getcwd());
    define('PATH_BASE', dirname(PATH_SERVER));
    define('PATH_PACKAGES', PATH_BASE.DIRECTORY_SEPARATOR.'packages');
    define('DEVELOPMENT_MODE', PATH_SERVER.DIRECTORY_SEPARATOR."DEVELOPMENT_MODE");

    if (DEVELOPMENT_MODE==true) {
		ini_set('display_errors', 1);
        ini_set('error_reporting', E_ALL);
	}

    // Przekierowanie http->https
	if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != "off"){
		define('URL_PROTOCOL', 'https');
	} else {
		define('URL_PROTOCOL', 'http');
	}
	if(FORCE_HTTPS==true && URL_PROTOCOL=='http') {
		header('Location: ' . 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
		die();
	}

    // Załadowanie bibliotek funkcji
    require_once(PATH_SERVER.DIRECTORY_SEPARATOR.'config.php');
    require_once(PATH_SERVER.DIRECTORY_SEPARATOR.'functions.php');
    require_once(PATH_SERVER.DIRECTORY_SEPARATOR.'functions_json.php');
    require_once(PATH_SERVER.DIRECTORY_SEPARATOR.'functions_get.php');
    require_once(PATH_SERVER.DIRECTORY_SEPARATOR.'functions_post.php');

    // Podłączenie bazy danych
    $DB = new PDO("mysql:host=".DB_HOST.";port=".DB_PORT.";dbname=".DB_DATABASE, DB_USERNAME, DB_PASSWORD);
	$DB->exec('SET NAMES UTF8;');

    // Zezwolenie CORS
    cors();

