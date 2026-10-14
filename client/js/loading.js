const loadingMessages=[

    "Preparing your soundtrack...",
    "Loading...",
    "There's a new release waiting for you...",
    "Getting things ready...",
    "Almost there...",
    "Setting the mood...",
    "Getting your music ready...",
    "Just a moment...",
    "Somewhere, a melody is waiting.",
    "Every story deserves a soundtrack.",
    "The next song is worth the wait.",

    // "Curious? Good.",
    // "Oh, you're curious, aren't you?",
    // "Let’s see what you’ve found.",
    // "Do you know what this app is about?",
    // "Do you know what you’re about to discover?",
    // "Think you know what this is about?",
    // "Helloooooo... Come on in"

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

// const constructionDialog =
//     document.getElementById("construction-dialog");

// const constructionDialogClose =
//     document.getElementById("construction-dialog-close");


// function showConstructionDialog(){

//     if(
//         sessionStorage.getItem(
//             "syntra-construction-seen"
//         )
//     )
//         return;

//     constructionDialog.classList.remove("hidden");

//     document.body.classList.add("construction-open");
// }


// constructionDialogClose.onclick=()=>{

//     constructionDialog.classList.add("hidden");

//     document.body.classList.remove("construction-open");

//     sessionStorage.setItem(
//         "syntra-construction-seen",
//         "true"
//     );

// };


// // Show construction notice after loading screen finishes
// window.hideLoadingScreen=()=>{

//     clearInterval(messageInterval);

//     loadingScreen.classList.add("hidden");

//     setTimeout(()=>{
//         showConstructionDialog();
//     },500);

// };