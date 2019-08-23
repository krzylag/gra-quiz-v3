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
        $packageRaw = getPackage($fetchPinCheck[0]['package_hash']);
        if ($packageRaw['result']===false) return [
            "result" => false,
            "reason" => 'unknown-package-hash'
        ];

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

function uploadAnswer($userId, $answers) {
    GLOBAL $DB;

    $correctPayload = [];
    $wrongPayload = [];
    foreach ($answers AS $answer) {
        if ($answer['a']) {
            $correctPayload[]=[
                "q" => $answer['qId'],
                "a" => $answer['aId']
            ];
        } else {
            $wrongPayload[]=[
                "q" => $answer['qId'],
                "a" => $answer['aId']
            ];
        }
    }
    $correctPayload = json_encode($correctPayload);
    $wrongPayload = json_encode($wrongPayload);

    $prepAU = $DB->prepare("INSERT INTO answers (user_id, correct_json, wrong_json, created_at) VALUES (:usid, :corr, :wron, :cat )");
    $prepAU->bindParam(":usid", $userId, PDO::PARAM_INT);
    $prepAU->bindParam(":corr", $correctPayload, PDO::PARAM_STR);
    $prepAU->bindParam(":wron", $wrongPayload, PDO::PARAM_STR);
    $now = (new DateTime())->format("c");
    $prepAU->bindParam(":cat", $now, PDO::PARAM_STR);
    $resAU = $prepAU->execute();
    $newId = $DB->lastInsertId();
    return [
        "result" => $resAU,
        "answer_id" => ($resAU) ? (int) $newId : null
    ];
}

function cleanGroup($pinCode) {
    GLOBAL $DB;
    $prepSrc = $DB->prepare("
        SELECT u.id AS uid, g.id AS gid 
        FROM groups AS g
        LEFT JOIN users AS u ON u.group_id=g.id
        WHERE g.pin = :pcode
    ");
    $prepSrc->bindParam(":pcode", $pinCode, PDO::PARAM_STR);
    $resSrc = $prepSrc->execute();
    $fetchSrc = $prepSrc->fetchAll(PDO::FETCH_ASSOC);
    $usersIds = [];
    foreach ($fetchSrc AS $row) {
        $usersIds[$row['uid']]=$row['uid'];
    }
    if (sizeof($usersIds)>0) {
        $prepDU = $DB->prepare("UPDATE users SET deleted_at = :dat WHERE id IN (".implode(", ",$usersIds).")");
        $now = (new DateTime())->format("Y-m-d H:i:s");
        $prepDU->bindParam(":dat", $now, PDO::PARAM_STR);
        $resDU = $prepDU->execute();
    } else {
        $resDU=true;
    }
    return [
        "result" => ($resSrc && $resDU),
        "result_src" => $resSrc,
        "result_du" => $resDU
    ];
}

function updateGroupHash($pinCode, $newHash) {
    GLOBAL $DB;
    $prepGU = $DB->prepare("UPDATE groups SET package_hash=:phash WHERE pin=:pcode");
    $prepGU->bindParam(":phash", $newHash, PDO::PARAM_STR);
    $prepGU->bindParam(":pcode", $pinCode, PDO::PARAM_STR);
    $resGU = $prepGU->execute();
    return [
        "result" => $resGU
    ];
}

function updateGroupPin($oldPin, $newPin) {
    GLOBAL $DB;
    $prepOPC = $DB->prepare("SELECT id FROM groups WHERE pin=:npin");
    $prepOPC->bindParam(":npin", $newPin, PDO::PARAM_STR);
    $resOPC = $prepOPC->execute();
    $fetchOPC = $prepOPC->fetchAll(PDO::FETCH_ASSOC);
    if (sizeof($fetchOPC)>0) {
        return [
            "result" => false,
            "reason" => 'pin-occupied'
        ];
    }
    $prepPU = $DB->prepare("UPDATE groups SET pin=:npin WHERE pin=:opin");
    $prepPU->bindParam(":opin", $oldPin, PDO::PARAM_STR);
    $prepPU->bindParam(":npin", $newPin, PDO::PARAM_STR);
    $resPU = $prepPU->execute();
    return [
        "result" => $resPU
    ];
}

function deleteGroup($pinCode) {
    GLOBAL $DB;
    $prepGD= $DB->prepare("UPDATE groups SET deleted_at=:ctime WHERE pin=:pcode");
    $now = (new DateTime())->format("c");
    $prepGD->bindParam(":ctime", $now, PDO::PARAM_STR);
    $prepGD->bindParam(":pcode", $pinCode, PDO::PARAM_STR);
    $resGD = $prepGD->execute();
    return [
        "result" => $resGD
    ];
}

