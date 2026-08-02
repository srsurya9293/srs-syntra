async function initHome(){

    const home=await getHome();

    renderHero(home.hero);

    renderWelcome(home.welcome);

    renderLatestRelease(home.latestRelease);

    renderFeatured(home.featured);

    renderLinks(home.links);

    renderAbout(home.about);

}

function renderHero(hero){

    const section=document.getElementById("hero");

    section.innerHTML=`

        <h1>
            ${hero.title}
        </h1>


        <p>
            ${hero.subtitle}
        </p>


        <button onclick="smoothScroll('featured')">
            ${hero.buttonText}
        </button>

    `;

}

function renderWelcome(welcome){

    const section=document.getElementById("welcome");

    section.innerHTML=`

        <h2>
            ${welcome.title}
        </h2>

        <p>
            ${welcome.text}
        </p>

    `;

}

function renderLatestRelease(release){

    const section=document.getElementById("latest-release");

    section.innerHTML=`

        <h2>
            Latest Release
        </h2>


        <div class="release-card">

            <img src="${release.coverUrl}">


            <div>

                <h3>
                    ${release.title}
                </h3>


                <p>
                    ${release.artist}
                </p>


                <p>
                    ${release.year}
                </p>

            </div>

        </div>

    `;

}

function renderFeatured(featured){

    const albumContainer=
        document.getElementById("featured-album-list");


    const singleContainer=
        document.getElementById("featured-single-list");


    albumContainer.innerHTML=
        featured.albums.map(album=>`

            <div 
                class="featured-album-card"
                onclick="navigate('album/${album.id}')"
            >

                <img src="${album.coverUrl}">

                <h4>
                    ${album.title}
                </h4>

                <p>
                    ${album.artist}
                </p>

            </div>

        `).join("");

        singleContainer.innerHTML=
    `
    <div class="singles-list">

        ${
        featured.singles.map(single=>`

            <div 
                class="single-item"
                onclick="navigate('album/${single.id}?autoplay=true')"
            >

                <img 
                    src="${single.coverUrl}"
                    width="70"
                    height="70"
                >


                <div class="single-info">

                    <h3>
                        ${single.title}
                    </h3>


                    <p>
                        ${single.artist}
                    </p>

                </div>


            </div>

        `).join("")
        }

    </div>
    `;

}

function renderLinks(links){

    const section=document.getElementById("connect");


    section.innerHTML=`

        <h2>
            Also available on
        </h2>


        <div class="links-list">

            ${links.map(link=>`

                <a 
                    href="${link.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img 
                        src="assets/logos/${link.logo}"
                        alt=""
                    >

                    <span>
                        ${link.name}
                    </span>
                </a>

            `).join("")}

        </div>

    `;

}

function renderAbout(about){

    const section=document.getElementById("about");


    section.innerHTML=`

        <h2>
            ${about.title}
        </h2>


        <p>
            ${about.text}
        </p>

    `;

}

initHome();