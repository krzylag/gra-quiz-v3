<?php

function getPackageData($packageName) {
    $file=PATH_PACKAGES.DIRECTORY_SEPARATOR.$packageName.'.json';
    $source = file_get_contents($file);
    $parsed = null;
    try {
        $parsed = json_decode($source);
    } catch (Exception $e) {
        
    }
    if ($parsed==null) return null;
    $hash = md5(json_encode($parsed));
    $parsed->package_hash=$hash;
    $parsed->package_name=$packageName;
    foreach ($parsed->answers AS $key=>$ans) {
        $parsed->answers[$key]->id=$key;
    }
    foreach ($parsed->questions AS $key=>$ans) {
        $parsed->questions[$key]->id=$key;
    }
    $cssData = null;
    $cssFile=PATH_PACKAGES.DIRECTORY_SEPARATOR.$packageName.'.css';
    if (file_exists($cssFile)) {
        $cssData=file_get_contents($cssFile);
    }
    return [
        'json' => $parsed,
        'css' => $cssData
    ];
}