// Importamos dependencias

import "./App.css";
import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useDraw } from "./hooks/useDraw";
import { useSpeechSynthesis } from "react-speech-kit";

import logo from './assets/img/logo.png';

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const {text,scores} = useDraw(webcamRef,canvasRef);

  const { speak } = useSpeechSynthesis();

  useEffect(( )=>{

    console.log('palabra ',text);
    console.log('puntaje ',scores); 
    
    // speak - texto a audio
    if (scores > 0.90) {
      speak({ text: text })
    }

    

  },[text])

  
  return (
    <div className="App">
    <div>
          <h1>Traductor de señas - BioSonic</h1>
    </div>
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 540,
            height: 380,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 540,
            height: 380,
          }}
        />
      </header>

      <div>
        <div>
          <h2>Proyecto Final - Irene Zamora</h2>
        </div>
        <div>
          <img src={logo} alt="logo" style={{ width: 200,}} />
        </div>
      </div>

    </div>

  );
}

export default App;
