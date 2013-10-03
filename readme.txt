Word Evolution

The function of this JavaScript app is as follows:

	1) The user will enter a random word or phrase up to 100 characters long.  This can be comprised of any combination of letters and spaces.
	2) The app will then generate ten random 'phrases' from 1 - 100 characters in length.  Each phrase will be comprised of a random selection of characters of the same types as the user given phrase.
	3) The app will then compare these random phrases to the user's phrase, and assign a score as follows.
	
			Length Score = 200 - the difference between the random length and the user length.
			Match Score = 10 points per exact character match.  Character must match in both type and position.
			Total Score = length score plus match score
			
	4) The four highest scoring randoms will be "crossbred" forming two couples.  Each couple will have six descendants, forming a new group of 12 candidates.  
	
		"genes" will be passed on like so:
				
				1) If either parent has an exact length match, it will pass down.  If not, the length property will be inherited from a random "parent."  Length has a 5% chance of mutating by 1-10 characters each generation.
				2) If there is an exact character match, that character will pass down to descendants.  If a character is not an exact match, the new character will either be either of the parent's value, determined at random.  
				3) All characters will have a 5% chance of 'mutating' to a random character each generation.
				4) This process will repeat for each descendent, so the descendants will not be clones, but should be obviously "related" with similar traits.
				
	5) the selection function will run on each new generation of descendants, until an exact match of the phrase is reached.  A generation count will be kept showing how many generations it takes to go from completely random phrase to an exact match of the given phrase.  The hypothesis is that it won't take very many.  