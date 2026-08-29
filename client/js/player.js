console.log("PLAYER VERSION: EMOJI");
let isLoading=false;

const audio=document.getElementById("syntra-audio");

const playButton=document.getElementById("play-button");

const prevButton=document.getElementById("prev-button");
const nextButton=document.getElementById("next-button");

const repeatButton=document.getElementById("repeat-button");
const expandedRepeat=document.getElementById("expanded-repeat");

const volumeSlider=document.getElementById("volume-slider");
const expandedVolumeSlider=document.getElementById("expanded-volume-slider");

const muteButton=document.getElementById("mute-button");
const expandedMute=document.getElementById("expanded-mute");

let previousVolume=1;

const savedVolume=localStorage.getItem("syntra-volume");

audio.volume=savedVolume!==null?Number(savedVolume):1;


const songTitle=document.querySelector(".song h4");
const songArtist=document.querySelector(".song p");
const songTitleWrapper=document.querySelector(".song-title-wrapper");

const playerCover=document.getElementById("player-cover");


const expandedPlayer=document.getElementById("expanded-player");
const closeButton=document.getElementById("close-player");
const expandPlayerButton =
    document.getElementById("expand-player");

const player = document.querySelector(".player");

const expandedCover=document.getElementById("expanded-cover");
const expandedTitle=document.getElementById("expanded-title");
const expandedArtist=document.getElementById("expanded-artist");


const expandedPlay=document.getElementById("expanded-play");
const expandedPrev=document.getElementById("expanded-prev");
const expandedNext=document.getElementById("expanded-next");


const seekBar=document.getElementById("seek-bar");
const seekProgress=document.getElementById("seek-progress");
const seekThumb=document.getElementById("seek-thumb");

const currentTimeLabel=document.getElementById("current-time");
const durationLabel=document.getElementById("duration");


const expandedSeekBar=document.getElementById("expanded-seek-bar");
const expandedProgress=document.getElementById("expanded-seek-progress");
const expandedThumb=document.getElementById("expanded-seek-thumb");

const expandedCurrent=document.getElementById("expanded-current");
const expandedDuration=document.getElementById("expanded-duration");

const creditArtist=document.getElementById("credit-artist");
const creditAlbum=document.getElementById("credit-album");
const creditYear=document.getElementById("credit-year");
const expandedFunFact=document.getElementById("expanded-funfact");
const funFactSection=document.querySelector(".fun-fact");
const creditsSection=document.querySelector(".credits");
const creditLinkItem=document.getElementById("credit-link-item");
const creditLinkLabel=document.getElementById("credit-link-label");
const creditLink=document.getElementById("credit-link");
const creditText=document.getElementById("credit-text");

const lyricsContent = document.getElementById("lyrics-content");
const expandedDetails=document.querySelector(".expanded-details");

const playerState={
    currentSong:null,
    isPlaying:false,
    queue:[],
    currentIndex:-1,
    repeat:"off"
};

let songStories=null;

const savedSong=
JSON.parse(localStorage.getItem("syntra-current-song"));

if(savedSong){
    playerState.currentSong=savedSong;
}

let currentSong=null;
let dragging=false;
let activeSeekBar=null;

async function loadSongStories(){
    if(songStories)
        return songStories;

    try{
        songStories=await getStories();
        return songStories;

    }catch(error){
        console.error("Failed to load song stories:",error);
        return {};
    }
}

function formatTime(sec){

    if(isNaN(sec))
        return "0:00";


    const m=Math.floor(sec/60);

    const s=Math.floor(sec%60);


    return `${m}:${String(s).padStart(2,"0")}`;

}

function setPlayingState(state){
    playerState.isPlaying=state;

    if(state){
        updatePlayIcon(playButton,true);
        updatePlayIcon(expandedPlay,true);
    }

    else{
        updatePlayIcon(playButton,false);
        updatePlayIcon(expandedPlay,false);
    }

    if("mediaSession" in navigator){
        navigator.mediaSession.playbackState =
            state ? "playing" : "paused";
    }
    updatePlayingUI();
}

