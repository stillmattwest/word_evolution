

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
	
	getRandom: function(min,max) {
		var number = Math.floor(Math.random() * (max - min + 1)) + min;
		return number;
	},
	
	display: function(array){
		for(var i=0;i<array.length;i++)
			$('#results').append('<div><p>'+array[i].name+':  '+array[i].value.join('')+', '+array[i].score+'</p></div>')
	}, // ends display method
	
	seedArray:[],
	
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
			for(j=0;j<length;j++){  //creates seedling
				var random = this.getRandom(1,this.alphaArray.length);
				seedling.push(this.alphaArray.charAt(random));
			} // end seedling creation loop
			var seedName = 'gen'+this.generation+'seed'+i;
			this.seedArray[i] = new this.Seed(seedName,seedling);
		} // ends seed generation
		this.display(this.seedArray);
	},
	
	Seed:function(name,value) {
		this.name = name;
		this.value = value;
		this.score = evolution.lengthScore(value) + evolution.charScore(value);
	} // ends seed constructor
	
	

}; // ends evolution object

var breeder = {
	spawn: function(number){
		for(var i=0;i < number;i++){
		
		}
	}
}; // ends breeder object



}); // ends document ready


