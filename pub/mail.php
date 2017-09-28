<?php
header("Content-type: text/html; charset=utf-8");
if(isset($_POST['action']) && $_POST['action'] == 'submitform')

{
  
  $name = $_POST['name'];
  $tel = $_POST['phone'];
  $email = $_POST['email'];

  //
  $ip = gethostbyname($_SERVER['REMOTE_ADDR']); 

    $to = 'sgdin@yandex.ru';
    $subject = "Call form";
     
    //headers and subject
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Luckru <support@luckru.cu.uk>\r\n";
    
    $body = "New order<br />";
    $body .= "Name: ".$name."<br />";
    $body .= "Phone number: ".$phone."<br />";
    if(isset($_POST['email'])) { $body .= "Почта: ".$email."<br />"; }  
    $body .= "IP: ".$ip."<br />";
    
    $send = mail($to, $subject, $body, $headers);
    
    //ok message
    
   if ($send == 'true')
{ echo json_encode(array('success' => 1, 'id' => $code)); }else{ echo json_encode(array('success' => 0, 'text' => 'Не удалось отправить сообщение'));  }
   
}

?>