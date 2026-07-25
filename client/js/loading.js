console.log("LOADING SCRIPT RUNNING");
const loadingMessages=[
    "Preparing your soundtrack...",
    "Every story deserves a soundtrack.",
    "Somewhere, a melody is waiting.",
    "Good music takes a moment.",
    "The next song is worth the wait."
];
const loadingScreen=document.getElementById("loading-screen");
const loadingMessage=document.getElementById("loading-message");
console.log("Message element:", loadingMessage);
loadingMessage.textContent=
loadingMessages[
    Math.floor(Math.random()*loadingMessages.length)
];
console.log("Message:", loadingMessage.textContent);

fetch(`${API_BASE}/ping`)
.then(()=>{

    console.log("Backend awake");

    loadingScreen.classList.add("hidden");

})
.catch(err=>{

    console.error("Ping failed:",err);
    
    loadingMessage.textContent=
    "Unable to connect. Please try again.";

});