<?php
/*
This call sends a message to one recipient.
*/


require __DIR__.'/../../config.php';
use \Mailjet\Resources;

function sendEmail($from, $to, $subject, $message) {
    $mj = new \Mailjet\Client($_ENV['MJ_APIKEY_PUBLIC'], $_ENV['MJ_APIKEY_PRIVATE'],false,['version' => 'v3.1']);
    $body = [
        'Messages' => [
            [
                'From' => $from,
                'To' => $to,
                $subject,

                $message,
            ]
        ]
    ];
    $response = $mj->post(Resources::$Email, ['body' => $body]);
    $response->success() && var_dump($response->getData());
}












/*
function sendEmail($from, $to, $subject, $message) {
    $mj = new \Mailjet\Client($_ENV['MJ_APIKEY_PUBLIC'], $_ENV['MJ_APIKEY_PRIVATE'],false,['version' => 'v3.1']);
    $body = [
        'Messages' => [
            [
                'From' => [
                    'Email' => "iesvda.lucrod@gmail.com",
                    'Name' => "Syncro Contact"
                ],
                'To' => [
                    [
                        'Email' => "lucasbustabad4@gmail.com",
                        'Name' => "passenger 1"
                    ]
                ],
                'Subject' => "Tenviao un correo",
                'TextPart' => "Yepa ha funcionao que locura",
                'HTMLPart' => "<h2>HTML TEST</h2> <a href=\"http://localhost:5173/notfound\">TESTLINK</a>",
            ]
        ]
    ];
    $response = $mj->post(Resources::$Email, ['body' => $body]);
    $response->success() && var_dump($response->getData());
}*/