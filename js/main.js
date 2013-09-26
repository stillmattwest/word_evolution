$(document).ready(function(){

	var userPhrase ='';
	
	var updatePhrase = function(phrase){
		$('#result_text').html('<p>'+phrase+'</p>');
		console.log(phraseArray);
	};
	
	var phraseArray = [];
	
	var makeArray = function(phrase){
		
		for(i=0;i<phrase.length;i++){
			phraseArray.push(phrase.charAt(i));
			
		}
		updatePhrase(phrase);
	};
		
	$('#phrase_form').submit(function(){
		
		userPhrase = document.getElementById("user_entry").value
		
		makeArray(userPhrase);
		return false; // prevents submit from reloading page and reverting phrase text
	
	}); // ends submit.click
	
	

}); // ends document.ready
