let textboxText = document.querySelector(".textboxText");
let textbox = document.querySelector(".textbox");
let pageNum = 0;
let projectIndex = 0;
let projectSwap;
let currentPage;
let currentSlide;
let currentProject = document.querySelector(".swiperPortfolio");
let clickArea = document.querySelectorAll(".clickArea");
let buttonLast = document.querySelector(".buttonLast");
let buttonNext = document.querySelector(".buttonNext");
let swipercontainer = document.getElementById("swiper-container");
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
		if(data.projects[projectSwap].content != null){			
			currentProject.style.display = "block";
			
		}
		else{
			currentProject.style.display = "none";
		}
		stopText = false;
		typeWriter(data.projects[projectSwap].dialog[currentPage].text);
	}
}

// TYPEWRITTER
// Typewritter takes the text from initialize and makes it display one character at a time in the textbox. If it sees that the next word to be displayed will go over the limits of the textbox, it skips a line.
//This function was made with the assistance of AI, my stance on AI is that as long as you dont use it without ever trying to understand what you were asking it to do, its a useful tool, although it has to stay a tool.

function typeWriter(txt, i, wordsArr, currentWord) {
	i = i || 0;
	wordsArr = wordsArr || txt.split(' ');
	currentWord = currentWord || 0;
  
	if (!i) {
		textboxText.innerHTML = '';
	  	clearTimeout(to);
	}
  
	var speed = 50; /* The speed at which characters appear*/
  
	if (stopText === true) {
	  i = wordsArr.length;
	  isTextDisplaying = false;
	  handleAnimation();
	}
	else{			
		isTextDisplaying = true;
		handleAnimation();
		if (currentWord < wordsArr.length) {

			var word = wordsArr[currentWord];
	  		var charsToShow = i > word.length ? word.length : i;
	  		var visibleWord = word.slice(0, charsToShow);
			textboxText.innerHTML = wordsArr.slice(0, currentWord).join(' ') + ' ' + visibleWord;
  
	  //Check if the text overflows the container
	  var textContainer = textbox;
	  if (textContainer.scrollHeight > textContainer.clientHeight) {
		//If overflowed, remove the last character and stop the typing for the current word
		visibleWord = word.slice(0, charsToShow - 1);
		textboxText.innerHTML = wordsArr.slice(0, currentWord).join(' ') + ' ' + visibleWord;
		isTextDisplaying = false;
		handleAnimation();
		return;
	  }
  
	  if (i >= word.length) {
		i = 0;
		currentWord++;
	  }
	  //Timeout makes it so every character dosent appear on the same frame.
	  to = setTimeout(function() {
		typeWriter(txt, i + 1, wordsArr, currentWord);
	  }, speed);
	} 
	else {
		isTextDisplaying = false;
		handleAnimation();
	}
	}
	
  }

  //Function verifies if the current page is the last one of the chapter, so it dosent keep rolling new ones that dont exist.

  function checkPage(data){
	if(data.projects[projectSwap].dialog[currentPage].hasOwnProperty('NextPage')) {
		if(data.projects[projectSwap].dialog[currentPage].NextPage == "End") return false;
	}
	
	return true;
}

//Function manages clicks on the screen

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
					manageSlides(json);
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
		manageSlides(json);
	}
	else{
		pageNum = 0;
		projectIndex--;
		projectSwap = Object.keys(json.projects)[projectIndex];
		currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
		manageSlides(json);
	}
	initialize(json);
});

buttonNext.addEventListener("click", () => {
	if(projectIndex == 4){
		pageNum = 0;
		projectIndex = 1;
		projectSwap = Object.keys(json.projects)[projectIndex];
		currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
		manageSlides(json);
	}
	else{
		pageNum = 0;
		projectIndex++;
		projectSwap = Object.keys(json.projects)[projectIndex];
		currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
		manageSlides(json);
	}
	initialize(json);
});

let talk = gsap.to(".sprite__mouth", {backgroundPositionX: "-45vw", ease: SteppedEase.config(3), duration: 0.5, repeat: -1});
let blink = gsap.to(".sprite__eyes", {backgroundPositionX: "-60vw", ease: SteppedEase.config(4), duration: 0.2, repeat: -1, repeatDelay: 5});

talk.pause();

function handleAnimation(){
	if(isTextDisplaying == true){
		talk.play();
	}
	else{
		talk.pause();
		gsap.set(".sprite__mouth", {backgroundPositionX: 0});
	}
}

var swiperPortfolio = new Swiper('.swiperPortfolio', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	autoplay: {
		delay:2500,
		disableOnInteraction: false,
		pauseOnMouseEnter: true,
	},
	slidesPerView: 1,
});
	
//Function manages the slides currently present in the swiper, everytime it is called, it starts by removing the slides currently in the slider.

//Content is the object in which the slides are contained inside of the json

function manageSlides(data){
	swipercontainer.innerHTML = "";
	for(let i = 0; i < data.projects[projectSwap].length; i++){
		currentSlide = Object.keys(json.projects[projectSwap].content)[i];
		//const swipePage = document.createElement("div");
		//swipePage.classList.add("swiper-slide");
		if(data.projects[projectSwap].content[currentSlide].type == "video"){			
			swiperPortfolio.appendSlide(('<div class="swiper-slide")><iframe loading="lazy" src= '+ data.projects[projectSwap].content[currentSlide].source +'</div>'));
			//swipePage.style.backgroundImage = "url('" + data.projects[projectSwap].content[currentSlide].source + "')";
			//swipercontainer.appendChild(swipePage);
		}
		else{
			swiperPortfolio.appendSlide(('<div class="swiper-slide" style= "background-image: url('+ data.projects[projectSwap].content[currentSlide].source +');"></div>'));
			//const video = document.createElement("iframe");
			//video.setAttribute("src", data.projects[projectSwap].content[currentSlide].source);
			//swipePage.appendChild(video);
			//swipercontainer.appendChild(swipePage);
		}
	}
}

grabData();