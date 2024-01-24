
let currentSong=new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder=folder;
    let a= await fetch(`/${currFolder}/`);
    let response=await a.text();
    
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.title.split(".")[0]);
        }
    }

    let songUL=document.querySelector(".songsList").getElementsByTagName("ul")[0];
    songUL.innerHTML="";
    for (const song of songs) {
            songUL.innerHTML=songUL.innerHTML+`
                <li><img src="images/music.svg" class="invert" alt="">
                    <div class="info">
                        <div>${song}</div>
                        <div>Rishabh Dev</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img src="images/play.svg" class="invert" alt="">
                    </div>
                </li>`;
    }

    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click",e=>{
            playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    return songs;    
}

const playMusic=(track,pause=false)=>{
    
    currentSong.src=`/${currFolder}/`+track+".mp3";
    
    if(!pause){
        currentSong.play();
        play.src="images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML=track;
    document.querySelector(".songtime").innerHTML="00:00/00:00";

    
}


async function displayAlbums() {
    
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
   
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[1]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h3>${response.title}</h3>
            <small>${response.description}</small>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}

async function main(){
    
    await getSongs("songs/rap");
    playMusic(songs[0],true);

    // Display all the albums on the page
    await displayAlbums()


    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="images/pause.svg";
        }
        else{
            currentSong.pause();
            play.src="images/play.svg";
        }
    });

    //listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
       
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent+"%";
        currentSong.currentTime=((currentSong.duration)*percent)/100;
    });

    document.querySelector(".menu").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    });

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    });

    previous.addEventListener("click",()=>{
        let nextSong=decodeURI(currentSong.src.split("/").slice(-1)).split(".")[0];
        let index=songs.indexOf(nextSong);
        
        if((index-1)>=0){
            playMusic(songs[index-1],false);
        }
        if((index-1)==-1) playMusic(songs[songs.length-1]);

    });

    next.addEventListener("click",()=>{
        currentSong.pause();
        let nextSong=decodeURI(currentSong.src.split("/").slice(-1)).split(".")[0];
        let index=songs.indexOf(nextSong);
    
        if((index+1)<songs.length){
            playMusic(songs[index+1],false);
        }
        if((index+1)==songs.length) playMusic(songs[0]);
    });

    // document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    //     currentSong.volume=parseInt(e.target.value)/100;
        
    //     if(currentSong.volume==0){
    //         const childEle=document.querySelector(".range").getElementsByTagName("input")[0];
           
    //         const volumeImg=document.querySelector(".volume").getElementsByTagName("img")[0];

    //         let muteEle=document.createElement("img");
    //         muteEle.src="images/mute.svg";
    //         muteEle.classList.add("mute");
    //         document.querySelector(".volume").removeChild(volumeImg);
    //         document.querySelector(".range").removeChild(childEle);
    //         document.querySelector(".volume").appendChild(muteEle);


    //         document.querySelector(".mute").addEventListener("click",()=>{
    //             const muteImg=document.querySelector(".volume").getElementsByTagName("img")[0];

    //             let volEle=document.createElement("img");
    //             let inputEle=document.createElement("input");
    //             volEle.src="images/volume.svg";
    //             volEle.classList.add("volumebar");
    //             inputEle.type="range";
    //             document.querySelector(".volume").removeChild(muteImg);
    //             document.querySelector(".range").appendChild(volEle);
    //             document.querySelector(".volume").appendChild(inputEle);

    //             currentSong.volume=50/100;
    //         })
    //     }
    // });

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .30;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
        }

    })

}

main();