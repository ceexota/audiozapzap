const url = new URL(window.location.href);
const audio_url = url.searchParams.get('audio');
const avatar_url = url.searchParams.get('avatar');

const audioPlayer = document.getElementById('audio-player');

document.getElementById('audio-avatar').src = avatar_url;
const audio = new Audio(audio_url);

// Set the volume (0.0 for mute, 1.0 for maximum)
audio.volume = 1.0; // Adjust as needed

const btnPlayToggle = audioPlayer.querySelector(".btn-play");
const slider = audioPlayer.querySelector("input[type='range']");

function setMessageDate() {
    // Set the time zone offset for GMT-3 (Brasília Time)
    const timeZoneOffset = -3 * 60; // GMT-3
    
    // Create a Date object with the desired time zone offset
    const currentTime = new Date(new Date().getTime() + timeZoneOffset * 60000);
    
    // Format the time as HH:mm (hours and minutes)
    const hours = currentTime.getUTCHours();
    const minutes = currentTime.getUTCMinutes();
    
    // Pad single-digit minutes with a leading zero
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    
    // Set the formatted time in the player
    audioPlayer.style.setProperty("--player-current-date-time", `'${formattedTime}'`);
}

// Call setMessageDate to set the initial time
setMessageDate();

function formatTimeToDisplay(seconds) {
	
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function handlePlayButton() {
    if (audio.paused) {
        audio.play().catch(error => {
            console.error('Error playing audio:', error.message);
        });
    } else {
        audio.pause();
    }
}

function handleSlider(e) {
    const { duration } = audio;
    const percent = e.target.value;
    const currentTimeInSeconds = ((percent * duration) / 100).toFixed(2);
    audio.currentTime = currentTimeInSeconds;
}

function updateCurrentTimeDisplay(time) {
    audioPlayer.style.setProperty("--player-current-time", `'${time}'`);
}

function updateCurrentPercent() {
    const { currentTime, duration } = audio;
    const percentPlayed = (currentTime * 100) / duration;
    slider.value = percentPlayed;
    audioPlayer.style.setProperty("--player-percent-played", `${percentPlayed}%`);
}

function showTimeDuration() {
    const { duration } = audio;
    const durationDisplay = formatTimeToDisplay(duration);
    updateCurrentTimeDisplay(durationDisplay);
}

function start() {
    btnPlayToggle.onclick = handlePlayButton;
    slider.oninput = handleSlider;

    audio.onplay = () => {
        audioPlayer.classList.add("playing");
        btnPlayToggle.textContent = 'Pause';
    };
    audio.onpause = () => {
        audioPlayer.classList.remove("playing");
        btnPlayToggle.textContent = 'Play';
    };
    audio.onloadeddata = () => {
        showTimeDuration();
        btnPlayToggle.style.display = 'block'; // Show play button on iOS
    };
    audio.ondurationchange = showTimeDuration;
    audio.onended = () => (audio.currentTime = 0);
    audio.ontimeupdate = () => {
        const { currentTime } = audio;
        const currentTimeDisplay = formatTimeToDisplay(currentTime);
        updateCurrentTimeDisplay(currentTimeDisplay);
        updateCurrentPercent();
        if (currentTime === 0) {
            showTimeDuration();
        }
    };
}

start();
