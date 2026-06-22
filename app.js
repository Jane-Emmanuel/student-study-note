let allLessons = [];

fetch("notes.json")

.then(response => response.json())

.then(data => {

displayCourses(data.courses);

});

function displayCourses(courses){

const container =
document.getElementById("coursesContainer");

container.innerHTML = "";

courses.forEach(course=>{

const courseCard =
document.createElement("div");

courseCard.className =
"course-card";

let html = `

<div class="course-header">

<h2>${course.course}</h2>

<span>▼</span>

</div>

<div class="course-content">

`;
course.lessons.forEach(lesson=>{

allLessons.push({
course: course.course,
title: lesson.title,
content: lesson.content
});

html += `

<div class="lesson">

<div class="lesson-header">

<h3>${lesson.title}</h3>

<span>▼</span>

</div>

<div class="lesson-content-wrapper">

<button onclick="readText(\`${lesson.content}\')">

🔊 Read Aloud

</button>

<div class="lesson-content">

${lesson.content}

</div>

`;

lesson.audio.forEach((audio,index)=>{

html += `

<p>🎧 Audio Part ${index + 1}</p>

<audio controls>
<source src="${audio}">
</audio>

`;

});

html += `

</div>

</div>

`;

});




courseCard.innerHTML = html;

container.appendChild(courseCard);

});

attachAccordion();
}

function attachAccordion(){

document
.querySelectorAll(".course-header")
.forEach(header=>{

header.addEventListener("click",()=>{

const content =
header.nextElementSibling;

content.classList.toggle("show");

});

});

document
.querySelectorAll(".lesson-header")
.forEach(header=>{

header.addEventListener("click",()=>{

const content =
header.nextElementSibling;

content.classList.toggle("show");

});

});

}

function readText(text){

speechSynthesis.cancel();

const speech =
new SpeechSynthesisUtterance(text);

speech.rate = 1;

speech.pitch = 1;

speech.volume = 1;

speechSynthesis.speak(speech);

}

const darkBtn =
document.getElementById("darkModeBtn");

darkBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

localStorage.setItem(
"theme",
document.body.classList.contains("dark")
);

});

if(localStorage.getItem("theme")==="true"){

document.body.classList.add("dark");

}

document
.getElementById("searchInput")
.addEventListener("keyup",function(){

const search =
this.value.toLowerCase();

document
.querySelectorAll(".lesson-card")
.forEach(card=>{

card.style.display =
card.innerText.toLowerCase()
.includes(search)
? "block"
: "none";

});

});

if("serviceWorker" in navigator){

navigator.serviceWorker
.register("sw.js");

}

const floatingSearch =
document.getElementById("floatingSearch");

const searchModal =
document.getElementById("searchModal");

const quickSearch =
document.getElementById("quickSearch");

const results =
document.getElementById("searchResults");

const closeSearch =
document.getElementById("closeSearch");

floatingSearch.onclick = ()=>{

searchModal.style.display="block";

quickSearch.focus();

};

closeSearch.onclick = ()=>{

searchModal.style.display="none";

};

quickSearch.addEventListener("keyup",()=>{

const keyword =
quickSearch.value.toLowerCase();

results.innerHTML="";

if(keyword==="") return;

const matches =
allLessons.filter(item =>

item.title.toLowerCase().includes(keyword)

||

(item.content || "")
.toLowerCase()
.includes(keyword)

);
matches.forEach(item=>{

const div =
document.createElement("div");

div.className =
"result-item";

div.innerHTML = `

<strong>${item.title}</strong>

<br>

${item.course}

`;

div.onclick = ()=>{

document
.querySelectorAll(".course-header")
.forEach(header=>{

if(
header.innerText.includes(item.course)
){

header.click();

}

});

document
.querySelectorAll(".lesson-header")
.forEach(header=>{

if(
header.innerText.includes(item.title)
){

header.click();

header.scrollIntoView({
behavior:"smooth"
});

}

});

searchModal.style.display =
"none";

};

results.appendChild(div);

});

});