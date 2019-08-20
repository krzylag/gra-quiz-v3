<?php

function validateNewLogin($tryPin, $tryName) {
    GLOBAL $DB;
    if ($tryPin==null ||  $tryName==null) return [
        "result" => false,
        "reason" => "null-argument"
    ];
    $prepPinCheck = $DB->prepare('SELECT * FROM groups WHERE pin = :pin AND deleted_at IS NULL');
    $prepPinCheck->bindParam(':pin', $tryPin, PDO::PARAM_STR);
    $prepPinCheck->execute();
    $fetchPinCheck = $prepPinCheck->fetchAll(PDO::FETCH_ASSOC);
    if (sizeof($fetchPinCheck)>0) {
        $prepUserCheck = $DB->prepare('SELECT * FROM users WHERE `name`=:uname AND group_id=:gid AND deleted_at IS NULL');
        $prepUserCheck->bindParam(':uname', $tryName, PDO::PARAM_STR);
        $prepUserCheck->bindParam(':gid', $fetchPinCheck[0]['id'], PDO::PARAM_INT);
        $prepUserCheck->execute();
        $fetchUserCheck = $prepUserCheck->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($fetchUserCheck)>0) {
            return [
                "result" => false,
                "reason" => 'user-exists'
            ];
        }

        $prepNewUser = $DB->prepare('INSERT INTO users (group_id, `name`) VALUES (:gid, :nme)');
        $prepNewUser->bindParam(':gid', $fetchPinCheck[0]['id'], PDO::PARAM_INT);
        $prepNewUser->bindParam(':nme', $tryName, PDO::PARAM_STR);
        $prepNewUser->execute();
        $userId = $DB->lastInsertId();
        $packageRaw = getPackage($fetchPinCheck[0]['package_hash']);
        return [
            "result" => true,
            "reason" => null,
            "user_id" => (int) $userId,
            "user_name" => $tryName,
            "package" => $packageRaw['package']['json'],
            "package_css" => $packageRaw['package']['css'],
        ];

    } else {
        return [
            "result" => false,
            "reason" => 'no-such-pin'
        ];
    }
}

function createGroup($name, $hash) {
    GLOBAL $DB;
    $prepPin = $DB->prepare('SELECT * FROM groups WHERE deleted_at IS NULL');
    $prepPin->execute();
    $fetchPin = $prepPin->fetchAll(PDO::FETCH_ASSOC);
    $existingPins=[];
    foreach ($fetchPin AS $row) {
        $existingPins[$row['pin']]=$row['pin'];
    }
    $gotPin=null;
    $loop = 0;
    do {
        $tryPin = rand(1000,9999);
        if (!isset($existingPins[$tryPin])) $gotPin=$tryPin;
        $loop++;
    } while ($gotPin==null || $loop<1000);
    if ($gotPin!==null) {
        $prepIns = $DB->prepare('INSERT INTO groups (name, pin, package_hash, created_at) VALUES (:na, :pi, :ph, :ca)');
        $prepIns->bindParam(':na', $name, PDO::PARAM_STR);
        $prepIns->bindParam(':pi', $gotPin, PDO::PARAM_STR);
        $prepIns->bindParam(':ph', $hash, PDO::PARAM_STR);
        $now=(new DateTime())->format('c');
        $prepIns->bindParam(':ca', $now, PDO::PARAM_STR);
        $prepIns->execute();
        return [
            "result"    => true,
            "reason"    => null,
            "groups"    => listGroups()
        ];
    } else {
        return [
            "result" => false,
            "reason" => 'unable-to-generate-pin'
        ];
    }
}


/*
function registerAnswer($uname, $gname, $countCorrect, $countWrong, $arrayWrong) {
    $data = [
        "username" => $uname, 
        "groupname" => $gname, 
        "correct" => $countCorrect, 
        "wrong" => $countWrong, 
        "wrongDetails" => $arrayWrong,
        "serverTime" => (new DateTime())->format('c')
    ];
    $r = file_put_contents(PATH_DB, json_encode($data)."\n", FILE_APPEND);
    if ($r===false) {
        return [
            "result" => false,
            "reason" => "Nie udało się zapisać do pliku bazy danych."
        ];
    } else {
        return [
            "result" => true,
            "reason" => null
        ];
    }
}

function deleteAnswersFromGroup($groupName) {
    $lines = readFromDB();
    $lines = array_filter($lines, function($el) use ($groupName) {
        return (isset($el['groupname']) && $el['groupname']!=$groupName);
    });
    file_put_contents(PATH_DB, "");
    foreach ($lines AS $line) {
        $r = file_put_contents(PATH_DB, json_encode($line)."\n", FILE_APPEND);
    }
    return [
        "result" => true,
        "reason" => null
    ];
}
*/