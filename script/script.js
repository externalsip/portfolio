let textboxText = document.querySelector(".textbox__Text");
let textboxNext = document.querySelector(".textbox__Next");
let textbox = document.querySelector(".textbox");
let pageNum;
let projectIndex;
let projectSwap;
let currentPage;
let currentSlide;
let currentProject = document.querySelector(".swiperPortfolio");

let json, to;
const dialogData = './json/dialog.json';

// projects is the table in which all the dialog is held
// projectIndex is the index of the project currently being displayed
// projectSwap is the project currently being displayed
// dialog is the table in which the text is held
// currentPage is the page that is currently on screen 

const openBtn = document.getElementById("openPortfolio");
let mainScreen = document.querySelector(".titleScreen");
let vn = document.querySelector(".wrapper");

openBtn.addEventListener("click", () => {
	mainScreen.style.display = "none";
	vn.style.display = "block";
	initialize(json);
});

let returnBtn = document.querySelector(".returnBtn");

returnBtn.addEventListener("click", () => {
	mainScreen.style.display = "flex";
	vn.style.display = "none";
	pageNum = 0;
	projectIndex = 0;
	projectSwap = Object.keys(json.projects)[projectIndex];
	currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
});

async function grabData() {
	const resp = await fetch(dialogData);
	json = await resp.json();
	pageNum = 0;
	projectIndex = 0;
	projectSwap = Object.keys(json.projects)[projectIndex];
	currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
    initialize(json);
}

// INITIALIZE
// Function initialize handles wether text is currently being displayed or not to send the correct informations to typewritter when the user clicks.
let isTextDisplaying = false;
let stopText = false;

async function initialize(data) {
	if(isTextDisplaying == true){	
		textboxText.innerHTML = data.projects[projectSwap].dialog[currentPage].text;
		stopText = true;
	}
	else{
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
	  checkNext();
	  isTextDisplaying = false;
	  handleAnimation();
	}
	else{			
		isTextDisplaying = true;
		handleAnimation();
		if (currentWord < wordsArr.length) {
			//Reset state of fade animation
			fade.pause();			
			gsap.set(textboxNext, {opacity: 0});
			//Finds current word, how many characters said word has, then sets that value as "i" to then look at what character it currently has to write by looking at what is already there, then writes the character.
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
		checkNext();
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

//If the text stops displaying and the page is not the last in the chapter, the fade animation plays.
function checkNext(){
	if(json.projects[projectSwap].dialog[currentPage].hasOwnProperty('NextPage')) {
		if(json.projects[projectSwap].dialog[currentPage].NextPage == "End"){};
	}
	else{
		fade.play(0);
	}
}

let fade = gsap.to(textboxNext, {opacity: 1, duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut" });
fade.pause();

//Function manages clicks on the screen
let clickArea = document.querySelectorAll(".clickArea");
let buttonLast = document.querySelector(".buttonLast");
let buttonNext = document.querySelector(".buttonNext");

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
					manageModal(json);
					buttonLast.classList.remove("disabledBtn");
					buttonNext.classList.remove("disabledBtn");
					textbox.style.width = "70%";
					buttonLast.removeAttribute("disabled");
					buttonNext.removeAttribute("disabled");
				}
				else{
					pageNum++;
					currentPage = Object.keys(json.projects[projectSwap].dialog)[pageNum];
				}
				initialize(json);
			}
		}
	})
});

  //2 following event listeners manage what happens when you click on the button for the previous or next project in the list.


//Previous project
buttonLast.addEventListener("click", () => {
	isTextDisplaying = false;
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
	manageSlides(json);
	manageModal(json);
	initialize(json);
});

//Next project
buttonNext.addEventListener("click", () => {
	isTextDisplaying = false;
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
	manageSlides(json);
	manageModal(json);
	initialize(json);
});

// GSAP animations on spritesheets and the icon that fades in and out when there is a next slide.

let talk = gsap.to(".sprite__mouth", {backgroundPositionX: "-300%", ease: SteppedEase.config(3), duration: 0.5, repeat: -1});
let blink = gsap.to(".sprite__eyes", {backgroundPositionX: "-400%", ease: SteppedEase.config(4), duration: 0.2, repeat: -1, repeatDelay: 5});


talk.pause();
//Function handles the talking animation, if text is currently being displayed, the animation will loop, it resets when the text stops displaying.

function handleAnimation(){
	if(isTextDisplaying == true){
		talk.play();
	}
	else{
		talk.pause();
		gsap.set(".sprite__mouth", {backgroundPositionX: 0});
	}
}

//Swiper

var swiperPortfolio = new Swiper('.swiperPortfolio', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	slidesPerView: 1,
	navigation: {
        nextEl: ".swiperPortfolio__nextSlide",
        prevEl: ".swiperPortfolio__lastSlide",
      },
});
	
//Function manages the slides currently present in the swiper, everytime it is called, it starts by removing the slides currently in the slider.

