

$(document).ready(function(){

	$('#phrase_form').submit(function(){
		
		evolution.userPhrase = document.getElementById("user_entry").value;
		evolution.generator(12);
		return false; // prevents submit from reloading page and reverting phrase text
	
	}); // ends submit.click

var evolution = {

	userPhrase:'',
	generation:1,
	alphaArray:"abcdefghijklmnopqrstuvwxyz ",
	seedArray:[],
	coupleOne:[],
	coupleTwo:[],
	
	getRandom: function(min,max) {
		var number = Math.floor(Math.random() * (max - min + 1)) + min;
		return number;
	},
	
	display: function(array){
		for(var i=0;i<array.length;i++)
			$('#results').append('<div><p>'+array[i].name+':  '+array[i].value.join('')+', '+array[i].score+'</p></div>')
	}, // ends display method
	
	scoreIt: function(array,func){
		var score = func(array);
		return score;
	}, // ends scoreIt method note
	
	lengthScore: function(array){
		var lengthScore = 100 - (this.userPhrase.length - array.length);
		if(lengthScore < 0){
			lengthScore *= -1;
		}
		
		return lengthScore;
	},
	
	charScore:function(array){
		var charScore = 0;
		for(var i=0;i<this.userPhrase.length && i<array.length;i++){
			var userChar = this.alphaArray.indexOf(this.userPhrase.charAt(i));
			var seedChar = this.alphaArray.indexOf(array[i]);
			var temp = (userChar - seedChar);
			if(temp<0){
				temp *= -1;
			}
			temp = (27-temp);
			charScore += temp;
		}
		
		return charScore;
	},
	
	generator:function(number){ // makes 'number' of seed values for initial array
	
		
		for(var i=0;i<number;i++){
			var seedling = [];
			var length = this.getRandom(1,100);
			for(var j=0;j<length;j++){  //creates seedling
				var random = this.getRandom(1,this.alphaArray.length);
				seedling.push(this.alphaArray.charAt(random));
			} // end seedling creation loop
			var seedName = 'gen'+this.generation+'seed'+i;
			this.seedArray[i] = new this.Seed(seedName,seedling);
		} // ends seed generation
		
		this.seedArray.sort(function(a, b){
			if(a.score < b.score)
				return 1;
			if(a.score > b.score)
				return -1;
			return 0;
		}); // sorts the seed array by score property
		
		this.display(this.seedArray);
		this.matchMaker(this.seedArray);
		this.seedArray=[]; // clears seedArray for next generation
		
	},
	matchMaker:function(array){ // selects four best phrases and splits them at random into two couples and sends couples to breeder
		array.splice(4);
		this.generation++;
		while(array.length > 0){
			var chooser = this.getRandom(0,(array.length-1));
			if(array.length < 3){
				this.coupleOne.push(array[chooser]);
				array.splice(chooser,1);
			}else {
				this.coupleTwo.push(array[chooser]);
				array.splice(chooser,1);
			}
		}
		console.log(this.coupleOne);
		console.log(this.coupleTwo);
		this.breeder(this.coupleOne);
		this.breeder(this.coupleTwo);

	}, // ends matchMaker function
	
	breeder:function(couple){ // creates 'child' array based on value of couple passed by matchMaker function
		console.log(couple[0].value[0]);
		for(var i = 0;i<6;i++){ // set initial variables, six children per parent couple.
			console.log('I is in ur loop');
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
				var inheritance = this.getRandom(1,100);
				if(inheritance < 33){
					child.push(first);
				}else if(inheritance < 65){
					child.push(second);
				}else if(inheritance < 97){
					var range = this.getRandom(first,second);
					child.push(range);
				}else{
					var mutation = this.getRandom(1,this.alphaArray.length);
					child.push(this.alphaArray.charAt(mutation));
				}
				
				// once inheritance has been carried out for all elements of value array from both parents, determines length of child array.  Similar to how character values are inherited.
				if(!couple[0].value[j] && !couple[1].value[j]){
					var inheritLength = this.getRandom(1,100)
					if(inheritLength < 33){
						child.splice(couple[0].value.length);
					}else if(inheritLength < 65){
						child.splice(couple[1].value.length);
					}else if(inheritLength <97){
						var lengthRange = this.getRandom(couple[0].value.length,couple[1].value.length);
						child.splice(lengthRange);
					}else{
						var lengthMutation = this.getRandom(-10,10);
						if(lengthMutation>0){
							for(var k=0;k<lengthMutation;k++){
								child.push(this.alphaArray.charAt(this.getRandom(1,this.alphaArray.length)));
							}
						}else{
							child.splice(child.length + lengthMutation);
						}
					}
				
					stop = true;
				} 
				console.log(child.join());
				j++;
			} // ends while loop
			if(this.seedArray.length > 6){ // looking for existing children in seedArray
				var childName = 'gen'+this.generation+'seed'+(6+i);
				this.seedArray[6+i] = new this.Seed(childName,child);
			}else{
			var childName = 'gen'+this.generation+'seed'+i;
			this.seedArray[i] = new this.Seed(childName,child);
			}
		} // ends for loop that determines number of children
		
		// if seedArray has full allotment of 12 children then sort and display array, and feed into matchmaker function for next generation
		
		if(this.seedArray.length === 12){
			alert('display new generation '+this.generation); // temporary button
			this.seedArray.sort(function(a, b){
				if(a.score < b.score)
					return 1;
				if(a.score > b.score)
					return -1;
				return 0;
				}); // sorts the seed array by score property
			this.display(this.seedArray);
			this.matchMaker(this.SeedArray);
			this.seedArray=[]; // clears seedArray for next generation
		}
	}, // ends breeder function
	
	Seed:function(name,value) {
		this.name = name;
		this.value = value;
		this.score = evolution.lengthScore(value) + evolution.charScore(value);
	} // ends seed constructor

	

}; // ends evolution object




}); // ends document ready


