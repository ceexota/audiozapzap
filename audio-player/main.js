const url = new URL(window.location.href);
const audio_url = url.searchParams.get('audio');
const avatar_url = url.searchParams.get('avatar');

const audioPlayer = document.getElementById('audio-player');

document.getElementById('audio-avatar').src = avatar_url;
const audio = new Audio(audio_url);

// Configurar o volume inicial (0.0 mudo até 1.0 máximo)
audio.volume = 1.0; // Ajuste conforme necessário

const btnPlayToggle = audioPlayer.querySelector(".btn-play");
const slider = audioPlayer.querySelector("input[type='range']");

function formatTimeToDisplay(seconds) {
    const milliseconds = seconds * 1000;
    return new Date(milliseconds).toISOString().substring(14, 19);
}

function handlePlayButton() {
    if (audio.paused) {
        audio.play().catch(error => {
            console.error('Erro ao reproduzir áudio:', error.message);
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
        btnPlayToggle.textContent = 'Pause'; // Atualiza o texto do botão para 'Pause' quando o áudio começa a tocar
    };
    audio.onpause = () => {
        audioPlayer.classList.remove("playing");
        btnPlayToggle.textContent = 'Play'; // Atualiza o texto do botão para 'Play' quando o áudio é pausado
    };
    audio.onloadeddata = () => {
        // Show play button immediately upon audio data load
        audioPlayer.classList.remove("loading");
        btnPlayToggle.style.display = 'block';
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
