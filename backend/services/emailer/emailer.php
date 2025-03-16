<?php //apikey:

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require '../../../vendor/autoload.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // OK response for OPTIONS request
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input);


    
    //this was used for debugging
    //$json_string = json_encode($data, JSON_PRETTY_PRINT);
    //file_put_contents("testfile.txt", $json_string);

    $name = $data->name;
    $senderMail = $data->email;
    $subject = $data->subject;
    $message = $data->message;




    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();                                            // Set mailer to use SMTP
        $mail->Host = 'smtp-relay.brevo.com';                        // Set Brevo's SMTP server
        $mail->SMTPAuth = true;                                       // Enable SMTP authentication
        $mail->Username = '8519cd001@smtp-brevo.com';                      // Your Brevo API key as the username
        $mail->Password = '3SxrYkKjR1nIyW0D';                      // Your Brevo API key as the password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;          // Enable TLS encryption
        $mail->Port = 587;                                           // TCP port to connect to (587 is recommended)

        // Debugging
        //$mail->SMTPDebug = 2;  // Level 2: Show client and server messages
        //file_put_contents("testfile.txt", $senderMail);  // <--- Logging to file

        // Recipients
        $mail->setFrom('iesvda.lucrod@gmail.com', 'Vivid Spaces Contact');                // Set the sender's email
        $mail->addAddress('iesvda.lucrod@gmail.com', 'Vivid Spaces');      // Add a recipient
        
        // Content
        $mail->isHTML(true);                                          // Set email format to HTML
        $mail->Subject = $subject;
        
        //Email body
        $mail->Body    = "<p>Message by $name with address $senderMail, an email has been sent to their address and they are awaiting a response.</p>
        <p><b>Subject:</b></p>
        <p>$subject</p>
        <p><b>Message:</b></p>
        <p>$message</p>";

        $mail->AltBody = "\n Message by $name with address $senderMail, and email has been sent to their address and they are awaiting a response. \n
        Subject:\n
        $subject\n
        Message:\n
        $message";

        $mail->send();



        //Send confirmation email to user
        $mail->clearAddresses();

        $mail->addAddress($senderMail, $name);      // Add a recipient
        $mail->isHTML(true);                                          // Set email format to HTML
        $mail->Subject = "Your email has been succesfully Sent";
        //Email body
        $mail->Body    = 
        "<p>Your email to contact Vivid Spaces support has been succesfully sent, a respnonse will soon be sent to this address.</p>
        <p>Your message:</p>
        <p><b>$subject</b><br>$message</p>";
        
        $mail->AltBody = "Your email to contact Vivid Spaces support has been succesfully sent, a respnonse will soon be sent to this address. \n\n
        Your message: \n
        $subject \n $message";

        $mail->send();
        echo json_encode(["result" => 'Message has been sent']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["result" => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }


}
