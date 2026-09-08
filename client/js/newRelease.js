async function initNewRelease(){

    const home=await getHome();

    const release=home.latestRelease;

    if(!release || !release.active){
        console.log("New Release highlight is inactive");
        return;
    }

    console.log("New Release highlight is ACTIVE");

    const storageKey =
        `syntra-new-release-seen-${release.id}`;

    if(sessionStorage.getItem(storageKey)){
        return;
    }

    await window.pageReady;

    const releaseCard=
        document.querySelector(".release-card");

    if(!releaseCard)
        return;

    console.log("Release card found:", releaseCard);

    const targetScroll=
        releaseCard.offsetTop - 100;

    console.log("Target scroll:", targetScroll);

    window.scrollTo({
        top:targetScroll,
        behavior:"smooth"
    });

    const waitForScroll=setInterval(() => {

        if(Math.abs(window.scrollY-targetScroll)<5){

            clearInterval(waitForScroll);

            releaseCard.classList.add(
                "new-release-highlight"
            );

            sessionStorage.setItem(
                storageKey,
                "true"
            );

            console.log(
                "Highlight class:",
                releaseCard.classList.contains(
                    "new-release-highlight"
                )
            );

            // setTimeout(() => {

            //     window.scrollTo({
            //         top:0,
            //         behavior:"smooth"
            //     });

            // }, 1200);

        }

    },50);

}