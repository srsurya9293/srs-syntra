const loadingMessages=[
    "Preparing your soundtrack...",
    "Every story deserves a soundtrack.",
    "Somewhere, a melody is waiting.",
    "Good music takes a moment.",
    "The next song is worth the wait."
];

const loadingScreen=
document.getElementById("loading-screen");

const loadingMessage=
document.getElementById("loading-message");

let messageIndex=
Math.floor(Math.random()*loadingMessages.length);

loadingMessage.textContent=
loadingMessages[messageIndex];

const messageInterval=setInterval(()=>{
    messageIndex++;
    if(messageIndex>=loadingMessages.length)
        messageIndex=0;

    loadingMessage.textContent=
    loadingMessages[messageIndex];
},5000);


fetch(`${API_BASE}/ping`)
.then(()=>{
    clearInterval(messageInterval);
    loadingScreen.classList.add("hidden");
})
.catch(()=>{
    clearInterval(messageInterval);
    loadingScreen.classList.add("hidden");
});