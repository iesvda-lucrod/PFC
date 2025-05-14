<?php
require __DIR__."/../../vendor/autoload.php";
require __DIR__."/../../config.php";
require_once __DIR__."/templates/confirmationEmail.php";

use \Mailjet\Resources;
function sendVerificationEmail($userData, $code) {
    try {
        $template = generateVerificationEmailTemplate($userData, $code);

        $mj = new \Mailjet\Client($_ENV['MJ_APIKEY_PUBLIC'], $_ENV['MJ_APIKEY_PRIVATE'],true,['version' => 'v3.1']);
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => 'iesvda.lucrod@gmail.com', // This should be a verified sender in Mailjet
                        'Name' => 'Syncro',
                    ],
                    'To' => [
                        [
                            'Email' => $userData['email'],
                            'Name' => $userData['username'],
                        ]
                    ],
                    'Subject' => 'Syncro - Confirm your email address',
                ] + $template 
            ]
        ];

        $response = $mj->post(Resources::$Email, ['body' => $body]);

        logError("Email sent, IS ok?".$response->success());

        if (!$response->success()) throw new ErrorException('Theres was a problem sending the email');
    } catch (Error $e) {
        logError('Error sending verification email: '.$e->getMessage());
    }
}