function setQueue(songs){

    playerState.queue=songs;


    playerState.currentIndex=
        playerState.queue.findIndex(
            song=>song.id===playerState.currentSong?.id
        );

}



function playFromQueue(song){

    const index=
        playerState.queue.findIndex(
            s=>s.id===song.id
        );


    if(index===-1){

        console.error(
            "Song not found in queue:",
            song
        );

        return;

    }


    playerState.currentIndex=index;


    playSong(song);

}



function playSong(song){
    console.log("Song object:",song);
    console.log("CURRENT SONG:", song);

    if(playerState.queue.length===0)
        setQueue([song]);

    playerState.currentSong=song;
    SyntraLyrics.loadSongLyrics(song.id);

    localStorage.setItem(
        "syntra-current-song",
        JSON.stringify(song)
    );

    currentSong=song;
    playerState.currentIndex=
        playerState.queue.findIndex(
            s=>s.id===song.id
        );

    updatePlayingUI();
    songTitle.innerHTML=`<span>${song.title}</span>`;
    songArtist.textContent=song.artist;
    songTitle.classList.remove("empty");
    songArtist.classList.remove("empty");

    requestAnimationFrame(()=>{
        const titleText=songTitle.querySelector("span");
        const visibleWidth=songTitle.clientWidth;
        const textWidth=titleText.scrollWidth;

        if(textWidth > visibleWidth){
            const distance=textWidth-visibleWidth;

            songTitle.style.setProperty(
                "--scroll-distance",
                `${distance}px`
            );
            songTitle.classList.add("scrolling");
        }
        else{
            songTitle.classList.remove("scrolling");
            songTitle.style.removeProperty("--scroll-distance");
        }
    });

    expandedTitle.textContent=song.title;
    expandedArtist.textContent=song.artist;
    creditArtist.textContent=song.artist||"Unknown";
    creditAlbum.textContent=song.album||"Unknown";
    creditYear.textContent=song.year||"Unknown";

    loadSongStories().then(stories=>{
        const story=stories[String(song.id)];

        if(story && story.text){
            expandedFunFact.textContent=story.text;
            funFactSection.classList.remove("hidden");
            expandedDetails.classList.remove("story-hidden");
        }
        else{
            expandedFunFact.textContent="";
            funFactSection.classList.add("hidden");
            expandedDetails.classList.add("story-hidden");
        }

        // Custom credit link
        if(story && story.creditLink){

            creditLinkLabel.textContent =
                story.creditLink.label;

            if(story.creditLink.url){

                creditLink.textContent =
                    story.creditLink.text;

                creditLink.href =
                    story.creditLink.url;

                creditLink.classList.remove("hidden");
                creditText.classList.add("hidden");

            }
            else{

                creditText.textContent =
                    story.creditLink.text;

                creditText.classList.remove("hidden");
                creditLink.classList.add("hidden");

                creditLink.removeAttribute("href");

            }

            creditLinkItem.classList.remove("hidden");

        }
        else{

            creditLinkItem.classList.add("hidden");

            creditLink.textContent="";
            creditText.textContent="";
            creditLink.removeAttribute("href");

        }
    });

    SyntraLyrics.loadSongLyrics(song.id);

    let cover="assets/images/default-cover.png";

    if(song.cover)
        cover=song.coverUrl || "assets/images/default-cover.png";

    playerCover.src=cover;
    expandedCover.src=cover;

    // ========================================
    // Media Session Metadata
    // ========================================

    if("mediaSession" in navigator){
        navigator.mediaSession.metadata =
            new MediaMetadata({
                title:song.title || "Unknown",
                artist:song.artist || "Unknown",
                album:song.album || "Unknown",
                artwork:[
                    {
                        src:cover
                    }
                ]
            });
    }

    document.querySelector(".expanded-bg")
    .style.backgroundImage=`url(${cover})`;

    console.log("Stream URL:", `${API_BASE}/stream/${song.id}`);
    audio.src=`${API_BASE}/stream/${song.id}`;
    isLoading=true;
    setPlayingState(false);

    audio.play()
    .then(()=>{

        isLoading=false;
        setPlayingState(true);

    })
    .catch(err=>{
        console.error("Playback error:",err);

        isLoading=false;
        setPlayingState(false);
    });
}

