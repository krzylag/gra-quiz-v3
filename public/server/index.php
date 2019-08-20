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
            case '':   
                break;
            default:
                die("Unknown GET action: *".$GET_ACTION."*");
        }
        die();
    }

    die("Undefined action.");

/*
    $actionPost = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_SPECIAL_CHARS);
    if ($actionPost==null || $actionPost==false) {
        $dataPost=json_decode(file_get_contents("php://input"), true);
        $actionPost=isset($dataPost['action']) ? $dataPost['action'] : null;
    } else {
        $dataPost=$_POST;
    }
    
    if ($actionPost!==null && $actionPost!==false) {
        switch($actionPost) {
            case 'register':
                print json_encode(registerAnswer(
                    trim($dataPost['username']),
                    trim($dataPost['groupname']),
                    $dataPost['correct'],
                    $dataPost['wrong'],
                    $dataPost['wrongDetails']
                ));
                break;
            case 'clear-group':
                print json_encode(deleteAnswersFromGroup(
                    isset($dataGet['groupname']) ? trim($dataGet['groupname']) : null
                ));
                break;
            default:
                die("Unknown POST action: *".$actionPost."*");
        }
        die();
    }
  
    $actionGet = filter_input(INPUT_GET, 'action', FILTER_SANITIZE_SPECIAL_CHARS);
    if ($actionGet!==null && $actionGet!==false) {
        $dataGet=$_GET;
        switch($actionGet) { 
            case 'get-answers':
                print json_encode(getAnswersFromGroup(
                    isset($dataGet['groupname']) ? trim($dataGet['groupname']) : null
                ));
                break;
            case 'get-groups':
                print json_encode(getGroups());
                break;
            default:
                die("Unknown GET action: *".$actionGet."*");
        }
        die();
    }

    require_once 'partials/header.php';
    require_once 'partials/play.html';
    require_once 'partials/footer.php';

    */