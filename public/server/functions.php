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


/*
function readFromDB() {
    if (file_exists(PATH_DB)) {
        $raw = explode("\n",file_get_contents(PATH_DB));
        $lines = array();
        foreach ($raw AS $lineRaw) {
            $line = trim($lineRaw);
            if ($line!='') {
                $lineOut = json_decode($line, $assoc=true);
                $lineOut['correct'] = (int) $lineOut['correct'];
                $lineOut['wrong'] = (int) $lineOut['wrong'];
                foreach(array_keys($lineOut['wrongDetails']) AS $key) {
                    $lineOut['wrongDetails'][$key] = (int) $lineOut['wrongDetails'][$key];
                }
                $lines[] = $lineOut;
            }
        }
        usort($lines, 'sortLinesByCorrect');
        return $lines;
    } else {
        return null;
    }    
}

function sortLinesByCorrect($a, $b) {
    return $b['correct']-$a['correct'];
}
*/