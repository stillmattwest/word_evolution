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
		evolution.speed*=1.5});
	
	$('#faster').click(function(){
		evolution.speed/=1.5});

	$('#phrase_form').submit(function(){
		
		evolution.userPhrase = document.getElementById("user_entry").value;
		generator(12);
		event.preventDefault(); // prevents submit from reloading page and reverting phrase text
	}); // ends submit.click

var evolution = {
	userPhrase:'',
	generation:1,
	match:false,
	alphaArray:"abcdefghijklmnopqrstuvwxyz ",
	seedArray:[],
	coupleOne:[],
	coupleTwo:[],
	mutations:0,
	speed:1000
	
	
}; // ends evolution object

	
	
	var getRandom = function(min,max) {
		var number = Math.floor(Math.random() * (max - min + 1)) + min;
		return number;
	};	
	
	var lengthScore = function(array){
		var difference = ((evolution.userPhrase.length -1) - (array.length -1));
		if(difference < 0){
			difference *= -1;
		}	
		var lengthScore = 50 - (5*difference);
		return lengthScore;
	};
	
	var charScore = function(array){
		var charScore = 0;
		for(var i=0;i<evolution.userPhrase.length && i<array.length;i++){
			var userChar = evolution.alphaArray.indexOf(evolution.userPhrase.charAt(i));
			var seedChar = evolution.alphaArray.indexOf(array[i]);
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
				var random = getRandom(0,evolution.alphaArray.length);
				seedling.push(evolution.alphaArray.charAt(random));
			} // end seedling creation loop
			var seedName = 'gen'+evolution.generation+'seed'+i;
			evolution.seedArray[i] = new Seed(seedName,seedling);
		} // ends seed generation
		
	
		checkMatch(evolution.seedArray); // checks for match to phrase (yeah right) and from there seeds will follow a pattern of matchMaker --> breeder --> checkMatch until match is found.
		
		evolution.seedArray=[]; // clears seedArray for next generation
		$('#breeder_boxes').fadeIn('slow');
		
	};
	
	var sortSeeds = function(array){ // might not need this as a separate function
		array.sort(function(a, b){
			if(a.score < b.score)
				return 1;
			if(a.score > b.score)
				return -1;
			return 0;
		}); // sorts seed arrays by their score property
		
		return array;
		
	};
	
	var checkMatch = function(array){ // looks for match and triggers display function
		// sortSeeds();
		for(var i=0;i<array.length;i++){
		
			if(array[i].value.join('') == evolution.userPhrase){
				console.log('MATCH: '+array[i].value.join(''));
				$('#seeds').html('<h2>MATCH</h2></br><h2>'+array[i].value.join('')+'</h2>');
				evolution.match = true;
				return false;
			}else{
				
					
			} // end match check if
			
		} // end for loop
		
		// this is where you segue into display, with a callback that sends code back to  matchMaker
		evolution.generation++; // this might need to move
		
		displaySeeds(array);
		
		
	}; // ends checkMatch
	
	var matchMaker = function(array){ // selects four highest scoring phrases and sends them to breeder.
		sortSeeds();
		array.splice(4);
		evolution.coupleOne=[]; //clears C1 for this generation
		evolution.coupleTwo=[]; //clears C2 for this generation
		
		while(array.length > 0){
			var chooser = getRandom(0,(array.length-1));
			if(array.length < 3){
				evolution.coupleOne.push(array[chooser]);
				array.splice(chooser,1);
			}else {
				evolution.coupleTwo.push(array[chooser]);
				array.splice(chooser,1);
			}
			
		}
	
		breeder(evolution.coupleOne);
		breeder(evolution.coupleTwo);

	}; // ends matchMaker function
	
	
	var breeder = function(couple){ // creates 'child' array based on value of couple passed by matchMaker function
		if(evolution.match == false){
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
					var range = getRandom(evolution.alphaArray.indexOf(first),evolution.alphaArray.indexOf(second));
					child.push(evolution.alphaArray.charAt(range));
				}else{
					evolution.mutations++;
					var mutation = getRandom(0,evolution.alphaArray.length);
					child.push(evolution.alphaArray.charAt(mutation));
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
								child.push(evolution.alphaArray.charAt(getRandom(0,evolution.alphaArray.length)));
							}
						}else{
							child.splice(child.length + lengthMutation);
						}
					}
				
					stop = true;
				} 
				j++;
			} // ends while loop
				
		if(evolution.seedArray.length > 5){ // looking for existing children in seedArray
				var childName = 'gen'+evolution.generation+'seed'+(6+i);
				evolution.seedArray[(6+i)] = new Seed(childName,child); // allows for a unique number for each seed
			}else{
			var childName = 'gen'+evolution.generation+'seed'+i;
			evolution.seedArray[i] = new Seed(childName,child);
			}
			
		} // ends for loop that sets number of children
		
		// if seedArray has full allotment of 6 children then sort and feed into checkMatch function for next generation
		
		if(evolution.seedArray.length === 12){
			if(evolution.generation<4200){ // sets limit of 4200 tries to evolve a match.  This is to avoid call stack issues
			checkMatch(evolution.seedArray);
			}else{
				return;
			}
			
			evolution.seedArray=[]; // clears seedArray for next generation
		}
		} // ends match if
	}; // ends breeder function
	
	var displaySeeds = function(array){
		var seedArray = evolution.seedArray;
		var that = this;
	
		if(evolution.generation==1){
			$('#seeds').html('');
		}else{
			// $('#seeds li').html('&nbsp');
		}
	// begin setTimeout chain
	
		setTimeout(function(){ // fade in seeds
			for(var i=0;i<array.length;i++){
				$('#seeds').prepend('<li id="'+array[i].name+'">'+array[i].value.join('')+'</li>').css('color','white');
			}
			$('#seeds li').animate({color:"blue"},evolution.speed/2);
		},evolution.speed);
		
		setTimeout(function(){ // fadeout loser seeds, fade out old breeders
			sortSeeds(array);
			for(j=0;j<array.length;j++){
				if(j<4){
					$('#breeder'+j).animate({color:"white"},evolution.speed/2);
				}else{
					$('#'+array[j].name).animate({color:"white"},evolution.speed/2);
				}
			}
		},evolution.speed*2);
		
		setTimeout(function(){ // fade in new breeders fade out winner seeds
			for(k=0;k<array.length;k++){
				if(k<4){
					$('#breeder'+k).html(seedArray[k].value);
					$('#breeder'+k).animate({color:"green"},evolution.speed/2);
				}
				
			}
			$('#seeds li').animate({color:"white"},evolution.speed/2);
		},evolution.speed*3);
		
		setTimeout(function(){ //call matchMaker function
			//console.log(array); // defined at this point
			matchMaker(array);
			
		},evolution.speed*4);
	}; // ends displaySeeds function
	
	
	
}); // ends document ready