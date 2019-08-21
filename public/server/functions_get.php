<?php


function listGroups() {
    GLOBAL $DB;
    $prepGroups = $DB->prepare('SELECT * FROM groups WHERE deleted_at IS NULL ORDER BY created_at');
    $prepGroups->execute();
    $fetchGroups = $prepGroups->fetchAll(PDO::FETCH_ASSOC);
    $result=[];
    foreach ($fetchGroups AS $row) {
        $result[$row['id']]=$row;
        $result[$row['id']]['id']=(int) $row['id'];
    }
    return $result;
}

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

function reportGet($hash) {
    GLOBAL $DB;
    $prepUsers = $DB->prepare("
        SELECT 
            u.id AS uid, u.name, u.deleted_at,
            a.id AS aid, a.correct_json, a.wrong_json, a.created_at
        FROM 
            users AS u 
            LEFT JOIN groups AS g ON g.id=u.group_id 
            LEFT JOIN answers AS a ON a.user_id=u.id
        WHERE 
            g.package_hash=:phash 
            AND u.deleted_at IS NULL 
            AND g.deleted_at IS NULL
    ");
    $prepUsers->bindParam(":phash", $hash, PDO::PARAM_STR);
    $resUsers = $prepUsers->execute();
    $fetchUsers = $prepUsers->fetchAll(PDO::FETCH_ASSOC);
    $users = [];
    foreach ($fetchUsers AS $row) {
        if (!isset($users[$row['uid']])) {
            $users[$row['uid']]=[
                "id" => (int) $row['uid'],
                "name" => $row['name'],
                "deleted_at" => $row['deleted_at'],
                "answers" => []
            ];
        }
        if ($row['aid']!==null) {
            $answer=[];
            foreach (json_decode($row['correct_json']) AS $ans) {
                $answer[]=[ "q"=>$ans->q, "a"=>$ans->a, "r"=>true ];
            }
            foreach (json_decode($row['wrong_json']) AS $ans) {
                $answer[]=[ "q"=>$ans->q, "a"=>$ans->a, "r"=>false ];
            }
            usort($answer, function($a,$b) {
                return ($a['q'] - $b['q']);
            });
            $users[$row['uid']]['answers'][$row['created_at']]=[
                "id" => (int) $row['aid'],
                "answer" => $answer,
                "created_at" => $row['created_at']
            ];
        }
    }
    foreach ($users AS &$u) {
        usort($users[$u['id']]['answers'], function($a,$b) {
            return strtotime($b['created_at'])-strtotime($a['created_at']);
        });
        if (isset($users[$u['id']]['answers'][0])) {
            $users[$u['id']]['answers']=$users[$u['id']]['answers'][0];
        }
    }
    
    return [
        "result" => ($resUsers),
        "hash" => $hash,
        "users" => $users
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