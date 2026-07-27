async function navigate(page,addHistory=true){

    const cleanPage=page.split("?")[0];

    const parts=cleanPage.split("/");

    const pageName=parts[0];

    const albumId=parts[1];

    window.routeParams=new URLSearchParams(
        page.split("?")[1]||""
    );

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
                {page},
                "",
                `#${page}`
            );

        }


        loadPageScript(pageName);


    }
    catch(err){

        console.error(err);

        app.innerHTML="<h2>Page loading failed</h2>";

    }

}


const scripts={
    home:["api.js", "home.js"],
    singles:["api.js","singles.js"],
    albums:["api.js","albums.js"],
    album:["api.js","album.js"]
};


function loadPageScript(page){

    document.querySelectorAll(".page-script")
    .forEach(s=>s.remove());


    if(!scripts[page])
        return;


    scripts[page].forEach(file=>{

        const s=document.createElement("script");

        s.className="page-script";

        s.src=`js/${file}?v=${Math.random()}`;

        document.body.appendChild(s);

    });

}


window.navigate=navigate;


window.onpopstate=()=>{

    navigate(
        location.hash.slice(1)||"home",
        false
    );

};


navigate(
    location.hash.slice(1)||"home",
    false
);