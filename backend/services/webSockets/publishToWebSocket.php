<?php
require_once __DIR__."/../../vendor/autoload.php";

/**
 * Publishes a message in the redis pub-sub server
 * @param mixed $channel
 * @param mixed $payload
 * @param mixed $encode
 * @return void
 */
function publishMessage($channel, $payload, $encode = true) {
    //echo "Sending to websocket channel: $channel", var_dump($payload);
    $data = $payload;
    if ($encode) {
        $data = json_encode($payload);
    }
    $client = new Predis\Client();
    //$client->set('foo', 'bar');$value = $client->get('foo');echo $value;
    $client->publish($channel,  $data);
    $client->disconnect();
}

/**
 * Publishes a message in the channel where the WebSocket is listening with the configured action of broadcasting a message to the users
 * @param mixed $room Room users that will receive the message
 * @param mixed $targetType 
 * @param mixed $operationType
 * @param mixed $data
 * @return void
 */
function sendToUsers($room, $targetType, $operationType, $data) {
    $payload = [
        'action' => 'broadcast',
        'room' => $room,
        'targetType' => $targetType,
        'operationType' => $operationType,
        'data' => $data,
    ];
    publishMessage('Syncro', $payload);
};