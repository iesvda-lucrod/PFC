<?php
/*
This call sends a message to one recipient.
*/
echo "e1";
require __DIR__.'../../../vendor/autoload.php';
echo "e2";

require __DIR__.'../../config.php';
echo "e3";
echo "e3";
use \Mailjet\Resources;
function sendEmail() {
    $mj = new \Mailjet\Client(getenv('MJ_APIKEY_PUBLIC'), getenv('MJ_APIKEY_PRIVATE'),true,['version' => 'v3.1']);
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
}