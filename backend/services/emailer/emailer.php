<?php
require __DIR__."/../../vendor/autoload.php";
require __DIR__."/../../config.php";
require_once __DIR__."/templates/verificationEmail.php";
require_once __DIR__."/templates/inviteEmail.php";
require_once __DIR__."/templates/passwordChangeEmail.php";
require_once __DIR__."/templates/contactEmail.php";

use \Mailjet\Resources;

function sendEmail($receiverEmail, $receiverName, $subject, $content) {
    try {
        $mj = new \Mailjet\Client($_ENV['MJ_APIKEY_PUBLIC'], $_ENV['MJ_APIKEY_PRIVATE'],true,['version' => 'v3.1']);
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "{$_ENV['SYNCRO_EMAIL']}", // This should be a verified sender in Mailjet
                        'Name' => 'Syncro',
                    ],
                    'To' => [
                        [
                            'Email' => $receiverEmail,
                            'Name' => $receiverName,
                        ]
                    ],
                    'Subject' => $subject,
                ] + $content 
            ]
        ];

        $response = $mj->post(Resources::$Email, ['body' => $body]);
        if (!$response->success()) throw new ErrorException('Theres was a problem sending the email');
    } catch (\Error $e) {
        logError($e);
        throw $e;
    }
    
}
function sendVerificationEmail($receiverData, $code) {
    $subject = 'Syncro - Confirm your email address';
    $template = generateVerificationEmailTemplate($receiverData, $code);
    sendEmail($receiverData['email'], $receiverData['username'], $subject, $template);
}

function sendInvitationEmail($senderData, $receiverData, $roomData, $code) {
    $subject = 'Syncro - Invitation to room';
    $template = generateInvitationEmailTemplate($senderData, $receiverData, $roomData, $code);
    sendEmail($receiverData['email'], $receiverData['username'], $subject, $template);
}

function sendPasswordResetEmail($receiverData, $code) {
    $subject = 'Syncro - Forgotten password';
    $template = generatePasswordChangeEmailTemplate($receiverData, $code);
    sendEmail($receiverData['email'], $receiverData['username'], $subject, $template);
}

//TODO send contact email
function sendContactEmail($name, $email, $userSubject, $userMessage) {
    $subject = 'Syncro - User contacted';
    $template = generateContactEmailTemplate($name, $email, $userSubject, $userMessage);
    sendEmail($_ENV['SYNCRO_EMAIL'], 'Syncro', $subject, $template);
}

