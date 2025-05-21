<?php

function generateInvitationEmailTemplate($senderData, $receiverData, $roomData, $code) {
  return [
      'TextPart' => "Hello, ".$receiverData['username']."\n
      You have been invited by {$senderData['username']} to join the room: {$roomData['name']}!\n
      Join the room with the following link:\n
      http://{$_ENV['SERVER_URL']}/verify-email?room={$roomData['id']}&user={$receiverData['id']}code=$code\n",

      'HTMLPart' => <<<EOD
      <div style="
      max-width:400px;
      font-family:Verdana, Geneva, sans-serif;
      padding:10px 40px;
      border: 2px solid #2070f0;
      border-radius: 20px;
      text-align:center;
      ">
          <h2 style="width:100%;text-align:center;">Hello {$receiverData['username']}</h2>
          <p><b>{$senderData['username']}</b> has invited you to join the room: {$roomData['name']}!</p>
          <p>Join the room with the following link:</p>
          <p style="padding:5px;"><a style="
          padding:10px;
          background-color: #2070f0;
          border-radius: 20px;
          color: #eeeeee;
          font-size:large;
          font-weight:bold;
          text-decoration:none;
          "
          href="http://{$_ENV['SERVER_URL']}/accept-invitation?room={$roomData['id']}&user={$receiverData['id']}&code=$code">Join room</a></p>
      </div>
      EOD
  ];
}