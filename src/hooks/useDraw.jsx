// Importamos dependencias

import * as tf from "@tensorflow/tfjs";
import { useState } from "react";
import { useEffect } from "react";
import { useInterval } from './useInterval'
import usePrevious from './usePrevious'
const labelMap = {
  1:{name:'hola', color:'red'},
  2:{name:'gracias', color:'yellow'},
  3:{name:'amor', color:'lime'},
  4:{name:'si', color:'blue'},
  5:{name:'chau', color:'purple'},
};

export const useDraw = (webcamRef, canvasRef, shouldRecount, setShouldRecount) => {
  const [ currentCount, setCurrentCount ] = useState({fail:0, repeat:0, total: 0})
  // El término asíncrono se refiere a una situación en la que dos o más eventos no ocurren al mismo tiempo. 
  // O en términos más sencillos, pueden suceder varias cosas relacionadas sin esperar a que se complete la acción anterior.

  const [text,setText] = useState()
  const prevText = usePrevious(text)
  const [wordOnCooldown, setWordOnCooldown ] = useState('')
  const [scores,setScores] = useState()

  const runCoco = async () => {
  // 1. Cargo el modelo desde Github
  const net = await tf.loadGraphModel('https://raw.githubusercontent.com/irenezamora77/tesis_zamora_model/main/model.json')
    // Bucle de detaccion de manos
    // setInterval(() => {
    //   detect(net);
    // }, 16.7);
    detect(net)
    setShouldRecount(false)
    if ( text === prevText ){
      setWordOnCooldown(text)
    }
  };

  // detect trabaja con los datos de la camara, dibujo y se utiliza dentro de runCoco
  const detect = async (net) => {
    // Compruebo que los datos de la camara están disponibles
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Se obtiene propiedades de video
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Se establece ancho de video
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Se establece la altura y el ancho del canva
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Genero las detecciones 
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [320,320])
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const obj = await net.executeAsync(expanded)
     
      const boxes = await obj[1].array()
      const classes = await obj[2].array()
      const scores = await obj[4].array()
      
      // Draw mesh ????
      const ctx = canvasRef.current.getContext("2d");

      // Actualizo utilidad de dibujo
      // drawSomething(obj, ctx)  
      requestAnimationFrame(()=>{drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx)}); 

      // requestAnimationFrame es una forma de poner una función en cola para ser ejecutada 
      // por el navegador en un tiempo óptimo para el rendimiento del renderizado.

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)
    }
  };

  // Defino una función de dibujo, la ultizo dentro de const detect
  const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) => {
    for (let i = 0; i <= boxes.length; i++) {
      

      if (boxes[i] && classes[i] && scores[i] > threshold) {

        // Extraigo variables
        const [y, x, height, width] = boxes[i];
        const text = classes[i];
        
        

        // Establezco estilo
        ctx.strokeStyle = labelMap[text]["color"];
        ctx.lineWidth = 10;
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        // DRAW!!
        ctx.beginPath();
        ctx.fillText(
          labelMap[text]["name"] + " - " + Math.round(scores[i] * 100) / 100,
          x * imgWidth,
          y * imgHeight - 10
        );
        ctx.rect(
          x * imgWidth,
          y * imgHeight,
          (width * imgWidth) / 2,
          (height * imgHeight) / 1.5
        );
        ctx.stroke();

        setText(labelMap[text]["name"])
        setScores( Math.round(scores[i] * 100) / 100)
        
      }
    }
  };

// un hook que recibe como parámetro una función que se ejecutará cada vez que nuestro componente se renderice, 
// ya sea por un cambio de estado o por recibir props nuevas.

  useEffect(()=>{
    if ( shouldRecount ){
      runCoco()
    }
    else{
      // setCurrentCount({repeat})
    }
  },[shouldRecount]);


  return { text,scores, wordOnCooldown };
};