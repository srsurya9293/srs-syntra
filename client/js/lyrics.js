// ========================================
// Lyrics (Frontend)
// ========================================

const lyricsButton =
    document.getElementById("lyrics-button");

const lyricsSection =
    document.querySelector(".lyrics-section");

if(lyricsButton && lyricsSection){
    lyricsButton.onclick=()=>{
        lyricsSection.classList.toggle("open");

        const isOpen =
            lyricsSection.classList.contains("open");

        lyricsButton.title =
            isOpen
                ? "Hide Lyrics"
                : "Show Lyrics";
    };
}

// ========================================
// Lyrics (Backend)
// ========================================

async function loadLyrics(){

    try{

        const response =
            await fetch(`${API_BASE}/api/lyrics`);

        if(!response.ok)
            throw new Error("Failed to fetch lyrics");

        return await response.json();

    }
    catch(error){

        console.error(
            "Lyrics loading error:",
            error
        );

        return {};

    }

}

console.count("lyrics.js loaded");

(() => {

    let currentLyrics = [];
    let activeLyricIndex = -1;

    const lyricsContent =
        document.getElementById("lyrics-content");

    function renderLyrics(lyrics){
        if(!lyricsContent)
            return;

        lyricsContent.innerHTML = "";
        currentLyrics = lyrics;
        activeLyricIndex = -1;

        if(!lyrics || lyrics.length === 0){
            lyricsSection?.classList.add("no-lyrics");
            lyricsContent.innerHTML =
                "<p class='no-lyrics'>No lyrics available</p>";
            return;
        }

        lyricsSection?.classList.remove("no-lyrics");

        const topSpacer =
            document.createElement("div");

        topSpacer.className = "lyrics-spacer";
        lyricsContent.appendChild(topSpacer);

        lyrics.forEach((line, index)=>{
            const lyricLine =
                document.createElement("div");

            lyricLine.className = "lyrics-line";
            lyricLine.dataset.index = index;
            lyricLine.textContent = line.text;
            lyricsContent.appendChild(lyricLine);
        });

        const bottomSpacer =
            document.createElement("div");

        bottomSpacer.className = "lyrics-spacer";
        lyricsContent.appendChild(bottomSpacer);
    }

    async function loadSongLyrics(songId){

        const lyrics =
            await loadLyrics();

        const songLyrics =
            lyrics[String(songId)];

        if(!songLyrics){
            renderLyrics([]);
            return;
        }

        renderLyrics(songLyrics);
    }

    function updateLyricsSync(currentTime){

        if(!currentLyrics.length)
            return;

        let newIndex = -1;

        for(let i = 0; i < currentLyrics.length; i++){

            if(currentTime >= currentLyrics[i].time){
                newIndex = i;
            }
            else{
                break;
            }

        }

        if(newIndex === activeLyricIndex)
            return;

        activeLyricIndex = newIndex;

        const activeLine =
            lyricsContent.querySelector(
                `.lyrics-line[data-index="${activeLyricIndex}"]`
            );

        if(activeLine){

            const containerCenter =
                lyricsContent.clientHeight / 2;

            const lineCenter =
                activeLine.offsetTop +
                activeLine.offsetHeight / 2;

            lyricsContent.scrollTo({
                top:lineCenter - containerCenter,
                behavior:"smooth"
            });

        }

        const lines =
            lyricsContent.querySelectorAll(".lyrics-line");

        lines.forEach((line,index)=>{

            line.classList.toggle(
                "active",
                index === activeLyricIndex
            );

        });

    }

    function closeLyrics(){

        lyricsSection?.classList.remove("open");

        if(lyricsButton){
            lyricsButton.title="Show Lyrics";
        }

    }

    window.SyntraLyrics = {
        loadSongLyrics,
        renderLyrics,
        updateLyricsSync,
        closeLyrics
    };

})();