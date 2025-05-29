<?php

function generateContactEmailTemplate($name, $email, $subject, $message) {
  return [
      'TextPart' => "A user has contacted us.\n
      User information:\n
      Name: $name\n
      Email:$email\n
        \n
      Content:\n
      Subject: $subject\n
      Message:\n
      $message\n",

      'HTMLPart' => <<<EOD
      <div style="
      max-width:400px;
      font-family:Verdana, Geneva, sans-serif;
      padding:10px 40px;
      border: 2px solid #2070f0;
      border-radius: 20px;
      text-align:center;
      ">
        <h2 style="width:100%;text-align:center;">A user has contacted us</h2>
        <p>User information</p>
        <ul>
        <li><b>Name:</b> {$name}</li>
        <li><b>Email:</b> {$email}</li>
        </ul>

        <p><b>Subject:</b> {$subject}</p>
        <p><b>Message:</b></p>
        <p>{$message}</p>
      </div>
      EOD
  ];
}