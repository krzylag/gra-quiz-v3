<?php

function cors() {
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        exit(0);
    }
}

function endsWith($haystack, $needle) {
    return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
}

function getDatabaseVersionOrCreate() {
    GLOBAL $DB;
    $prep = $DB->prepare("SELECT max(id) AS id FROM appversion");
    $res = $prep->execute();
    if ($res===false) {
        $DB->exec(file_get_contents(PATH_DATABASE_SCRIPT));
        $prep2 = $DB->prepare("SELECT max(id) AS id FROM appversion");
        $res2 = $prep2->execute();
        $fetched=$prep2->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $fetched=$prep->fetchAll(PDO::FETCH_ASSOC);
        $res2=true;
    }
    if ($res || $res2) {
        return $fetched[0]['id'];
    } else {
        
    }
}