// ========================================
// Media Session Controls
// ========================================

if("mediaSession" in navigator){

    navigator.mediaSession.setActionHandler(
        "play",
        ()=>{
            if(!currentSong)
                return;

            audio.play();
        }
    );

    navigator.mediaSession.setActionHandler(
        "pause",
        ()=>{
            audio.pause();
        }
    );

    navigator.mediaSession.setActionHandler(
        "previoustrack",
        ()=>{
            if(!currentSong)
                return;

            playPrevious();
        }
    );

    navigator.mediaSession.setActionHandler(
        "nexttrack",
        ()=>{
            if(!currentSong)
                return;

            playNext();
        }
    );

}

// ========================================
// Media Session Sync
// ========================================

if("mediaSession" in navigator){

    navigator.mediaSession.setActionHandler(
        "play",
        ()=>{
            if(currentSong && audio.paused){
                audio.play();
            }
        }
    );

    navigator.mediaSession.setActionHandler(
        "pause",
        ()=>{
            if(currentSong && !audio.paused){
                audio.pause();
            }
        }
    );

    navigator.mediaSession.setActionHandler(
        "nexttrack",
        ()=>{
            if(currentSong){
                playNext();
            }
        }
    );

    navigator.mediaSession.setActionHandler(
        "previoustrack",
        ()=>{
            if(currentSong){
                playPrevious();
            }
        }
    );

}

// ========================================
// Lyrics
// ========================================

async function loadLyrics(){

    return await getLyrics();

}

function toggleSong(song){

    console.log("=== TOGGLE DEBUG ===");
    console.log("Clicked song:", song);
    console.log("Current song:", playerState.currentSong);
    console.log("Clicked ID:", song?.id);
    console.log("Current ID:", playerState.currentSong?.id);
    console.log(
        "Same ID:",
        playerState.currentSong?.id === song?.id
    );
    console.log("Audio paused:", audio.paused);
    console.log("====================");

    if(
        playerState.currentSong &&
        playerState.currentSong.id === song.id
    ){

        if(audio.paused){

            audio.play();
            setPlayingState(true);

        }

        else{

            audio.pause();
            setPlayingState(false);

        }

        return;

    }

    playSong(song);

}

function playNext(){


    if(playerState.repeat==="one"){

        playSong(playerState.currentSong);

        return;

    }



    if(
        playerState.currentIndex>=
        playerState.queue.length-1
    ){


        if(playerState.repeat==="all"){


            playerState.currentIndex=0;


            playSong(
                playerState.queue[0]
            );


            return;

        }



        audio.pause();

        audio.currentTime=0;

        setPlayingState(false);


        return;

    }



    playerState.currentIndex++;


    playSong(
        playerState.queue[
            playerState.currentIndex
        ]
    );

}

function playPrevious(){

    // If we're more than 3 seconds into the song,
    // first click restarts the current song.
    if(audio.currentTime > 3){

        audio.currentTime=0;

        return;

    }

    // Otherwise, go to the previous track.
    if(playerState.currentIndex<=0){

        audio.currentTime=0;

        return;

    }

    playerState.currentIndex--;

    playSong(
        playerState.queue[
            playerState.currentIndex
        ]
    );

}

function updatePlayIcon(button,isPlaying){

    if(!button)
        return;

    const icon=button.querySelector("img");

    if(!icon)
        return;

    icon.classList.remove("loading");

    icon.src=`assets/icons/${isPlaying?"pause":"play"}.svg`;

}

