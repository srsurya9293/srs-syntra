history.scrollRestoration="manual";

async function navigate(page,addHistory=true){
    const cleanPage=page.split("?")[0];
    const pageName=cleanPage.split("/")[0];

    window.routeParams=new URLSearchParams(
        page.split("?")[1]||""
    );

    if(!addHistory && pageName==="album"){
        window.routeParams.delete("autoplay");
    }

    /*
        Save the current page's scroll position
        before navigating away from it.
    */

    if(addHistory){
        history.replaceState(
            {
                ...(history.state || {}),
                page:location.hash.slice(1)||"home",
                scrollY:window.scrollY
            },
            "",
            location.href
        );
    }

    switch(pageName){
        case "home":
            document.title="Syntra";
            break;

        case "albums":
            document.title="Albums • Syntra";
            break;

        case "singles":
            document.title="Singles • Syntra";
            break;

        case "about":
            document.title="About • Syntra";
    }

    const app=document.getElementById("app");

    try{
        const res=await fetch(`pages/${pageName}.html`);

        if(!res.ok)
            throw Error("Page not found");

        app.innerHTML=await res.text();

        if(addHistory){
            history.pushState(
                {
                    page,
                    scrollY:0
                },
                "",
                `#${page}`
            );
            window.scrollTo(0,0);
        }

        await loadPageScript(pageName);
    }
    catch(err){
        console.error(err);
        app.innerHTML="<h2>Page loading failed</h2>";
    }
}

const scripts={
    home:["api.js","home.js"],
    singles:["api.js","singles.js"],
    albums:["api.js","albums.js"],
    album:["api.js","album.js"]
};

function loadPageScript(page){
    return new Promise((resolve)=>{
        document.querySelectorAll(".page-script")
        .forEach(s=>s.remove());

        if(!scripts[page]){
            resolve();
            return;
        }

        const files=scripts[page];
        let loaded=0;

        files.forEach(file=>{
            const s=document.createElement("script");
            s.className="page-script";
            s.src=`js/${file}?v=${Math.random()}`;

            s.onload=()=>{
                loaded++;

                if(loaded===files.length){
                    resolve();
                }
            };

            s.onerror=()=>{
                console.error(
                    `Failed to load page script: ${file}`
                );

                loaded++;

                if(loaded===files.length){
                    resolve();
                }
            };

            document.body.appendChild(s);
        });
    });
}

window.navigate=navigate;

window.onpopstate=()=>{
    const page=
        location.hash.slice(1)||"home";

    const scrollY=
        history.state?.scrollY||0;

    window.restoreScrollPosition=()=>{
        window.scrollTo(0,scrollY);
        window.restoreScrollPosition=null;
    };

    navigate(
        page,
        false
    );
};

async function initRouter(){
    const initialPage=
        location.hash.slice(1)||"home";

    history.replaceState(
        {
            page:initialPage,
            scrollY:0
        },
        "",
        `#${initialPage}`
    );

    // Wait until all required backend data is ready
    await window.syntraStartup;

    await navigate(
        initialPage,
        false
    );

    hideLoadingScreen();

    if(
        initialPage.startsWith("album/") &&
        initialPage.includes("?autoplay=true")
    ){
        history.replaceState(
            {
                page:`${initialPage.split("?")[0]}`,
                scrollY:0
            },
            "",
            `#${initialPage.split("?")[0]}`
        );
    }
}

initRouter();