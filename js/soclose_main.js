$(document).ready(function(){

$('#main').hide();
$('.secondary').hide();
$('#howitworks').hide();
	
	
	$('#start').click(function(){
		$('#main').show('slow')
		$('.secondary').show('slow')
		$('#breeder_boxes').hide();
		$(this).fadeOut('slow')
	});
	
	$('#slower').click(function(){
		if(evolution.speedCounter > 50){
			evolution.speed*=2;
			evolution.speedCounter/=2;
			$('#speed').html('speed: '+evolution.speedCounter+'%');
		}
		
	});
	
	$('#faster').click(function(){
		if(evolution.speedCounter < 200){
			evolution.speed/=2;
			evolution.speedCounter*=2;
			$('#speed').html('speed: '+evolution.speedCounter+'%');
		}
		
	});

	$('#phrase_form').submit(function(){
	
		if(evolution.match=true){
			evolution.match=false;
			$('#breeders').html('<div id = "breeders"><ul id = "breeder_boxes"><li id = "breeder0">&nbsp</li><li id = "breeder1">&nbsp</li><li id = "breeder2">&nbsp</li><li id = "breeder3">&nbsp</li></ul><ul id = "seeds"></ul></div>');
		}
		evolution.generation=0;
		evolution.seedArray=[];
		evolution.coupleOne=[];
		evolution.coupleTwo=[];
		evolution.userPhrase='';
		evolution.userPhrase = document.getElementById("user_entry").value;
		generator(12);
		event.preventDefault(); // prevents submit from reloading page and reverting phrase text
	}); // ends submit.click
	
	$('#how').click(function(){
		$('#howitworks').toggle('slow');
		$('#howitworks #howcontent').load('how_it_works.html').hide.fadeIn(1000);
	});
	
	$('#close').click(function(){
		$('#howitworks').hide('slow');
	});
	
	$('#reset').click(function(){
		reset();
	});
	

var evolution = {
	userPhrase:'',
	generation:0,
	match:false,
	alphaArray:"abcdefghijklmnopqrstuvwxyz ",
	seedArray:[],
	coupleOne:[],
	coupleTwo:[],
	mutations:0,
	speed:1000,
	speedCounter:100
	
	
}; // ends evolution object

	var reset = function(){
		location.reload();
		
	};
	
	
	var getRandom = function(min,max) {
		var number = Math.floor(Math.random() * (max - min + 1)) + min;
		return number;
	};	
	
	var shuffle = function(array) { // Fisher-Yates algorithm
		var currentIndex = array.length
		, temporaryValue
		, randomIndex
		;

	// While there remain elements to shuffle...
		while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
  }

  return array;
}
	
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
		
			temp = (27-(temp));
			
			if(temp > 26){
				temp*=5;
			}else if(temp > 24){
				temp*=3;
			}else{
				temp*=2;
			}
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
		
	
		checkMatch(evolution.seedArray); // checks for match to phrase (
		
		$('#breeder_boxes').fadeIn('slow');
		
	};
	
	var sortSeeds = function(){ // might not need this as a separate function
		evolution.seedArray.sort(function(a, b){
			if(a.score < b.score)
				return 1;
			if(a.score > b.score)
				return -1;
			return 0;
		}); // sorts seed arrays by their score property
		
	};
	
	var checkMatch = function(array){ // looks for match and triggers display function
		('from checkMatch '+array);
		for(var i=0;i<array.length;i++){
		
			if(array[i].value.join('') == evolution.userPhrase){
				$('#breeders').html('<h2>match</h2></br><h2>'+array[i].value.join('')+'</h2>'+'<h2>('+array[i].name+')</h2>');
				evolution.match = true;
				$('#match').html('match:100%')
				$('#breeders h2').animate({ fontSize:"2.5em"},1000);
				return false;
			}else{
			
					
			} // end match check if
			
		} // end for loop
		
		evolution.generation++; // this might need to move
		$('#gen_count').html('generation:'+evolution.generation);
		displaySeeds(array);
		
		
	}; // ends checkMatch
	
	var matchMaker = function(array){ // selects four highest scoring phrases and sends them to breeder.
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
		//evolution.seedArray=[];

	}; // ends matchMaker function
	
	
	var breeder = function(couple){ // creates 'child' array based on value of couple passed by matchMaker function
		if(evolution.match == false){
		for(var i = 0;i<1200;i++){ // set initial variables, sixty children per parent couple.
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
				if(inheritance < 400){
					child.push(first);
				}else if(inheritance < 800){
					child.push(second);
				}else if(inheritance < 970){
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
					}else if(inheritLength < 98){
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
		
		if(evolution.seedArray.length > 1199){ // looking for existing children in seedArray
				var childName = 'gen'+evolution.generation+'seed'+(6+i);
				evolution.seedArray[(1200+i)] = new Seed(childName,child); // allows for a unique number for each seed
				
			}else{
			var childName = 'gen'+evolution.generation+'seed'+i;
			evolution.seedArray[i] = new Seed(childName,child);
		
			}
			
		} // ends for loop that sets number of children
		
		// if seedArray has full allotment of 2400 children then sort and feed into checkMatch function for next generation
			('array length '+evolution.seedArray.length);
			if(evolution.seedArray.length === 2400){
				
				if(evolution.generation<4200){ // sets limit of 4200 tries to evolve a match.  This is to avoid call stack issues
			//(evolution.seedArray[5]);
				//(evolution.seedArray);
				sortSeeds();
				evolution.seedArray.splice(12); // select best 12 seeds
				shuffle(evolution.seedArray); // shuffles best seeds for display purposes
				checkMatch(evolution.seedArray);
				}else{
				return;
				}
			}
		}	// ends match if
	}; // ends breeder function

	
	var displaySeeds = function(array){
		(evolution.seedArray);
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
			sortSeeds();
			for(j=0;j<array.length;j++){
				if(j<4){
					$('#breeder'+j).animate({color:"white"},evolution.speed/2);
				}else{
					$('#'+array[j].name).animate({color:"white"},evolution.speed/2);
				}
			}
			// get percentage match
			
			var userScore=(lengthScore(evolution.userPhrase)+charScore(evolution.userPhrase));
		
			var matchPercentage = (((evolution.seedArray[0].score) / userScore)*100).toFixed(2);
			
			
			$('#match').html('match: '+matchPercentage+'%');
			
		},evolution.speed*2);	
		
		setTimeout(function(){ // fade in new breeders fade out winner seeds
			
			for(k=0;k<evolution.seedArray.length;k++){
				if(k<4){
					$('#breeder'+k).html(evolution.seedArray[k].value);
					$('#breeder'+k).animate({color:"green"},evolution.speed/2);
				}
				
			}
			$('#seeds li').animate({color:"white"},evolution.speed/2);
		},evolution.speed*3);
		
		setTimeout(function(){ //call matchMaker function
			('from displaySeeds '+evolution.seedArray); 
			matchMaker(evolution.seedArray);
			
		},evolution.speed*4);
	}; // ends displaySeeds function
	
	
	
}); // ends document ready