//Content is the object in which the slides are contained inside of the json

//At first tried to create the slides manually, kinda worked but they couldnt figure out what order they were supposed to have, then learned there was a line built-in swiper.js to add slides, so I just used that instead.
let swipercontainer = document.getElementById("swiper-container");
let swipeBtn = document.querySelectorAll(".swiperPortfolio__button");

function manageSlides(data){
	swipercontainer.innerHTML = "";
	for(let i = 0; i < data.projects[projectSwap].length; i++){
		currentSlide = Object.keys(json.projects[projectSwap].content)[i];
		//const swipePage = document.createElement("div");
		//swipePage.classList.add("swiper-slide");
		if(data.projects[projectSwap].content[currentSlide].type == "video"){			
			swiperPortfolio.appendSlide(('<div class="swiper-slide")><iframe src= '+ data.projects[projectSwap].content[currentSlide].source +'</div>'));
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
	if(data.projects[projectSwap].length == 1){
		swipeBtn.forEach(element => element.style.display = "none");
	}
	else{
		swipeBtn.forEach(element => element.style.display = "block");
	}
}

//Function manages what is contained inside the modal, info changes depending on the project


function manageModal(data){
	let modalTitle = document.querySelector(".modal__title");
	let modalRole = document.querySelector(".modal__role");
	let modalDesc = document.querySelector(".modal__description");
	let softwareList = document.querySelector(".softwareList");
	let mediaList = document.querySelector(".mediaList");
	modalTitle.innerHTML = data.projects[projectSwap].modalContent.name;
	modalRole.innerHTML = data.projects[projectSwap].modalContent.role;
	modalDesc.innerText = data.projects[projectSwap].modalContent.desc;
	softwareList.innerHTML = "";
	mediaList.innerHTML = "";
	//loops on the elements present in the array software in the JSON
	for(let i = 0; i <= data.projects[projectSwap].modalContent.software.length - 1; i++){
		const li = document.createElement("li");
		li.classList.add("modal__list__element");
		const node = document.createTextNode(data.projects[projectSwap].modalContent.software[i]);
		li.appendChild(node);
		softwareList.appendChild(li);
	}
	//loops in steps of 2 on the elements present in the media array in JSON
	//This has to be the goofiest loop I've ever written, let me cook.
	for(let i = 0; i + 1 <= data.projects[projectSwap].modalContent.media.length; i = i + 2){
		const li = document.createElement("li");
		li.classList.add("modal__list__element");
		li.innerHTML = "<a href= '" + data.projects[projectSwap].modalContent.media[i + 1] + "'> "+ data.projects[projectSwap].modalContent.media[i] +" </a>";
		mediaList.appendChild(li);
	}
}

//Functions display and hide modal in main menu

let modalMainArea = document.querySelector(".modalMain__backdrop");
let infoMainBtn = document.querySelector("#openInfo");
let modalMainBtn = document.querySelector(".modalMain__btn");
let modalMain = document.querySelector(".modalMain");

modalMainArea.addEventListener("click", closeMainModal);
modalMainBtn.addEventListener("click", closeMainModal);

function closeMainModal(){
	gsap.timeline()
	.to(modalMain, {opacity: 0, duration: 0.5})
	.to(modalMainArea, {opacity: 0, duration: 0.5}, "<")
	.set(modalMain, {display: "none"})
	.set(modalMainArea, {display: "none"}, ">");
};

infoMainBtn.addEventListener("click", openMainModal);

function openMainModal(){
	gsap.timeline()
	.set(modalMain, {display: "flex"})
	.set(modalMainArea, {display: "block"}, "<")
	.to(modalMain, {opacity: 1, duration: 0.5})
	.to(modalMainArea, {opacity: 1, duration: 0.5}, "<");
}



//Functions display and hide modal in vn

let modalArea = document.querySelector(".modal__backdrop");
let infoBtn = document.querySelector(".swiperPortfolio__info");
let modalBtn = document.querySelector(".modal__btn");
let modal = document.querySelector(".modal");


modalArea.addEventListener("click", closeModal);
modalBtn.addEventListener("click", closeModal);

function closeModal(){
	gsap.timeline()
	.to(modal, {opacity: 0, duration: 0.5})
	.to(modalArea, {opacity: 0, duration: 0.5}, "<")
	.set(modal, {display: "none"})
	.set(modalArea, {display: "none"}, ">");
};

infoBtn.addEventListener("click", openModal);

function openModal(){
	gsap.timeline()
	.set(modal, {display: "flex"})
	.set(modalArea, {display: "block"}, "<")
	.to(modal, {opacity: 1, duration: 0.5})
	.to(modalArea, {opacity: 1, duration: 0.5}, "<");
}



//calls grabdata on execution of script, will most likely be modified later if I decide to make a title screen (would most likely be the best way to add the required info without it feeling forced)

grabData();