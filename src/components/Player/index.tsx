import styles from "./styles.module.scss";

import { useRef, useEffect } from "react";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { usePlayer } from "../../contexts/PlayerContext";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    setPlayingState,
    playPrevious,
    playNext,
    hasNext,
    hasPrevious,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <div
            className={styles.imageHolder}
            style={{
              backgroundImage: `url(${episode.thumbnail})`,
            }}
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onPlay={() => {
              setPlayingState(true);
            }}
            onPause={() => {
              setPlayingState(false);
            }}
          ></audio>
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={() => {
              return toggleShuffle();
            }}
            className={isShuffling ? styles.isActive : ""}
            disabled={!episode || episodeList.length === 1}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            onClick={() => {
              return playPrevious();
            }}
            disabled={!episode || !hasPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={() => {
              return togglePlay();
            }}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              return playNext();
            }}
            disabled={!episode || !hasNext}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            onClick={() => {
              return toggleLoop();
            }}
            className={isLooping ? styles.isActive : ""}
            disabled={!episode}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
