console.count("album.js loaded");
(() => {
    console.log("ALBUM SCRIPT LOADED", Date.now());
    const albumId=window.location.hash.replace("#","").split("/")[1];

    const trackList=document.getElementById("track-list");
    const albumStreaming=document.getElementById("album-streaming");
    const albumStreamingLink=document.getElementById("album-streaming-link");
    

    if(trackList)
        trackList.innerHTML="";

    if(albumId){

    window.pageReady = Promise.all([
        getAlbum(albumId),
        getAlbumLinks()
    ])
    .then(([album, albumLinks])=>{

        console.log("ALBUM DATA:",album);

        document.title=`${album.title} • Syntra`;

        const linkData=albumLinks[String(album.id)];

        if(linkData?.url){

            albumStreamingLink.href=linkData.url;
            albumStreaming.classList.remove("hidden");

        }

        const cover=album.cover
        ? album.coverUrl
        :"assets/default-cover.png";

        document.querySelector("#album-bg").style.backgroundImage=`url(${cover})`;

        document.getElementById("album-details").innerHTML=`

        <img src="${cover}">

        <div class="album-details-info">

        <h1>${album.title}</h1>

        <p>${album.artist} • ${album.year||"Unknown Year"}</p>

        <button id="play-album">
            <img src="assets/icons/play-next.svg" alt="">
            <span>Play Album</span>
        </button>

        </div>

        `;
        
        const albumInfo=
        document.querySelector(".album-details-info");

        if(albumInfo && albumStreaming){

            albumInfo.appendChild(albumStreaming);

        }

        document.getElementById("play-album").onclick=()=>{

            setQueue(album.songs);
            playSong(album.songs[0]);

        };

        if(
            window.routeParams?.get("autoplay")==="true"
        ){

            setQueue(album.songs);

            playSong(album.songs[0]);

        }


        const trackList=document.getElementById("track-list");


        if(!album.songs){

            console.error("No songs array found");
            return;

        }

        console.log(album.songs);

        album.songs.forEach(song=>{

            const track=document.createElement("div");

            track.className="track";
            track.dataset.id=song.id;

            console.log("CREATING TRACK:", song.id, song.title);
            track.dataset.id=song.id;

            track.innerHTML=`

            <span class="track-number">
                ${String(song.track||1).padStart(2,"0")}
            </span>

            <div class="track-info">

            <h3>${song.title||"No title"}</h3>

            <p>${song.artist||"No artist"}</p>

            </div>

            <div class="track-actions">

                <button
                    class="track-menu-button"
                    title="More options"
                    aria-label="More options"
                >
                    <img
                        src="assets/icons/ellipsis-vertical.svg"
                        alt=""
                    >
                </button>

                <button
                    class="play-button play-track"
                    title="Play"
                    aria-label="Play"
                >
                    <img src="assets/icons/play.svg" alt="">
                </button>
                
                <div class="track-menu">

                    <button class="track-menu-item play-next">
                        <img src="assets/icons/play-next.svg" alt="">
                        Play next
                    </button>

                    <button class="track-menu-item add-to-queue">
                        <img src="assets/icons/list-plus.svg" alt="">
                        Add to queue
                    </button>

                </div>

            </div>

            `;

            const menuButton =
                track.querySelector(".track-menu-button");

            const menu =
                track.querySelector(".track-menu");

            const playNextButton =
                track.querySelector(".play-next");

            const addToQueueButton =
                track.querySelector(".add-to-queue");

            menuButton.onclick=(e)=>{
                e.stopPropagation();

                document
                    .querySelectorAll(".track-menu.open")
                    .forEach(openMenu=>{
                        if(openMenu !== menu)
                            openMenu.classList.remove("open");
                    });

                menu.classList.toggle("open");
            };

            playNextButton.onclick=(e)=>{
                e.stopPropagation();

                playNextSong(song);

                menu.classList.remove("open");
            };

            addToQueueButton.onclick=(e)=>{
                e.stopPropagation();

                addToQueue(song);

                menu.classList.remove("open");
            };


            track.querySelector(".play-track").onclick=()=>{
                console.log("PLAY CLICK:",song);
                toggleSong(song);
            };

            track.onclick=(e)=>{
                if(
                    e.target.closest(".play-track") ||
                    e.target.closest(".track-menu-button") ||
                    e.target.closest(".track-menu")
                )
                    return;

                console.log("TRACK CARD CLICK:",song);
                playSong(song);
            };

            trackList.appendChild(track);
            
            console.log(
                "TRACK COUNT:",
                trackList.children.length
            );

        });

        document.addEventListener("click",()=>{
            document
                .querySelectorAll(".track-menu.open")
                .forEach(menu=>{
                    menu.classList.remove("open");
                });
        });

    updatePlayingUI();

})
.catch(error=>{
    if(error.status===404){
        document.title="Album Not Found • Syntra";
        document.getElementById("album-details").innerHTML=`

            <div class="album-not-found">
                <h1>Album Not Found</h1>
                <p>
                    The album you're looking for doesn't exist.
                </p>
            </div>
        `;
        return;
    }

    throw error;
});

    }
    else{

    console.error("No album ID found");

    }
})();