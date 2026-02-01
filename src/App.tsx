import React, { useState, useEffect, useCallback } from 'react';

interface DrumPadProps {
  id: string;
  keyTrigger: string;
  url: string;
  clipName: string;
  volume: number;
  power: boolean;
  updateDisplay: (name: string) => void;
}

const DrumPad: React.FC<DrumPadProps> = ({ 
  id, 
  keyTrigger, 
  url, 
  clipName, 
  volume, 
  power, 
  updateDisplay 
}) => {
  const [isActive, setIsActive] = useState(false);

  const playSound = useCallback(() => {
    if (!power) return;
    
    const audio = document.getElementById(keyTrigger) as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play();
      updateDisplay(clipName.replace(/-/g, ' '));
      setIsActive(true);
      setTimeout(() => setIsActive(false), 100);
    }
  }, [power, keyTrigger, volume, updateDisplay, clipName]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === keyTrigger) {
        playSound();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyTrigger, playSound]);

  return (
    <div 
      className={`drum-pad ${isActive ? 'active' : ''}`} 
      id={id}
      onClick={playSound}
    >
      {keyTrigger}
      <audio className="clip" id={keyTrigger} src={url}></audio>
    </div>
  );
};

const drumKits = {
  heater: [
    { keyCode: 81, keyTrigger: 'Q', id: 'Heater-1', url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3' },
    { keyCode: 87, keyTrigger: 'W', id: 'Heater-2', url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3' },
    { keyCode: 69, keyTrigger: 'E', id: 'Heater-3', url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3' },
    { keyCode: 65, keyTrigger: 'A', id: 'Heater-4', url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3' },
    { keyCode: 83, keyTrigger: 'S', id: 'Clap', url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },
    { keyCode: 68, keyTrigger: 'D', id: 'Open-HH', url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' },
    { keyCode: 90, keyTrigger: 'Z', id: "Kick-n'-Hat", url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3' },
    { keyCode: 88, keyTrigger: 'X', id: 'Kick', url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3' },
    { keyCode: 67, keyTrigger: 'C', id: 'Closed-HH', url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3' },
  ]
};

const App: React.FC = () => {
  const [power, setPower] = useState(true);
  const [display, setDisplay] = useState('READY');
  const [volume, setVolume] = useState(0.5);

  const updateDisplay = (name: string) => {
    if (power) setDisplay(name);
  };

  const handlePowerToggle = () => {
    setPower(!power);
    setDisplay(!power ? 'POWER ON' : 'POWER OFF');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setDisplay(`VOLUME: ${Math.round(val * 100)}%`);
  };

  return (
    <div className="container" id="drum-machine">
      <header className="header">
        <h1>VIBE STATION</h1>
        <p>Pro Drum Machine / 001</p>
      </header>

      <div className="main-layout">
        <div className="drum-grid">
          {drumKits.heater.map((pad) => (
            <DrumPad
              key={pad.id}
              id={pad.id}
              keyTrigger={pad.keyTrigger}
              url={pad.url}
              clipName={pad.id}
              volume={volume}
              power={power}
              updateDisplay={updateDisplay}
            />
          ))}
        </div>

        <div className="controls">
          <div className="display-section">
            <div id="display">{power ? display : ''}</div>
          </div>

          <div className="control-item">
            <div className="toggle-container">
              <label>Power</label>
              <label className="toggle-switch">
                <input type="checkbox" checked={power} onChange={handlePowerToggle} />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="control-item">
            <label>Master Volume</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={handleVolumeChange} 
            />
          </div>

          <div style={{ marginTop: 'auto', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)', opacity: 0.5 }}>
              SINCED WITH GITHUB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
