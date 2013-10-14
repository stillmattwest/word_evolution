$(document).ready(function(){

var evolution = {
	userPhrase:'',
	generation:1;
	match:false,
	alphaArray:"abcdefghijklmnopqrstuvwxyz ",
	seedArray:[],
	couple:[],
	mutations:0,
	seedGenerations:[],
	breederGenerations:[],
	
	
}; // ends evolution object

var display = {
	var displaySeeds = function(array){
		
		
	},
	
	
	
}; //ends display object
	
	var getRandom = function(min,max) {
		var number = Math.floor(Math.random() * (max - min + 1)) + min;
		return number;
	};	
	
	var lengthScore = function(array){
		var difference = ((evolution.userPhrase.length -1) - (array.length -1));
		if(difference < 0){
			difference *= -1;
		}	
		var lengthScore = 100 - (6*difference);
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
		this.score = evolution.lengthScore(value) + evolution.charScore(value);
	}; // ends seed constructor
	
	var generator = function(number){ // makes 'number' of seed values for initial seedArray
		
		for(var i=0;i<number;i++){
			var seedling = [];
			var length = getRandom(1,100);
			for(var j=0;j<length;j++){  //creates seedling
				var random = getRandom(0,evolution.alphaArray.length);
				seedling.push(evolution.alphaArray.charAt(random));
			} // end seedling creation loop
			var seedName = 'gen'+evolution.generation+'seed'+i;
			evolution.seedArray[i] = new Seed(seedName,seedling);
		} // ends seed generation
		
	
		checkMatch(evolution.seedArray); // checks for match to phrase (yeah right) and from there seeds will follow a pattern of matchMaker --> breeder --> checkMatch until match is found.
		
		evolution.seedArray=[]; // clears seedArray for next generation
		
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
	
	var matchMaker = function(array){ // selects two highest scoring phrases and sends them to breeder.
		sortSeeds();
		evolution.seedGenerations.push(array);
		array.splice(2);
		evolution.couple=[]; //clears C1 for next generation
		evolution.couple.push(array);
		

		breeder(evolution.couple);

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
				}else if(inheritance < 995){
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
								child.push(evolution.alphaArray.charAt(evolution.getRandom(0,evolution.alphaArray.length)));
							}
						}else{
							child.splice(child.length + lengthMutation);
						}
					}
				
					stop = true;
				} 
				
				j++;
			} // ends while loop
			
			
		} // ends for loop that determines number of children
		
		// if seedArray has full allotment of 6 children then sort and feed into checkMatch function for next generation
		
		if(evolution.seedArray.length === 6){
			sortSeeds();
			if(evolution.generation<4200){ // sets limit of 4200 tries to evolve a match.  This is to avoid call stack issues
			matchMaker(evolution.seedArray);
			}else{
				return;
			}
			
			evolution.seedArray=[]; // clears seedArray for next generation
		}
		} // ends match if
	}, // ends breeder function
	
	var checkMatch = function(array){
	
		for(var i=0;i<array.length;i++){
	
			if(array[i].value.join('') == evolution.userPhrase){
				console.log('MATCH: '+array[i].value.join(''));
				evolution.match = true;
				return false;
			}else{
				evolution.generation++;
				matchMaker(array);
			}
		}
	}
}); // ends document ready