$(document).ready(function(){

	var userPhrase ='';
	
	var updatePhrase = function(phrase){
		$('#result_text').html('<p>Your phrase is <strong>"'+phrase+'"</strong></p>');
		
	};
	
	var alphaArray ="abcdefghijklmnopqrstuvwxyz ";
	
	var phraseArray = [];
	
	var makeArray = function(phrase){
		
		phraseArray=[];
		for(i=0;i<phrase.length;i++){
			phraseArray.push(phrase.charAt(i));
			
		}
		updatePhrase(phrase);
		makeCandidate.showContent();
		makeCandidate.getScore();
	};
	
	var getRandom = function(min,max) {
		var number = Math.floor(Math.random() * (max - min + 1)) + min;
		return number;
	};
	
	var scoreIt = function(num1,num2){
		var result = num1 - num2;
		if(result < 0){
			result *= -1;
		}
		return result;
	};
		
		
	$('#phrase_form').submit(function(){
		
		userPhrase = document.getElementById("user_entry").value;
		makeArray(userPhrase);
		return false; // prevents submit from reloading page and reverting phrase text
	
	}); // ends submit.click
	
	var makeCandidate = {
		ranLength: getRandom(1,100),
		content:[],
		fillArray: function(){
			for(i=0;i<this.ranLength;i++){
			var random = getRandom(1,alphaArray.length);
			this.content.push(alphaArray.charAt(random));
			}
		},
	
		showContent: function(){
			this.fillArray();
			var joinedContent = this.content.join('');
			$('#results').append('<p>The gene seed is '+joinedContent+'</p>')
			
		},
		
		getCharScore: function(){
				var score = 0;
				for(i=0;i<userPhrase.length;i++){
					userChar = userPhrase.charAt(i);
					canChar = makeCandidate.content[i];
					if(userChar === canChar){
						score += 10;
					}
				}
				return score;
		},
		
		
		getScore: function() {
			var lengthScore = scoreIt(this.content.length,userPhrase.length)
			
		
			
			var charScore = this.getCharScore();
			
			
			console.log('length score is ' +lengthScore);
			console.log('char score is ' +charScore);
			console.log('total score is '+(lengthScore+charScore));
		
		}
		
	
	};		
				
		
	

}); // ends document.ready
