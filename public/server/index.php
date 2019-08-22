<?php

    require_once(getcwd().DIRECTORY_SEPARATOR.'init.php');

    $POST_DATA=json_decode(file_get_contents("php://input"), true);
    $POST_ACTION=isset($POST_DATA['action']) ? $POST_DATA['action'] : null;

    if ($POST_ACTION!==null && $POST_ACTION!==false) {
        switch($POST_ACTION) {
            case 'validate-new-login':
                print json_encode(validateNewLogin(
                    isset($POST_DATA['pin']) ? $POST_DATA['pin'] : null,
                    isset($POST_DATA['name']) ? $POST_DATA['name'] : null
                ));
                break;
            case 'create-group':
                print json_encode(createGroup(
                    isset($POST_DATA['name']) ? $POST_DATA['name'] : null,
                    isset($POST_DATA['package']) ? $POST_DATA['package'] : null
                ));
                break;
            case 'answer-upload':
                print json_encode(uploadAnswer(
                    isset($POST_DATA['userid']) ? $POST_DATA['userid'] : null,
                    isset($POST_DATA['answers']) ? $POST_DATA['answers'] : null
                ));
                break;
            case 'group-clean':
                print json_encode(cleanGroup(
                    isset($POST_DATA['pin']) ? $POST_DATA['pin'] : null
                ));
                break;
            case 'group-hash-update':
                print json_encode(updateGroupHash(
                    isset($POST_DATA['pin']) ? $POST_DATA['pin'] : null,
                    isset($POST_DATA['hash']) ? $POST_DATA['hash'] : null
                ));
                break;
            case 'group-delete':
                print json_encode(deleteGroup(
                    isset($POST_DATA['pin']) ? $POST_DATA['pin'] : null
                ));
                break;
            default:
                die("Unknown POST action: *".$POST_ACTION."*");
        }
        die();
    }

    $GET_ACTION = filter_input(INPUT_GET, 'action', FILTER_SANITIZE_SPECIAL_CHARS);

    if ($GET_ACTION!==null && $GET_ACTION!==false) {
        switch($GET_ACTION) { 
            case 'packages-list':
                print json_encode(listPackages());
                break;
            case 'package-get':
                print json_encode(getPackage(
                    filter_input(INPUT_GET, 'hash', FILTER_SANITIZE_SPECIAL_CHARS)
                ));
                break;
            case 'groups-list':
                print json_encode(listGroups());
                break;
            case 'report-get':
                print json_encode(reportGet(
                    filter_input(INPUT_GET, 'hash', FILTER_SANITIZE_SPECIAL_CHARS)
                ));
                break;
            case '':   
                break;
            default:
                die("Unknown GET action: *".$GET_ACTION."*");
        }
        die();
    }

    die("Undefined action.");
