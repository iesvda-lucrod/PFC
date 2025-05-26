<?php

function generatePasswordChangeEmailTemplate($userData, $code) {
  return [
      'TextPart' => "Hello, ".$userData['username']."\n
      Change your current password with the following link:\n
      http://{$_ENV['SERVER_URL']}/verify-email?email=".$userData['email']."&code=$code\n
      If you did not make this request, please ignore this email.\n
      ",

      'HTMLPart' => <<<EOD
      <div style="
      max-width:400px;
      font-family:Verdana, Geneva, sans-serif;
      padding:10px 40px;
      border: 2px solid #2070f0;
      border-radius: 20px;
      text-align:center;
      ">
          <h2 style="width:100%;text-align:center;">Hello {$userData['username']}</h2>
          <p>Change your current password with the following link:</p>
          <p style="padding:5px;"><a style="
          padding:10px;
          background-color: #2070f0;
          border-radius: 20px;
          color: #eeeeee;
          font-size:large;
          font-weight:bold;
          text-decoration:none;
          "
          href="http://{$_ENV['SERVER_URL']}/change-password?user={$userData['id']}&code={$code}">Change password</a></p>
          <p>If you did not make this request, please ignore this email.</p>
      </div>
      EOD
  ];
}