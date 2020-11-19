<?php

require 'config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

$discord_id = filter_input(INPUT_GET, "discord_id", FILTER_SANITIZE_SPECIAL_CHARS);

$paramsok = true;
if ($discord_id === null || $discord_id == ""){
    $paramsok = false;
}

if ($paramsok) {

    $command = "SELECT * FROM `users`
                WHERE `discord_id`=?";
    $stmt = $dbh->prepare($command);
    $params = [$discord_id];
    $success = $stmt->execute($params);

    if ($success) {
        if ($stmt->rowCount() < 1) {
            echo "0";
        } else {

            $row = $stmt->fetch();

            $battle_tag = [
                "battletag" => $row['battletag'],
                "battletag_num" => $row['battletag_num']
            ];
            echo json_encode($battle_tag);
        }
    } else {
        echo "0";
    }
} else {
    echo "0";
}