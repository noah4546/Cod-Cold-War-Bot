<?php

require 'config.php';

$discord_id = filter_input(INPUT_GET, "discord_id", FILTER_SANITIZE_SPECIAL_CHARS);
$discord_name = filter_input(INPUT_GET, "discord_name", FILTER_SANITIZE_SPECIAL_CHARS);
$battletag = filter_input(INPUT_GET, "battle_tag", FILTER_SANITIZE_SPECIAL_CHARS);

$paramsok = true;
if ($discord_id === null || $discord_id == ""){
    $paramsok = false;
}
if ($discord_name === null || $discord_name == ""){
    $paramsok = false;
}
if ($battle_tag === null || $battle_tag == ""){
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

            $command = "INSERT INTO `users` (`discord_id`, `discord_name`, `battletag`) VALUES (?,?,?)";
            $stmt = $dbh->prepare($command);
            $params = [$discord_id, $discord_name, $battletag];
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