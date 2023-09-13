let textboxText = document.querySelector(".textboxText");
let textbox = document.querySelector(".textbox");
let pageNum = 0;
let projectIndex = 0;
let projectSwap;
let currentPage;
let currentProjectImg = document.getElementById("currentProject");
let clickArea = document.querySelectorAll(".clickArea");
let buttonLast = document.querySelector(".buttonLast");
let buttonNext = document.querySelector(".buttonNext");
let json, to;
const dialogData = './json/dialog.json';

// projects is the table in which all the dialog is held
// projectIndex is the index of the project currently being displayed
// projectSwap is the project currently being displayed
// dialog is the table in which the text is held
// currentPage is the page that is currently on screen 

async function grabData() {
	const resp = await fetch(dialogData);
	json = await resp.json();
	projectSwap = Object.keys(json.projects)[projectIndex];
	currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
    initialize(json);

}

// INITIALIZE
// initialize receives the information from the grabdata and either 
let isTextDisplaying = false;
let stopText = false;

async function initialize(data) {
	if(isTextDisplaying == true){	
		textboxText.innerHTML = data.projects[projectSwap].dialog[currentPage].text;
		stopText = true;
	}
	else{
		console.log("clicked");
		if(data.projects[projectSwap].projectImg != "none"){			
			currentProjectImg.style.display = "block";
			currentProjectImg.style.backgroundImage = "url('"+ data.projects[projectSwap].projectImg + "')";
		}
		else{
			currentProjectImg.style.display = "none";
		}
		stopText = false;
		typeWriter(data.projects[projectSwap].dialog[currentPage].text);
	}
}

// TYPEWRITTER
// Typewritter takes the text from initialize and makes it display one character at a time in the textbox.


function typeWriter(txt, i, wordsArr, currentWord) {
	i = i || 0;
	wordsArr = wordsArr || txt.split(' ');
	currentWord = currentWord || 0;
  
	if (!i) {
		textboxText.innerHTML = '';
	  	clearTimeout(to);
	}
  
	var speed = 30; /* The speed/duration of the effect in milliseconds */
  
	if (stopText === true) {
	  i = wordsArr.length;
	  isTextDisplaying = false;
	}
	else{			
		isTextDisplaying = true;
		if (currentWord < wordsArr.length) {

			var word = wordsArr[currentWord];
	  		var charsToShow = i > word.length ? word.length : i;
	  		var visibleWord = word.slice(0, charsToShow);
			textboxText.innerHTML = wordsArr.slice(0, currentWord).join(' ') + ' ' + visibleWord;
  
	  // Check if the text overflows the container
	  var textContainer = textbox;
	  if (textContainer.scrollHeight > textContainer.clientHeight) {
		// If overflowed, remove the last character and stop the typing for the current word
		visibleWord = word.slice(0, charsToShow - 1);
		textboxText.innerHTML = wordsArr.slice(0, currentWord).join(' ') + ' ' + visibleWord;
		isTextDisplaying = false;
		return;
	  }
  
	  if (i >= word.length) {
		i = 0;
		currentWord++;
	  }
  
	  var charDelay = speed;
	  if (i === 0) {
		// Add a delay before starting the next word
		charDelay = speed * 7;
	  }

  
	  to = setTimeout(function() {
		typeWriter(txt, i + 1, wordsArr, currentWord);
	  }, charDelay);
	} else {
		isTextDisplaying = false;
	}
	}
	
  }

  function checkPage(data){
	if(data.projects[projectSwap].dialog[currentPage].hasOwnProperty('NextPage')) {
		if(data.projects[projectSwap].dialog[currentPage].NextPage == "End") return false;
	}
	
	return true;
}

  clickArea.forEach((element) => {
	element.addEventListener("click", () => {
		if(isTextDisplaying == true){
			initialize(json);
		}
		else{
			if(!json) return;
			if(checkPage(json)){
				if(json.projects[projectSwap].dialog[currentPage].hasOwnProperty('swap')){
					pageNum = 0;
					projectIndex = 1;
					projectSwap = Object.keys(json.projects)[projectIndex];
					currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
				}
				else{
					console.log("click");
					pageNum++;
					currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
				}
					initialize(json);
			}
		}
	})
  });

buttonLast.addEventListener("click", () => {
	if(projectIndex == 1){
		pageNum = 0;
		projectIndex = 4;
		projectSwap = Object.keys(json.projects)[projectIndex];
		currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
	}
	else{
		pageNum = 0;
		projectIndex--;
		projectSwap = Object.keys(json.projects)[projectIndex];
		currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
	}
	initialize(json);
});

buttonNext.addEventListener("click", () => {
	if(projectIndex == 4){
		pageNum = 0;
		projectIndex = 1;
		projectSwap = Object.keys(json.projects)[projectIndex];
		currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
	}
	else{
		pageNum = 0;
		projectIndex++;
		projectSwap = Object.keys(json.projects)[projectIndex];
		currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
	}
	initialize(json);
});


grabData();