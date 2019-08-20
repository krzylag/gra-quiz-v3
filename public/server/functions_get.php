<?php


function listPackages() {
    $result=[];
    foreach (scandir(PATH_PACKAGES) AS $candidate) {
        if ($candidate!='.' && $candidate!='..' && endsWith($candidate,'.json')) {
            $packageName=preg_replace('/.json$/', '', $candidate);
            $package=getPackageData($packageName);
            if ($package!=null) {
                $result[$package['json']->package_name]=[
                    "name" => $package['json']->package_name,
                    "hash" => $package['json']->package_hash,
                    "title" => $package['json']->package_title,
                    "css" => $package['css']
                ];
            }
        }
        
    }
    return $result;
}

function getPackage($hash) {
    foreach (listPackages() AS $pack) {
        if ($pack['hash']==$hash) {
            return [
                "result" => true,
                "package" => getPackageData($pack['name'])
            ];
        }
    }
    return [
        'result' => false,
        'reason' => 'no-such-package'
    ];
}


/*
function getAnswersFromGroup($groupName) {
    if ($groupName!=false && $groupName!=null) {
        $lines = readFromDB();
        return [
            "result"    =>  true,
            "reason"    => null,
            "answers"   =>  array_filter($lines, function($el) use ($groupName) {
                                return (isset($el['groupname']) && $el['groupname']==$groupName);
                            })
        ];
    } else {
        return [
            "result"    => false,
            "reason"    => "nie podano nazwy grupy",
            "answers"   => null
        ];
    }
}

function getGroups() {
    $lines = readFromDB();
    $groups = [];
    foreach ($lines as $line) {
        if (!isset($groups[$line['groupname']])) {
            $groups[$line['groupname']]=$line['groupname'];
        }
    }
    sort($groups);
    return [
        "result" => true,
        "groups" => $groups
    ];
}
*/