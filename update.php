<?php

require 'config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

$discord_id = filter_input(INPUT_GET, "discord_id", FILTER_SANITIZE_STRING);
$discord_name = filter_input(INPUT_GET, "discord_name", FILTER_SANITIZE_SPECIAL_CHARS);
$battletag = filter_input(INPUT_GET, "battletag", FILTER_SANITIZE_SPECIAL_CHARS);
$battletag_num = filter_input(INPUT_GET, "battletag_num", FILTER_SANITIZE_SPECIAL_CHARS);

$paramsok = true;
if ($discord_id === null || $discord_id == ""){
    $paramsok = false;
}
if ($discord_name === null || $discord_name == ""){
    $paramsok = false;
}
if ($battletag === null || $battletag == ""){
    $paramsok = false;
}
if ($battletag_num === null || $battletag_num == ""){
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

            $command = "INSERT INTO `users` (`discord_id`, `discord_name`, `battletag`, `battletag_num`) 
                        VALUES (?,?,?,?)";
            $stmt = $dbh->prepare($command);
            $params = [$discord_id, $discord_name, $battletag, $battletag_num];
            $success = $stmt->execute($params);

            if ($success) {
                echo "1";
            } else {
                echo "0";
            }
        } else {

            $command = "UPDATE `users`
                        SET `battletag`=?
                        WHERE `discord_id`=?";
            $stmt = $dbh->prepare($command);
            $params = [$battletag, $discord_id];
            $success = $stmt->execute($params);

            if ($success) {
                echo "1";
            } else {
                echo "0";
            }

        }
    } else {
        echo "0";
    }
} else {
    echo "0";
}