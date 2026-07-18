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

volumeSlider.value=audio.volume;
expandedVolumeSlider.value=audio.volume;

updateVolumeSlider(volumeSlider);
updateVolumeSlider(expandedVolumeSlider);

updateVolumeIcon();

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


let currentSong=null;

let dragging=false;



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

        playButton.textContent="⏸";
        expandedPlay.textContent="⏸";

    }

    else{

        playButton.textContent="▶";
        expandedPlay.textContent="▶";

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


    if(playerState.queue.length===0)

        setQueue([song]);



    playerState.currentSong=song;

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

        cover=`http://localhost:3000/covers/${song.cover}`;



    playerCover.src=cover;

    expandedCover.src=cover;


    document.querySelector(".expanded-bg")
    .style.backgroundImage=`url(${cover})`;



    audio.src=
    `http://localhost:3000/stream/${song.id}`;



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



function updatePlayingUI(){

    document.querySelectorAll(".track")
    .forEach(track=>{


        track.classList.remove("playing");


        const button=
        track.querySelector(".play-track");



        if(button)

            button.textContent="▶";



        if(
            playerState.currentSong &&
            Number(track.dataset.id)
            ===playerState.currentSong.id
        ){


            track.classList.add("playing");


            if(button)

                button.textContent="⏸";

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


    let icon="↻";


    if(playerState.repeat==="all")

        icon="🔁";


    if(playerState.repeat==="one")

        icon="🔂";



    if(repeatButton)

        repeatButton.textContent=icon;


    if(expandedRepeat)

        expandedRepeat.textContent=icon;

}
function updateVolume(){

    const volume=audio.volume;

    volumeSlider.value=volume;
    expandedVolumeSlider.value=volume;

    updateVolumeSlider(volumeSlider);
    updateVolumeSlider(expandedVolumeSlider);

    localStorage.setItem(
        "syntra-volume",
        volume
    );

    updateVolumeIcon();

}



function updateVolumeIcon(){

    let icon="🔊";


    if(audio.volume===0)

        icon="🔇";


    else if(audio.volume<0.4)

        icon="🔈";


    else if(audio.volume<0.75)

        icon="🔉";



    muteButton.textContent=icon;

    expandedMute.textContent=icon;

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

    updateVolumeSlider(volumeSlider);
    updateVolumeSlider(expandedVolumeSlider);

}

function updateVolumeSlider(slider){

    const percent=slider.value*100;

    slider.style.background=
    `linear-gradient(to right,#020079 ${percent}%,#444 ${percent}%)`;

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

volumeSlider.addEventListener("input",()=>{

    audio.volume=Number(volumeSlider.value);

    expandedVolumeSlider.value=volumeSlider.value;

    updateVolumeSlider(volumeSlider);
    updateVolumeSlider(expandedVolumeSlider);

    updateVolumeIcon();

    localStorage.setItem(
        "syntra-volume",
        audio.volume
    );

});

expandedVolumeSlider.addEventListener("input",()=>{

    audio.volume=Number(expandedVolumeSlider.value);

    volumeSlider.value=expandedVolumeSlider.value;

    updateVolumeSlider(volumeSlider);
    updateVolumeSlider(expandedVolumeSlider);

    updateVolumeIcon();

    localStorage.setItem(
        "syntra-volume",
        audio.volume
    );

});

enableSeek(seekBar);

enableSeek(expandedSeekBar);



document.addEventListener(
"mousemove",
e=>{

    if(!dragging)
        return;



    if(seekBar.matches(":hover"))

        seek(e,seekBar);



    if(expandedSeekBar.matches(":hover"))

        seek(e,expandedSeekBar);

});



document.addEventListener(
"mouseup",
()=>{

    dragging=false;

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

    playButton.textContent="⏳";
    expandedPlay.textContent="⏳";

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


    document.body.style.overflow="hidden";


});





closeButton.onclick=()=>{


    expandedPlayer.classList.remove("active");


    document.body.style.overflow="";


};





function loadSongs(){


    fetch(
    "http://localhost:3000/api/songs"
    )


    .then(r=>r.json())


    .then(songs=>{


        audio.pause();


        setPlayingState(false);



        songTitle.classList.add("empty");


        songArtist.classList.add("empty");


    });
}

loadSongs();

window.playSong=playSong;
window.setQueue=setQueue;
window.playNext=playNext;
window.playPrevious=playPrevious;
window.playFromQueue=playFromQueue;
window.playerState=playerState;