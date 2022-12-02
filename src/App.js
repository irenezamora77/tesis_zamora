// Importamos dependencias

import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useDraw } from "./hooks/useDraw";
import { useSpeechSynthesis } from "react-speech-kit";
import { useInterval } from "./hooks/useInterval";
import logo from './assets/img/logo.png';

// funcion principal de nuestro sistema
function App() {

  // El hook useRef tiene su origen en el método createRef que se emplea en los componentes de clases 
  // y que permitía crear una “referencia” a un elemento del DOM(interface HTML) creado durante el renderizado.

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [ shouldRecount, setShouldRecount ] = useState(true)
  
  const [ tickCooldown, setTickCooldown ] = useState(false)
  const [ voiceCooldown, setVoiceCooldown ] = useState(0)
  
  const {text,scores, wordOnCooldown} = useDraw(webcamRef,canvasRef, shouldRecount, setShouldRecount);
  const { speak } = useSpeechSynthesis();

  useInterval(()=>setShouldRecount(true),1000)
  useInterval(()=>setTickCooldown(!tickCooldown),1000)

  

  useEffect(()=>{
    if ( voiceCooldown> 0 && tickCooldown ){
      setVoiceCooldown(voiceCooldown-1)
    }
  },[tickCooldown])

  useEffect(( )=>{
    // speak - texto a audio
    // if (scores > 0.80) {
   // speak({ text: text })
    // }

    if ( wordOnCooldown !== text ){
      if ( scores > .9 && voiceCooldown === 0){
        speak({text: text})
        setVoiceCooldown(text.length>4 ? text.length-2 : text.length)
        console.log('Va a existir un cooldown de ',text.length+2)
      }
    }else{
      console.log(text,'is on cooldown')
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
