window.smoothScroll=function(id){
    const target=document.getElementById(id);
    if(!target)return;

    const start=window.scrollY;
    const distance=target.offsetTop-start;
    const duration=200;
    let startTime=null;

    function animate(time){
        if(!startTime)startTime=time;

        let progress=Math.min((time-startTime)/duration,1);

        progress=progress<0.5
            ? 2*progress*progress
            : 1-Math.pow(-2*progress+2,2)/2;

        window.scrollTo(0,start+distance*progress);

        if(progress<1)requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}