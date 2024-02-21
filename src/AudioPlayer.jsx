import React, { useState, useEffect } from "react";

function AudioPlayer() {
  const [audioList, setAudioList] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioRef, setAudioRef] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load audio list from storage or default
    const storedAudioList = JSON.parse(localStorage.getItem("audioList")) || [];
    setAudioList(storedAudioList);

    // Load last playing track and position
    const lastPlayingTrackIndex =
      parseInt(localStorage.getItem("lastPlayingTrackIndex"), 10) || 0;
    setCurrentTrackIndex(lastPlayingTrackIndex);
  }, []);

  useEffect(() => {
    // Update the audio source when the current track changes
    audioRef.src = audioList[currentTrackIndex]?.url || "";
    audioRef.play();
    setIsPlaying(true);
  }, [currentTrackIndex]);

  useEffect(() => {
    // Save current track index to localStorage
    localStorage.setItem("lastPlayingTrackIndex", currentTrackIndex.toString());
  }, [currentTrackIndex]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    const newAudioList = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setAudioList([...audioList, ...newAudioList]);
    localStorage.setItem(
      "audioList",
      JSON.stringify([...audioList, ...newAudioList])
    );
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % audioList.length);
  };

  return (
    <div>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        multiple
      />
      <audio ref={setAudioRef} onEnded={handleNext} controls />
      <div>
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button className="btn" onClick={handleNext}>
          Next
        </button>
      </div>
      <ul>
        {audioList.map((audio, index) => (
          <li key={index}>{audio.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AudioPlayer;
