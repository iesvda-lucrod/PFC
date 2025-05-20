<?php
require_once __DIR__."/../../vendor/autoload.php";

function openSocketChannel($channelName) {
    sendToWebSocket('main', [
        'action' => 'openChannel',
        'payload' => $channelName,
    ]);
}
function closeSocketChannel($channelName) {
    sendToWebSocket('main', [
        'action' => 'closeChannel',
        'payload' => $channelName,
    ]);
}
function sendToWebSocket($channel, $payload, $encode = true) {
    $data = $payload;
    if ($encode) {
        $data = json_encode($payload);
    }
    $client = new Predis\Client();
    $client->set('foo', 'bar');$value = $client->get('foo');echo $value;
    $client->publish($channel,  $payload);
    $client->disconnect();
}

sendToWebSocket('chat', 'test', false);