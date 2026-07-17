async function navigate(page,addHistory=true){

    const [pageName,query]=page.split("?");

    const app=document.getElementById("app");


    try{

        const res=await fetch(`pages/${pageName}.html`);


        if(!res.ok)
            throw Error("Page not found");


        app.innerHTML=await res.text();


        if(addHistory){

            history.pushState(
                {page,query},
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
        location.hash.slice(1)||"discover",
        false
    );

};


navigate(
    location.hash.slice(1)||"discover",
    false
);