$(document).ready(function(){

	$('#main').hide();
	$('.secondary').hide();
	
	$('#start').click(function(){
		$('#main').show('slow')
		$('.secondary').show('slow')
		$(this).fadeOut('slow')
	});

	$('#phrase_form').submit(function(){
		
		evolution.userPhrase = document.getElementById("user_entry").value;
		evolution.generator(12);
		event.preventDefault(); // prevents submit from reloading page and reverting phrase text
	}); // ends submit.click
	
	var evolution = {
	
	
	
	
	}
	
	
	
	var matchMaker = {
	
	
	}