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

const playerCover=document.getElementById("player-cover");


const expandedPlayer=document.getElementById("expanded-player");
const closeButton=document.getElementById("close-player");


const expandedCover=document.getElementById("expanded-cover");
const expandedTitle=document.getElementById("expanded-title");
const expandedArtist=document.getElementById("expanded-artist");


const expandedPlay=document.getElementById("expanded-play");
const expandedPrev=document.getElementById("expanded-prev");
const expandedNext=document.getElementById("expanded-next");


const seekBar=document.getElementById("seek-bar");
const seekProgress=document.getElementById("seek-progress");

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

const playerState={
    currentSong:null,
    isPlaying:false,
    queue:[],
    currentIndex:-1,
    repeat:"off"
};

const savedSong=
JSON.parse(localStorage.getItem("syntra-current-song"));

if(savedSong){
    playerState.currentSong=savedSong;
}

let currentSong=null;
let dragging=false;
let activeSeekBar=null;

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



    songTitle.textContent=song.title;

    songArtist.textContent=song.artist;


    songTitle.classList.remove("empty");

    songArtist.classList.remove("empty");

    requestAnimationFrame(()=>{

        if(songTitle.scrollWidth > songTitle.clientWidth){
            songTitle.classList.add("scrolling");
        }
        else{
            songTitle.classList.remove("scrolling");
        }

    });



    expandedTitle.textContent=song.title;

    expandedArtist.textContent=song.artist;



    creditArtist.textContent=song.artist||"Unknown";

    creditAlbum.textContent=song.album||"Unknown";

    creditYear.textContent=song.year||"Unknown";



    let cover="assets/default-cover.png";


    if(song.cover)

        cover=song.coverUrl || "assets/default-cover.png";



    playerCover.src=cover;

    expandedCover.src=cover;


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
        "mousedown",
        e=>{

            dragging=true;
            activeSeekBar=bar;

            seek(e,bar);
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

document.addEventListener(
"mousemove",
e=>{
    if(!dragging || !activeSeekBar)
        return;

    seek(e,activeSeekBar);
});

document.addEventListener(
"mouseup",
()=>{

    dragging=false;
    activeSeekBar=null;

});

audio.addEventListener(
"loadedmetadata",
()=>{

    durationLabel.textContent=
    formatTime(audio.duration);


    expandedDuration.textContent=
    formatTime(audio.duration);

});



audio.addEventListener(
"play",
()=>requestAnimationFrame(updateProgress)
);



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

document.querySelector(".player")
.addEventListener(
"click",
e=>{


    if(
        e.target.closest("button")||

        e.target.closest("#seek-bar")||

        e.target.closest("#current-time")||

        e.target.closest("#duration")||

        e.target.closest(".volume-control")||

        e.target.closest("#volume-slider")
    )

        return;



    if(!playerState.currentSong)

        return;



    expandedPlayer.classList.add("active");
    player.classList.add("hidden");


    document.body.style.overflow="hidden";


});

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

document.addEventListener(
    "click",
    e=>{
        if(e.target.closest("button")){
            e.target.closest("button").blur();
        }
    }
);