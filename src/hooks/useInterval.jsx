import { useEffect, useRef } from "react";


export const useInterval = ( callback, delay ) => {
  const savedCallback = useRef( null )
  // Remember the latest callback.
  useEffect( () => {
    savedCallback.current = callback
  } )
  // Set up the interval.
  useEffect( () => {
    function tick() {
      if ( savedCallback.current !== null ) {
        savedCallback.current()
      }
    }
    const id = setInterval( tick, delay )
    return () => clearInterval( id )
  }, [ delay ] )
}