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
        <h2 style="width:100%;text-align:center;">A user has contacted us:</h2>
        <h3>-- User information --</h3>
        <p><b>Name:</b> {$name}</p>
        <p><b>Email:</b> {$email}</p>

        <h3>-- Contact details --</h3>
        <p><b>Subject:</b> {$subject}</p>
        <p><b>Message:</b></p>
        <p style="text-align:justify;border:1px solid black;padding:4px;">{$message}</p>
      </div>
      EOD
  ];
}