function updatePlayingUI(){
    document.querySelectorAll(".track, .single-item, .album-card")
    .forEach(item=>{
        item.classList.remove("playing");
        const button=item.querySelector("button");

        if(button){
            const icon=button.querySelector("img");
            if(icon){
                icon.src="assets/icons/play.svg";
            }
        }

        if(
            playerState.currentSong &&
            playerState.isPlaying
        ){
            const isSong =
                Number(item.dataset.id) === playerState.currentSong.id;

            const isAlbum =
                item.classList.contains("album-card") &&
                item.dataset.album === playerState.currentSong.album;

            if(isSong || isAlbum){
                item.classList.add("playing");

                if(!item.classList.contains("album-card")){
                    if(button){
                        const icon=button.querySelector("img");

                        if(icon){
                            icon.src=
                                `assets/icons/${playerState.isPlaying?"pause":"play"}.svg`;
                        }
                    }
                }
            }
        }
    });
}

function toggleRepeat(){


    if(playerState.repeat==="off")

        playerState.repeat="all";


    else if(playerState.repeat==="all")

        playerState.repeat="one";


    else

        playerState.repeat="off";



    updateRepeatUI();

}



function updateRepeatUI(){

    let icon="repeat-off.svg";

    if(playerState.repeat==="all")

        icon="repeat.svg";

    else if(playerState.repeat==="one")

        icon="repeat-1.svg";


    document.getElementById("repeat-icon").src=
    `assets/icons/${icon}`;

    document.getElementById("expanded-repeat-icon").src=
    `assets/icons/${icon}`;

}

function updateVolume(){

    const volume=audio.volume;

    const percent=volume*100;

    volumeSlider.style.background=
    `linear-gradient(
        to right,
        #0300af ${percent}%,
        #444 ${percent}%
    )`;

    expandedVolumeSlider.style.background=
    `linear-gradient(
        to right,
        #2d2ade ${percent}%,
        #444 ${percent}%
    )`;

    volumeSlider.value=volume;
    expandedVolumeSlider.value=volume;

    localStorage.setItem(
        "syntra-volume",
        volume
    );

    updateVolumeIcon();

}

function updateVolumeIcon(){

    let icon;

    if(audio.volume===0)

        icon="volume-x.svg";

    else if(audio.volume<0.4)

        icon="volume.svg";

    else if(audio.volume<0.75)

        icon="volume-1.svg";

    else

        icon="volume-2.svg";


    const playerIcon=
    muteButton.querySelector("img");

    const expandedIcon=
    expandedMute.querySelector("img");


    if(playerIcon)

        playerIcon.src=
        `assets/icons/${icon}`;


    if(expandedIcon)

        expandedIcon.src=
        `assets/icons/${icon}`;

}

function toggleMute(){

    if(audio.volume>0){

        previousVolume=audio.volume;

        audio.volume=0;

    }

    else{

        audio.volume=previousVolume||1;

    }


    updateVolume();

}



function seek(e,bar){

    const rect=bar.getBoundingClientRect();


    let x=e.clientX-rect.left;


    x=Math.max(
        0,
        Math.min(x,rect.width)
    );


    audio.currentTime=
    (x/rect.width)*audio.duration;

}

function enableSeek(bar){
    bar.addEventListener(
        "click",
        e=>seek(e,bar)
    );


    bar.addEventListener(
        "pointerdown",
        e=>{
            dragging=true;
            activeSeekBar=bar;

            bar.setPointerCapture(e.pointerId);
            bar.classList.add("dragging");

            seek(e,bar);
        }
    );


    bar.addEventListener(
        "pointermove",
        e=>{
            if(!dragging || activeSeekBar!==bar)
                return;

            seek(e,bar);
        }
    );


    bar.addEventListener(
        "pointerup",
        e=>{
            dragging=false;
            activeSeekBar=null;

            if(bar.hasPointerCapture(e.pointerId))
                bar.releasePointerCapture(e.pointerId);
            bar.classList.remove("dragging");
        }
    );


    bar.addEventListener(
        "pointercancel",
        e=>{
            dragging=false;
            activeSeekBar=null;

            if(bar.hasPointerCapture(e.pointerId))
                bar.releasePointerCapture(e.pointerId);
            bar.classList.remove("dragging");
        }
    );

}

