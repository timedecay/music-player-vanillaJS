// <----------- constant------------>
const log = console.log.bind(console);
const e = selector => document.querySelector(selector);
const es = selector => document.querySelectorAll(selector);

const audio = e('#id-music-player');
const title = e('#id-title');
const inner = e('.class-slide-inner');
const outer = e('.class-slide-outer');

const playBtn = e('#id-button-play');
const nextBtn = e('#id-button-next');
const prevBtn = e('#id-button-prev');

const songs = [
  'Bach Air on the G String from Orchestral Suite No. 3 in D major, BWV 1068',
  'Beethoven Piano Concerto No. 5 Emperor II. Adagio un poco mosso',
  "Chopin Polonaise in A-flat major 'Heroique', Op. 53",
];

let index = 0;

async function loadSong(song) {
  title.innerHTML = await song;
  audio.src = await `audio/${song}.mp3`;
  await playSong();
}

const updateCurrentTime = cut => {
  let ct = e('#id-music-current');
  let ctMinutes = Math.floor(cut / 60);
  let ctSeconds = Math.floor(cut - ctMinutes * 60);
  ctMinutes < 10 ? (ctMinValue = '0' + ctMinutes) : (ctMinValue = ctMinutes);
  ctSeconds < 10 ? (ctSecValue = '0' + ctSeconds) : (ctSecValue = ctSeconds);
  let current = ctMinValue + ':' + ctSecValue;
  ct.innerHTML = current;
};

const updateDuration = dur => {
  if (isNaN(dur)) {
    return;
  }

  let dt = e('#id-music-duration');
  let dtMinutes = Math.floor(dur / 60);
  let dtSeconds = Math.floor(dur - dtMinutes * 60);
  dtMinutes < 10 ? (dtMinValue = '0' + dtMinutes) : (dtMinValue = dtMinutes);
  dtSeconds < 10 ? (dtSecValue = '0' + dtSeconds) : (dtSecValue = dtSeconds);
  let duration = dtMinValue + ':' + dtSecValue;
  dt.innerHTML = duration;
};

const updateProgress = audio => {
  const { duration, currentTime } = audio.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  inner.style.width = `${progressPercent}%`;
  updateCurrentTime(currentTime);
  updateDuration(duration);
};

const bindEventTimeUpdate = audio => {
  audio.addEventListener('timeupdate', updateProgress);
};

// <----------- 进度条 ----------->
function showProgress(event) {
  const width = this.clientWidth;
  const clickX = event.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

const bindEventRangeSlider = () => {
  const slider = e('.class-range-slider');
  slider.addEventListener('click', showProgress);
};

// <------------  结束事件 --------------->
const bindEventEnded = function (audio) {
  audio.addEventListener('ended', nextSong);
};

// <-- play & pause -->
const playSong = () => {
  const play = audio.play();
  if (play !== undefined) {
    play.then(_ => {
      playBtn.classList.remove('fa-play');
      playBtn.classList.add('fa-pause');
    });
  }
};

const pauseSong = () => {
  playBtn.classList.remove('fa-pause');
  playBtn.classList.add('fa-play');
  audio.pause();
};

const bindEventPlayControl = audio => {
  playBtn.addEventListener('click', function () {
    if (audio.paused) {
      playSong();
    } else {
      pauseSong();
    }
  });
};

// <--- next & prev --->
const nextSong = () => {
  index = index + 1;
  index > songs.length - 1 ? (index = 0) : index;
  loadSong(songs[index]);
};

const bindEventNextSong = () => {
  nextBtn.addEventListener('click', nextSong);
};

const prevSong = () => {
  index = index - 1;
  index < 0 ? (index = songs.length - 1) : index;
  loadSong(songs[index]);
};

const bindEventPrevSong = () => {
  prevBtn.addEventListener('click', prevSong);
};

//  <------ 事件绑定 ------>
const bindEvents = () => {
  bindEventPlayControl(audio);
  bindEventEnded(audio);
  bindEventNextSong();
  bindEventPrevSong();
  bindEventTimeUpdate(audio);
  bindEventRangeSlider();
};

const __main = function () {
  audio.volume = 0.1;
  log(`听力保护，音量已降至 ${audio.volume}`);
  bindEvents();
};

__main();
