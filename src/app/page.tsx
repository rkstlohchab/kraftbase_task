"use client";
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    SiDropbox,
} from 'react-icons/si';
import { FaLock } from 'react-icons/fa';
import { VscSymbolStructure } from "react-icons/vsc";
import { GoMegaphone } from "react-icons/go";
import { MdOutlineColorLens } from "react-icons/md";
import { FaPaintBrush } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}


interface PositionStyle {
    top: string;
    left: string;
    width: string;
    height: string;
}

interface FinalPositions {
    [key: string]: PositionStyle;
}

interface BlockProps {
    id: string;
    className?: string;
    children: React.ReactNode;
}

const Block: React.FC<BlockProps> = ({ id, className, children }) => (
    // Starts as absolute, positioned by GSAP later.
    <div id={id} className={`block-item absolute md:w-1/3 lg:w-1/4 w-11/12 h-1/6 md:h-1/5 ${className} flex items-center justify-center p-4 shadow-xl text-center transition-all duration-300`}>
        <div className="flex flex-col items-center">
             {children}
        </div>
    </div>
);


export default function Home() {
    const mainRef = useRef(null);
    const pinRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        console.log("useEffect running: GSAP setup starting.");

        if (!mainRef.current || !pinRef.current || !canvasRef.current) {
            console.error("Refs not available!");
            return;
        }

        const blocks = gsap.utils.toArray('.block-item') as HTMLElement[];
        console.log(`Found ${blocks.length} blocks.`);

        const ctx = gsap.context(() => {


            blocks.forEach(block => {
                let initialPosition;
                switch(block.id) {
                    case 'framework':
                        initialPosition = { top: '-20%', left: '0%' };
                        break;
                    case 'voice-tone':
                        initialPosition = { top: '-20%', left: '100%' };
                        break;
                    case 'logo-side':
                        initialPosition = { top: '50%', left: '-20%' };
                        break;
                    case 'logo-center':
                        initialPosition = { top: '50%', left: '50%' };
                        break;
                    case 'typography':
                        initialPosition = { top: '50%', left: '120%' };
                        break;
                    case 'iconography':
                        initialPosition = { top: '120%', left: '-20%' };
                        break;
                    case 'color':
                        initialPosition = { top: '120%', left: '50%' };
                        break;
                    case 'imagery':
                        initialPosition = { top: '120%', left: '0%' };
                        break;
                    case 'motion':
                        initialPosition = { top: '120%', left: '120%' };
                        break;
                }
                gsap.set(block, {
                    ...initialPosition,
                    autoAlpha: 0,
                    scale: 0.1,
                    xPercent: -50,
                    yPercent: -50
                });
            });

            // Ensure intro elements are visible at start
            gsap.set("#intro1", { autoAlpha: 1, scale: 1 });
            gsap.set("#intro2", { autoAlpha: 0, scale: 0.8 });
            
            // --- Define Final Positions (as % for responsiveness) ---
            const finalPos: FinalPositions = {
                "framework":   { top: '2%',   left: '2%',   width: '31%', height: '22%' },
                "voice-tone":  { top: '2%',   left: '35%',  width: '63%', height: '22%' },
                "logo-side":   { top: '25%',  left: '2%',   width: '56%', height: '15%' },
                "logo-center": { top: '40.5%',  left: '38%',  width: '20%', height: '9%' },
                "typography":  { top: '25%',  left: '59%',  width: '39%', height: '24.5%' },
                "iconography": { top: '40.5%',  left: '2%',   width: '35%', height: '32.5%' },
                "color":       { top: '50%',  left: '38%',  width: '60%', height: '23%' },
                "imagery":     { top: '74%',  left: '2%',   width: '64%', height: '23%' },
                "motion":      { top: '74%',  left: '67%',  width: '31%', height: '23%' },
            };

            // Set initial z-index states
            gsap.set("#intro1", { zIndex: 30 });
            gsap.set("#intro2", { zIndex: 25 });
            gsap.set(blocks, { zIndex: 10 });

            const tl = gsap.timeline();

            // Quick intro animations
            tl.to("#intro1", { 
                autoAlpha: 0, 
                scale: 0.8, 
                duration: 0.5,
                ease: "power1.out"
            })
            .to("#intro2", { 
                autoAlpha: 1, 
                scale: 1, 
                duration: 0.5,
                ease: "power1.out"
            }, "-=0.3")
            .to("#intro2", { 
                autoAlpha: 0, 
                y: -50, 
                duration: 0.5,
                ease: "power1.out"
            }, "+=0.5")
            // After intro animations, set intro elements to back
            .set(["#intro1", "#intro2"], { zIndex: -1 });

            // Then animate the blocks
            blocks.forEach((block, index) => {
                tl.to(block, {
                    ...finalPos[block.id],
                    autoAlpha: 1,
                    scale: 1,
                    xPercent: 0,
                    yPercent: 0,
                    duration: 1.5,
                    ease: "power2.inOut"
                }, index * 0.2);
            });

            // --- Create ScrollTrigger ---
            ScrollTrigger.create({
                animation: tl,
                trigger: mainRef.current,
                pin: pinRef.current,
                start: "top top",
                end: "+=4000",
                scrub: 1.2,
                anticipatePin: 1,
                invalidateOnRefresh: true
            });

            console.log("GSAP setup complete.");

        }, mainRef); 
        return () => {
            console.log("Cleaning up GSAP.");
            ctx.revert(); 
            ScrollTrigger.getAll().forEach(st => st.kill()); 
        };
    }, []); 

     const GridBackground = () => (
        <div className="absolute inset-0 z-0 opacity-60">
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-8 opacity-50">
                {[...Array(48)].map((_, i) => (
                    <div key={i} className="border border-blue-100"></div>
                ))}
            </div>
             <div className="absolute inset-0 grid grid-cols-3 grid-rows-4 opacity-70">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="border border-blue-200"></div>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <div ref={mainRef} className="relative bg-white">

                <div ref={pinRef} className="h-screen w-full overflow-hidden">
                   <div ref={canvasRef} className="relative w-full h-full">

                        <GridBackground />

                        
                        <div id="intro1" className="absolute inset-0 flex items-center justify-center z-20">
                           <div className="text-center p-8 max-w-lg">
                                <SiDropbox className="text-6xl text-blue-600 mx-auto mb-6" />
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                                    At Dropbox, our Brand Guidelines help us infuse everything we make with identity.
                                </h1>
                            </div>
                        </div>
                        <div id="intro2" className="absolute inset-0 flex items-center justify-center z-20">
                             <div className="text-center p-8 max-w-lg bg-blue-600 text-white rounded-xl shadow-2xl">
                                <SiDropbox className="text-6xl text-white mx-auto mb-6" />
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                                    From icons to illustration, logos to language...
                                </h2>
                            </div>
                        </div>

                        <Block id="framework" className="bg-gray-900 text-white">
                            <VscSymbolStructure className="text-4xl mb-1" /> Framework
                        </Block>
                        <Block id="voice-tone" className="bg-yellow-400 text-gray-800">
                           <GoMegaphone className="text-4xl mb-1" /> Voice & Tone
                        </Block>
                        <Block id="logo-side" className="bg-cyan-400 text-gray-900">
                           <SiDropbox className="text-5xl mb-1" /> Logo
                        </Block>
                        <Block id="logo-center" className="bg-blue-600 text-white">
                             <SiDropbox className="text-7xl" />
                        </Block>
                        <Block id="typography" className="bg-red-500 text-white">
                              <span className="text-5xl font-serif">Aa</span> Typography
                        </Block>
                        <Block id="iconography" className="bg-lime-500 text-gray-900">
                             <FaLock className="text-4xl mb-1" /> Iconography
                         </Block>
                         <Block id="color" className="bg-orange-500 text-white">
                             <MdOutlineColorLens className="text-4xl mb-1" /> Color
                         </Block>
                        <Block id="imagery" className="bg-fuchsia-800 text-white">
                             <FaPaintBrush className="text-4xl mb-1" /> Imagery
                         </Block>
                         <Block id="motion" className="bg-violet-400 text-gray-900">
                            <HiOutlineSparkles className="text-4xl mb-1" /> Motion
                         </Block>

                   </div>
                </div>
            </div>
        </>
    );
}