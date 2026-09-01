(() => {

    document.title="Singles • Syntra";
    const songList=document.getElementById("song-list");

    songList.innerHTML="";

    window.pageReady = getSongs()
    .then(songs=>{

        const groups={};

        songs.forEach(song=>{

            if(!groups[song.album])
                groups[song.album]=[];

            groups[song.album].push(song);

        });

        const albumGroups=Object.values(groups);

        albumGroups.sort((a,b)=>{
            return b[0].year-a[0].year;
        });

        albumGroups.forEach(group=>{

            group.sort((a,b)=>a.track-b.track);

            group.forEach(song=>{

                const item=document.createElement("div");

                item.className="single-item";
                item.dataset.id=song.id;

                item.innerHTML=`
                    <img 
                        class="single-cover"
                        src="${song.coverUrl}"
                        alt="${song.title}"
                    >

                    <div class="single-info">
                        <h3>${song.title}</h3>
                        <p>${song.artist}</p>
                    </div>

                    <div class="single-actions">

                        <button
                            class="single-menu-button"
                            title="More options"
                            aria-label="More options"
                        >
                            <img
                                src="assets/icons/ellipsis-vertical.svg"
                                alt=""
                            >
                        </button>

                        <button class="play-button">
                            <img src="assets/icons/play.svg" alt="Play">
                        </button>

                        <div class="single-menu">

                            <button class="single-menu-item play-next">
                                <img src="assets/icons/play-next.svg" alt="">
                                Play next
                            </button>

                            <button class="single-menu-item add-to-queue">
                                <img src="assets/icons/list-plus.svg" alt="">
                                Add to queue
                            </button>

                        </div>

                    </div>
                `;

                const play=()=>{
                    toggleSong(song);
                };

                const menuButton =
                    item.querySelector(".single-menu-button");

                const menu =
                    item.querySelector(".single-menu");

                const playNextButton =
                    item.querySelector(".play-next");

                const addToQueueButton =
                    item.querySelector(".add-to-queue");

                menuButton.onclick=(e)=>{
                    e.stopPropagation();

                    document
                        .querySelectorAll(".single-menu.open")
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

                item.onclick=(e)=>{
                    if(
                        e.target.closest(".play-button") ||
                        e.target.closest(".single-menu-button") ||
                        e.target.closest(".single-menu")
                    )
                        return;

                    play();
                };

                item.querySelector(".play-button").onclick=(e)=>{
                    e.stopPropagation();
                    play();
                };

                songList.appendChild(item);

            });

        });

        document.addEventListener("click",()=>{
            document
                .querySelectorAll(".single-menu.open")
                .forEach(menu=>{
                    menu.classList.remove("open");
                });
        });

        updatePlayingUI();

    });

})();