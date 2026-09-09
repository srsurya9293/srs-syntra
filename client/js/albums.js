(() => {

    document.title="Albums • Syntra";
    const albumList=document.getElementById("album-list");

    albumList.innerHTML="";

    window.pageReady = getAlbums()
    .then(albums=>{
        albums.sort((a,b)=>b.year-a.year);

        albums.forEach(album=>{

            const isNew=
                album.id==window.newReleaseId;

                console.log(
                    "Album ID:", album.id,
                    "New Release ID:", window.newReleaseId,
                    "isNew:", isNew
                );

            const card=document.createElement("div");

            card.className="album-card";
            card.dataset.album=album.title;

            card.innerHTML=`
                <div class="album-content" onclick="navigate('album/${album.slug}')">

                    <div class="album-cover">

                        <img src="${album.cover ? album.coverUrl : 'assets/images/default-cover.png'}">

                        ${isNew ? `
                            <span class="new-label">NEW</span>
                        ` : ''}

                    </div>

                    <div class="album-info">
                        <h3>${album.title}</h3>
                        <p>${album.artist}</p>
                    </div>

                </div>
            `;

            albumList.appendChild(card);

        });

        updatePlayingUI();

    });

})();