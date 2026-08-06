const loadingMessages=[
    "Preparing your soundtrack...",
    "Every story deserves a soundtrack.",
    "Somewhere, a melody is waiting.",
    "Good music takes a moment.",
    "The next song is worth the wait.",    
    "Every story deserves a soundtrack.",
    "Somewhere, a melody is waiting.",
    "Good music takes a moment.",
    "The next song is worth the wait.",
    "Every beat has a story.",
    "Music begins in silence.",
    "Welcome back. Let's make some noise.",
    "Your soundtrack is almost ready.",
    "Let's find today's soundtrack.",
    "Ready when you are.",
    "Your music is on its way.",
    "Great music is worth waiting for.",
    "Let's make today sound better.",
    "The next chapter starts with a song.",
    "Press play on something memorable."
];

const loadingScreen=
document.getElementById("loading-screen");

const loadingMessage=
document.getElementById("loading-message");

const loadingLogo=
document.querySelector(".loading-logo");

loadingLogo.addEventListener("timeupdate",()=>{
    if(
        loadingLogo.duration &&
        loadingLogo.currentTime >= loadingLogo.duration-0.5 &&
        !loadingLogo.dataset.fading
    ){
        loadingLogo.dataset.fading="true";
        loadingLogo.style.opacity="0";

        setTimeout(()=>{
            loadingLogo.style.transition="none";
            loadingLogo.currentTime=0;
            loadingLogo.style.opacity="1";
            loadingLogo.play();

            requestAnimationFrame(()=>{
                requestAnimationFrame(()=>{
                    loadingLogo.style.transition="opacity .5s ease";
                    loadingLogo.dataset.fading="";
                });
            });
        },500);
    }
});

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

window.hideLoadingScreen=()=>{
    clearInterval(messageInterval);
    loadingScreen.classList.add("hidden");
};

// ========================================
// TEMPORARY: CONSTRUCTION NOTICE
// Remove before release
// ========================================

const constructionDialog =
    document.getElementById("construction-dialog");

const constructionDialogClose =
    document.getElementById("construction-dialog-close");


function showConstructionDialog(){

    if(
        sessionStorage.getItem(
            "syntra-construction-seen"
        )
    )
        return;

    constructionDialog.classList.remove("hidden");

    document.body.classList.add("construction-open");

    sessionStorage.setItem(
        "syntra-construction-seen",
        "true"
    );
}

constructionDialogClose.onclick=()=>{

    constructionDialog.classList.add("hidden");

    document.body.classList.remove("construction-open");

};

// Show after loading screen finishes
const originalHideLoadingScreen =
    window.hideLoadingScreen;

window.hideLoadingScreen=()=>{

    originalHideLoadingScreen();

    setTimeout(()=>{
        showConstructionDialog();
    },500);

};