$(document).ready(function(){

$('#main').hide();
	$('.secondary').hide();
	
	$('#start').click(function(){
		$('#main').show('slow')
		$('.secondary').show('slow')
		$('#breeder_boxes').hide();
		$(this).fadeOut('slow')
	});
	
	$('#slower').click(function(){
		speed*=1.5});
	
	$('#faster').click(function(){
		speed/=1.5});

	$('#phrase_form').submit(function(){
		
		userPhrase = document.getElementById("user_entry").value;
		generator(12);
		event.preventDefault(); // prevents submit from reloading page and reverting phrase text
	}); // ends submit.click
	
	var userPhrase='';
	var generation=0;
	var match=false;
	var alphaArray="abcdefghijklmnopqrstuvwxyz ";
	var seedArray=[];
	var coupleOne=[];
	var coupleTwo=[];
	var mutations=0;
	var speed=1000;
	

	
	
	var getRandom = function(min,max) {
		var number = Math.floor(Math.random() * (max - min + 1)) + min;
		return number;
	};	
	
	var lengthScore = function(array){
		var difference = ((userPhrase.length -1) - (array.length -1));
		if(difference < 0){
			difference *= -1;
		}	
		var lengthScore = 50 - (5*difference);
		return lengthScore;
	};
	
	var charScore = function(array){
		var charScore = 0;
		for(var i=0;i<userPhrase.length && i<array.length;i++){
			var userChar = alphaArray.indexOf(userPhrase.charAt(i));
			var seedChar = alphaArray.indexOf(array[i]);
			var temp = (userChar - seedChar);
			if(temp<0){
				temp *= -1;
			}
			temp = (27-(2*temp));
			charScore += temp;
		}
		
		return charScore;
	};
	
	var	Seed = function(name,value) {
		this.name = name;
		this.value = value;
		this.score = lengthScore(value) + charScore(value);
	}; // ends seed constructor
	
	var generator = function(number){ // makes 'number' of seed values for initial seedArray
		
		for(var i=0;i<number;i++){
			var seedling = [];
			var length = getRandom(1,50);
			for(var j=0;j<length;j++){  //creates seedling
				var random = getRandom(0,alphaArray.length);
				seedling.push(alphaArray.charAt(random));
			} // end seedling creation loop
			var seedName = 'gen'+generation+'seed'+i;
			seedArray[i] = new Seed(seedName,seedling);
		} // ends seed generation
		
	
		checkMatch(seedArray); // checks for match to phrase (
		
		$('#breeder_boxes').fadeIn('slow');
		
	};
	
	var sortSeeds = function(){ // might not need this as a separate function
		seedArray.sort(function(a, b){
			if(a.score < b.score)
				return 1;
			if(a.score > b.score)
				return -1;
			return 0;
		}); // sorts seed arrays by their score property
		
	};
	
	var checkMatch = function(array){ // looks for match and triggers display function
		console.log('from checkMatch '+array);
		for(var i=0;i<array.length;i++){
		
			if(array[i].value.join('') == userPhrase){
				console.log('MATCH: '+array[i].value.join(''));
				$('#seeds').html('<h2>MATCH</h2></br><h2>'+array[i].value.join('')+'</h2>');
				match = true;
				return false;
			}else{
				
					
			} // end match check if
			
		} // end for loop
		
		generation++; // this might need to move
		
		displaySeeds(array);
		
		
	}; // ends checkMatch
	
	var matchMaker = function(array){ // selects four highest scoring phrases and sends them to breeder.
		//sortSeeds(); shouldn't need this
		console.log('getting to matchMaker');
		
		array.splice(4);
		coupleOne=[]; //clears C1 for this generation
		coupleTwo=[]; //clears C2 for this generation
		
		while(array.length > 0){
			var chooser = getRandom(0,(array.length-1));
			if(array.length < 3){
				coupleOne.push(array[chooser]);
				array.splice(chooser,1);
			}else {
				coupleTwo.push(array[chooser]);
				array.splice(chooser,1);
			}
			
		}
		breeder(coupleOne);
		breeder(coupleTwo);
		//seedArray=[];

	}; // ends matchMaker function
	
	
	var breeder = function(couple){ // creates 'child' array based on value of couple passed by matchMaker function
		if(match == false){
		for(var i = 0;i<6;i++){ // set initial variables, six children per parent couple.
			var child = [];
			var stop = false;
			var j = 0;
			while(stop == false){
				
			//determines which character should be pushed to child array. Options are the corresponding value from parent 1, parent 2, a range of values between parent 1 and 2, or a random mutation
			
			//if a parent value check comes up false, value is inherited from the longer parent value.  Else determined by inheritance rules below
				if(couple[0].value[j]){ 
				var first = couple[0].value[j];
				}else if(couple[1].value[j]){
					var first = couple[1].value[j];
				} 
				
				if(couple[1].value[j]){
				var second = couple[1].value[j];
				}else if(couple[0].value[j]){
					var second = couple[0].value[j];
				}
				
			// set inheritance rules
				
				
				var inheritance = getRandom(1,1000);
				if(inheritance < 401){
					child.push(first);
				}else if(inheritance < 801){
					child.push(second);
				}else if(inheritance < 992){
					var range = getRandom(alphaArray.indexOf(first),alphaArray.indexOf(second));
					child.push(alphaArray.charAt(range));
				}else{
					mutations++;
					var mutation = getRandom(0,alphaArray.length);
					child.push(alphaArray.charAt(mutation));
				}
				
				// once inheritance has been carried out for all elements of value array from both parents, determines length of child array.  Similar to how character values are inherited.
				if(!couple[0].value[j] && !couple[1].value[j]){
					var inheritLength = getRandom(1,100)
					if(inheritLength < 41){
						child.splice(couple[0].value.length);
					}else if(inheritLength < 81){
						child.splice(couple[1].value.length);
					}else if(inheritLength < 99){
						var childLength = getRandom(couple[0].value.length,couple[1].value.length);
						child.splice(childLength);
					}else{
						var lengthMutation = getRandom(-5,5);
						if(lengthMutation>0){
							for(var k=0;k<lengthMutation;k++){
								child.push(alphaArray.charAt(getRandom(0,alphaArray.length)));
							}
						}else{
							child.splice(child.length + lengthMutation);
						}
					}
				
					stop = true;
				} 
				j++;
			} // ends while loop
		
		if(seedArray.length > 5){ // looking for existing children in seedArray
				var childName = 'gen'+generation+'seed'+(6+i);
				seedArray[(6+i)] = new Seed(childName,child); // allows for a unique number for each seed
				
			}else{
			var childName = 'gen'+generation+'seed'+i;
			seedArray[i] = new Seed(childName,child);
		
			}
			
		} // ends for loop that sets number of children
		
		// if seedArray has full allotment of 12 children then sort and feed into checkMatch function for next generation
			console.log('array length '+seedArray.length);
			if(seedArray.length === 12){
			
				if(generation<4200){ // sets limit of 4200 tries to evolve a match.  This is to avoid call stack issues
			//console.log(seedArray[5]);
				console.log(seedArray);
				checkMatch(seedArray);
				}else{
				return;
				}
			}
		}	// ends match if
	}; // ends breeder function

	
	var displaySeeds = function(array){
		console.log('from display 1'+seedArray);
		if(generation==1){
			$('#seeds').html('');
		}else{
			// $('#seeds li').html('&nbsp');
		}
	// begin setTimeout chain
	
		setTimeout(function(){ // fade in seeds
			for(var i=0;i<array.length;i++){
				$('#seeds').prepend('<li id="'+array[i].name+'">'+array[i].value.join('')+'</li>').css('color','white');
			}
			$('#seeds li').animate({color:"blue"},speed/2);
		},speed);
		
		setTimeout(function(){ // fadeout loser seeds, fade out old breeders
			
			for(j=0;j<array.length;j++){
				if(j<4){
					$('#breeder'+j).animate({color:"white"},speed/2);
				}else{
					$('#'+array[j].name).animate({color:"white"},speed/2);
				}
			}
		},speed*2);
		
		setTimeout(function(){ // fade in new breeders fade out winner seeds
			sortSeeds();
			for(k=0;k<seedArray.length;k++){
				if(k<4){
					$('#breeder'+k).html(seedArray[k].value);
					$('#breeder'+k).animate({color:"green"},speed/2);
				}
				
			}
			$('#seeds li').animate({color:"white"},speed/2);
		},speed*3);
		
		setTimeout(function(){ //call matchMaker function
			console.log('from display 2 '+seedArray); 
			matchMaker(seedArray);
			
		},speed*4);
	}; // ends displaySeeds function
	
	
	
}); // ends document ready