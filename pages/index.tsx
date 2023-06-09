import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import animarrow from '@/styles/animatedarrow.module.css'
import dynamic from 'next/dynamic'
import { generateAnswer } from '../requests/requests'
import { useState } from 'react'
import { useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline'

// const Spline: any = dynamic(() => import('@splinetool/react-spline'), {
//     ssr: false,
// })

function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<any>({
        width: undefined,
        height: undefined,
    })

    useEffect(() => {
        // only execute all the code below in client side
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        // Add event listener
        window.addEventListener('resize', handleResize)

        // Call handler right away so state gets updated with initial window size
        handleResize()

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize)
    }, []) // Empty array ensures that effect is only run on mount
    return windowSize
}

export default function Home() {
    const [gptResponse, setGptResponse] = useState<Array<string>>([])
    const [loading, setLoading] = useState<boolean>(false)
    const size = useWindowSize()
    const [spline, setSpline] = useState<any>(undefined)
    const objectToAnimate = useRef<any>()

    function onLoad(splineApp: any) {
        // save the app in a ref for later use
        // spline.current = splineApp
        objectToAnimate.current = splineApp.findObjectByName('Box_Opened')
        setSpline(splineApp)
        // console.log('done', spline)
    }

    // function triggerAnimation() {
    //     spline.emitEvent('lookAt', 'Box_Opened')
    // }

    const getGptResponse = async (e: any) => {
        e.preventDefault()
        console.log('event', e.target[0].value)
        setLoading(true)
        generateAnswer(e.target[0].value)
            .then((response) => {
                let curatedResponse = response.choices[0].text.replace(
                    /(\r\n|\n|\r|\.)/gm,
                    ''
                )
                console.log('curatedResponse', curatedResponse)
                curatedResponse = curatedResponse.split(/([0-9])/gm)
                curatedResponse = curatedResponse.filter(
                    (item: any, index: number) => index > 1 && index % 2 === 0
                )
                console.log('curatedResponse', curatedResponse)
                setGptResponse(curatedResponse)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                console.log('error', error)
            })
    }
    // useEffect(() => {
    //     if (typeof spline !== 'undefined') {
    //         triggerAnimation()
    //         console.log('useeffect', spline)
    //     }
    // }, [spline])

    useEffect(() => {
        console.log(size, spline)
        if (typeof spline !== 'undefined') {
            spline.canvas.width = 100
        }
    }, [size])

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.preloadedBackground}>
                <Spline
                    // style={{
                    //     width: `${size.width}px`,
                    //     height: `${size.height}px`,
                    // }}
                    onLoad={(sApp) => onLoad(sApp)}
                    scene="https://prod.spline.design/A7iGuvlZnH2GlLGn/scene.splinecode"
                />
            </div>
            <div className={animarrow.arrowContainer}>
                <div
                    className={`${animarrow.arrow} ${animarrow.arrowfirst}`}
                ></div>
                <div
                    className={`${animarrow.arrow} ${animarrow.arrowsecond}`}
                ></div>
                <div
                    className={`${animarrow.arrow} ${animarrow.arrowthird}`}
                ></div>
                <div
                    className={`${animarrow.arrow} ${animarrow.arrowforth}`}
                ></div>
            </div>
            <main className={styles.main}>
                <div className={styles.fullscreen}></div>
                {/* <div className={styles.inputContainer}> */}
                <form
                    onSubmit={(e) => getGptResponse(e)}
                    className={styles.inputContainer}
                >
                    <input
                        className={styles.mainInput}
                        type="text"
                        placeholder="Write the description of a friend or pet friend here"
                    ></input>
                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.inputButton}>
                            Send
                        </button>
                    </div>
                </form>

                {gptResponse.length > 0 && (
                    <div className="flex flex-col p-4 justify-center">
                        {gptResponse.map((item, index) => (
                            <div key={index}>
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                )}
                {/* </div> */}
            </main>
        </>
    )
}