function updateProgress(){


    if(audio.duration){


        const p=
        (audio.currentTime/audio.duration)*100;



        seekProgress.style.width=p+"%";

        expandedProgress.style.width=p+"%";



        if(expandedThumb)

            expandedThumb.style.left=p+"%";



        currentTimeLabel.textContent=
        formatTime(audio.currentTime);



        expandedCurrent.textContent=
        formatTime(audio.currentTime);


    }



    if(!audio.paused)

        requestAnimationFrame(updateProgress);

}

repeatButton.onclick=toggleRepeat;

expandedRepeat.onclick=toggleRepeat;


updateRepeatUI();



muteButton.onclick=toggleMute;

expandedMute.onclick=toggleMute;



volumeSlider.addEventListener(
"input",
()=>{

    audio.volume=
    volumeSlider.value;

    updateVolume();

});



expandedVolumeSlider.addEventListener(
"input",
()=>{

    audio.volume=
    expandedVolumeSlider.value;

    updateVolume();

});

volumeSlider.addEventListener(
"wheel",
e=>{
    e.preventDefault();
    const step=0.05;
    let volume=audio.volume;

    if(e.deltaY<0)
        volume+=step;
    else
        volume-=step;

    volume=Math.max(
        0,
        Math.min(1,volume)
    );

    audio.volume=volume;
    updateVolume();
});

expandedVolumeSlider.addEventListener(
"wheel",
e=>{
    e.preventDefault();
    const step=0.05;
    let volume=audio.volume;

    if(e.deltaY<0)
        volume+=step;
    else
        volume-=step;

    volume=Math.max(
        0,
        Math.min(1,volume)
    );

    audio.volume=volume;
    updateVolume();
});

enableSeek(seekBar);

enableSeek(expandedSeekBar);

audio.addEventListener(
"loadedmetadata",
()=>{

    durationLabel.textContent=
    formatTime(audio.duration);


    expandedDuration.textContent=
    formatTime(audio.duration);

});

audio.addEventListener("play", ()=>{

    if(!expandedPlayer.classList.contains("active")){

        player.classList.remove("hidden");

        // Reset animation if it was previously used
        player.classList.remove("slide-in");

        // Force the browser to acknowledge the reset
        void player.offsetWidth;

        // Start animation
        player.classList.add("slide-in");
    }

    setPlayingState(true);

    if("mediaSession" in navigator){
        navigator.mediaSession.playbackState="playing";
    }

    requestAnimationFrame(updateProgress);
});

audio.addEventListener("pause", ()=>{
    setPlayingState(false);

    if("mediaSession" in navigator){
        navigator.mediaSession.playbackState="paused";
    }
});

audio.addEventListener(
"ended",
()=>{

    playNext();

});

audio.addEventListener("canplay",()=>{
    if(isLoading){
        isLoading=false;
        setPlayingState(true);
    }

    if("mediaSession" in navigator){
        navigator.mediaSession.playbackState="none";
    }
});

audio.addEventListener("waiting",()=>{
    isLoading=true;
    playButton.innerHTML=`
        <img
            class="player-icon loading"
            src="assets/icons/loader-circle.svg"
        >
    `;

    expandedPlay.innerHTML=`
        <img
            class="player-icon loading"
            src="assets/icons/loader-circle.svg"
        >
    `;

    if("mediaSession" in navigator){
    navigator.mediaSession.playbackState="none";
}
});

audio.addEventListener("error",()=>{

    console.error(
        "Audio failed:",
        audio.error
    );

    isLoading=false;

    setPlayingState(false);

});

