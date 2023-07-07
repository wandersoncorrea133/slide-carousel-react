/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Children, ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import styles from "./carousel.module.css"

interface CarouselProps {
  children: ReactNode[]
}

export function Carousel({children}: CarouselProps) {
  const containerRef = useRef<HTMLUListElement | null>(null)
  const intervalRef = useRef(0)

  const [current, setCurrent] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const actionHandler = useCallback((mode: string) => {
    if(containerRef.current) {
      containerRef.current.style.transitionDuration = "400ms";
    }
    
    if(mode === 'prev') {
      if (current <= 1) {
        setTranslateX(0)
        setCurrent(children.length)
      } else {
        if(containerRef.current){
          setTranslateX(containerRef?.current?.clientWidth * (current - 1))
        setCurrent((prev) => --prev)
        }
        
      }
    } else if(mode === "next") {
      if (containerRef.current && current >= children.length) {
        setTranslateX(containerRef?.current?.clientWidth * (children.length + 1))
        setCurrent(1)
      } else {
        if(containerRef.current) {
          setTranslateX(containerRef?.current?.clientWidth * (current + 1))
        setCurrent((next) => ++next)
        } 
      }
    }
  }, [current, children])


//  this is for inifinite slide
  useEffect(() => {
    const transitionEnd = () => {
      if(containerRef.current && current <= 1) {
        containerRef.current.style.transitionDuration = "0ms";
        setTranslateX(containerRef.current?.clientWidth * current)
      }

      if(containerRef.current && current >= children.length) {
        containerRef.current.style.transitionDuration = "0ms";
        setTranslateX(containerRef.current.clientWidth * children.length)
      }
    }

    document.addEventListener('transitionend', transitionEnd)

    return () => {
      document.removeEventListener('transitionend', transitionEnd)
    }
  }, [current, children])

  //  for autoplay 

  useEffect(() => {
    if(intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      actionHandler("next")
    }, 3000);

    return () => {
      if(intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [actionHandler])


  const slides = useMemo(() => {
    if(children && children.length > 1) {
      const items = Children.map(children, (child, index) => (<li key={index} className={styles.Slide}>{child}</li>))

      return [
        <li key={children.length + 1} className={styles.Slide}>{children[children.length - 1]}</li>,
        ...items,
        <li key={children.length + 2} className={styles.Slide}>{children[0]}</li>,
      ]
    }

    return  <li className={styles.Slide}>{children[0]}</li>
  }, [children])

  // position first element correctly e this will render only ones
  useLayoutEffect(() => {
    if(containerRef.current)
    setTranslateX(containerRef.current.clientWidth * current)
  }, [])


  return (
    <section className={styles.Root}>
      <ul ref={containerRef} className={styles.Container} style={{transform: `translate3d(${-translateX}px , 0, 0)`, transitionDuration: "400ms"}}>
        {slides}
      </ul>
      <button onClick={() => actionHandler("prev")} className={`${styles.Btn} ${styles.Left}`}>{'<'}</button>
      <button onClick={() => actionHandler("next")} className={`${styles.Btn} ${styles.Right}`}>{'>'}</button>
    </section>
  )
}