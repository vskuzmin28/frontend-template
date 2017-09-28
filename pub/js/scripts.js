// call popup

$('.call').click(function(){
	event.preventDefault();
	$('.popup-call').bPopup({
   	closeClass:'icon__close',
    	amsl: 0,
    	positionStyle: 'fixed',
    });	
});

// call popup

$('.call-policy').click(function(){
	event.preventDefault();
	$('.popup-policy').bPopup({
   	closeClass:'icon__close',
    	amsl: 0,
    	positionStyle: 'fixed',
    });	
});

// nav logics

$('.header__navigation li a').click(function(){
	$('.header__navigation li a').removeClass('header__navigation__link__active');
	$(this).addClass('header__navigation__link__active');		
});


// song one

$(function() {

  var $aud = $(".audio-1"),
      $pp  = $('.play-body-1'),
      $vol = $('.volume-1'),
      $bar = $(".progressbar-1"),
      AUDIO= $aud[0];
  
  AUDIO.volume = 0.75;
  AUDIO.addEventListener("timeupdate", progress, false);
  
  function progress() {
    $bar.slider('value', ~~(100/AUDIO.duration*AUDIO.currentTime));
  }

  $vol.slider( {
    value : AUDIO.volume*100,
    slide : function(ev, ui) {
      $vol.css({background:"hsla(180,"+ui.value+"%,50%,1)"});
      AUDIO.volume = ui.value/100; 
    } 
  });
   
  $bar.slider( {
    value : AUDIO.currentTime,
    slide : function(ev, ui) {
      AUDIO.currentTime = AUDIO.duration/100*ui.value;
    }
  });
  
  $pp.click(function() {
    return AUDIO[AUDIO.paused?'play':'pause']();
  });
  
});

$('.play-body-1').click(function(){
	//$('.play-body').removeClass('play');
	$(this).toggleClass('stop');
})

// song 2

$(function() {

  var $aud = $(".audio-2"),
      $pp  = $('.play-body-2'),
      $vol = $('.volume-2'),
      $bar = $(".progressbar-2"),
      AUDIO= $aud[0];
  
  AUDIO.volume = 0.75;
  AUDIO.addEventListener("timeupdate", progress, false);
  
  function progress() {
    $bar.slider('value', ~~(100/AUDIO.duration*AUDIO.currentTime));
  }

  $vol.slider( {
    value : AUDIO.volume*100,
    slide : function(ev, ui) {
      $vol.css({background:"hsla(180,"+ui.value+"%,50%,1)"});
      AUDIO.volume = ui.value/100; 
    } 
  });
   
  $bar.slider( {
    value : AUDIO.currentTime,
    slide : function(ev, ui) {
      AUDIO.currentTime = AUDIO.duration/100*ui.value;
    }
  });
  
  $pp.click(function() {
    return AUDIO[AUDIO.paused?'play':'pause']();
  });
  
});

$('.play-body-2').click(function(){
	//$('.play-body').removeClass('play');
	$(this).toggleClass('stop');
});

// google map

function init_map(){
	var myOptions = {zoom:12,center:new google.maps.LatLng(51.5073509,-0.20976929999998223),
		mapTypeId: google.maps.MapTypeId.ROADMAP};
		map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
		marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(51.5073509,-0.12775829999998223)});
		infowindow = new google.maps.InfoWindow({content:'<strong>Place</strong><br>London<br>'});

		google.maps.event.addListener(marker, 'click', function(){infowindow.open(map,marker);
	});
		infowindow.open(map,marker);}google.maps.event.addDomListener(window, 'load', init_map);

// scroll

var easeInQuad = new SmoothScroll('[data-easing="easeInQuad"]', {easing: 'easeInQuad'});

$('.send-form').submit(function() {
      $.post($(this).attr('action'), $(this).serialize(), function(res) {         
     if (res.success == 1) {
         $('#rise').bPopup().close();
           $('#okthanks').bPopup({
             closeClass:'сlose',
                 amsl: 0
            });
           setTimeout(function(){$('#okthanks').bPopup().close();}, 3000);
       }else{
       alert(res.text);
       }
    }, 'json');
    return false;
  })