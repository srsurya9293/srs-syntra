(() => {
    const dialog = document.getElementById("server-dialog");
    const title = document.getElementById("server-dialog-title");
    const message = document.getElementById("server-dialog-message");
    const closeButton = document.getElementById("server-dialog-close");

    function showServerDialog(type){
        if(type === "offline"){
            title.textContent = "Server is currently offline";
            message.textContent = "Please try again later.";
        }else{
            title.textContent = "The server ran into an unexpected error";
            message.textContent = "Please try again later.";
        }

        dialog.classList.remove("hidden");
    }

    function hideServerDialog(){
        dialog.classList.add("hidden");
    }

    window.addEventListener("syntra:server-error",(event)=>{
        showServerDialog(event.detail?.type);
    });

    closeButton.addEventListener("click",hideServerDialog);

})();