playButton.onclick=()=>{

    if(!currentSong)
        return;

    if(audio.paused){

        audio.play();
        setPlayingState(true);

    }

    else{

        audio.pause();
        setPlayingState(false);

    }

};

// ================================
// KEYBOARD SHORTCUTS
// ================================

document.addEventListener("keydown", e => {

    // Don't trigger shortcuts while typing
    const tag = document.activeElement?.tagName;

    if(
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        tag === "BUTTON" ||
        document.activeElement?.isContentEditable
    ){
        return;
    }


    // Space = Play / Pause
    if(e.code === "Space"){

        e.preventDefault();

        if(!currentSong)
            return;

        playButton.click();

        return;
    }


    // Left Arrow = Rewind 5 seconds
    if(e.key === "ArrowLeft"){

        e.preventDefault();

        if(!currentSong || !audio.duration)
            return;

        audio.currentTime=Math.max(
            0,
            audio.currentTime-5
        );

        return;
    }


    // Right Arrow = Forward 5 seconds
    if(e.key === "ArrowRight"){

        e.preventDefault();

        if(!currentSong || !audio.duration)
            return;

        audio.currentTime=Math.min(
            audio.duration,
            audio.currentTime+5
        );

        return;
    }


    // Up Arrow = Volume +5%
    if(e.key === "ArrowUp"){

        e.preventDefault();

        audio.volume=Math.min(
            1,
            audio.volume+0.05
        );

        updateVolume();

        return;
    }


    // Down Arrow = Volume -5%
    if(e.key === "ArrowDown"){

        e.preventDefault();

        audio.volume=Math.max(
            0,
            audio.volume-0.05
        );

        updateVolume();

        return;
    }


    // P = Previous
    if(e.key.toLowerCase() === "p"){

        if(!currentSong)
            return;

        playPrevious();

        return;
    }


    // N = Next
    if(e.key.toLowerCase() === "n"){

        if(!currentSong)
            return;

        playNext();

        return;
    }


    // R = Repeat
    if(e.key.toLowerCase() === "r"){

        toggleRepeat();

        return;
    }


    // M = Mute / Unmute
    if(e.key.toLowerCase() === "m"){

        toggleMute();

        return;
    }

});

audio.addEventListener("timeupdate",()=>{
    SyntraLyrics.updateLyricsSync(
        audio.currentTime
    );
});

expandedPlay.onclick=
()=>playButton.click();

expandedPrev.onclick=
playPrevious;


expandedNext.onclick=
playNext;

prevButton?.addEventListener(
"click",
playPrevious
);

nextButton?.addEventListener(
"click",
playNext
);

expandPlayerButton.onclick = () => {
    if(!playerState.currentSong)
        return;

    // Open expanded player
    expandedPlayer.classList.add("active");

    player.classList.remove("slide-in");
    player.classList.remove("slide-out");

    void player.offsetWidth;

    player.classList.add("slide-out");

    player.addEventListener(
        "animationend",
        ()=>{
            player.classList.add("hidden");
            player.classList.remove("slide-out");
        },
        { once:true }
    );

    document.body.style.overflow="hidden";

    // Enter immersive fullscreen mode
    if(!document.fullscreenElement){
        document.documentElement.requestFullscreen()
        .catch(error => {
            console.warn(
                "Fullscreen request failed:",
                error
            );
        });
    }

};

closeButton.onclick=()=>{


    expandedPlayer.classList.remove("active");


    document.body.style.overflow="";

    player.classList.remove("hidden");


};

window.playSong=playSong;
window.setQueue=setQueue;
window.playNext=playNext;
window.playPrevious=playPrevious;
window.playFromQueue=playFromQueue;
window.playerState=playerState;
window.toggleSong=toggleSong;

document.addEventListener(
    "click",
    e=>{
        if(e.target.closest("button")){
            e.target.closest("button").blur();
        }
    }
);