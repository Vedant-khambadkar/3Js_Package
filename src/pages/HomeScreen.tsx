import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import BG from '../assets/images/bg.png';

const HomeScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLDivElement>(null);
  const rightArrowRef = useRef<HTMLDivElement>(null);
  const centerRectRef = useRef<HTMLDivElement>(null);
  const animateRectRef = useRef<HTMLDivElement>(null);
  const bgBlurRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  const paraword = useRef<HTMLParagraphElement>(null);
  const designSlotRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const calcTargetPosition = () => {
        if (!wordRef.current || !designSlotRef.current) {
          return { targetX: 0, targetY: 0, targetFontSize: '7rem' };
        }
        const wordEl = wordRef.current;
        const slotEl = designSlotRef.current;

        const targetFontSize = window.getComputedStyle(slotEl).fontSize;
        const targetLineHeight = window.getComputedStyle(slotEl).lineHeight;

        const prevStyle = wordEl.getAttribute('style') || '';

        // Temporarily set target typography without transforms to measure true layout position
        gsap.set(wordEl, {
          x: 0,
          y: 0,
          fontSize: targetFontSize,
          letterSpacing: '0px',
          paddingLeft: '0px',
          fontWeight: '500',
          lineHeight: targetLineHeight,
        });

        const naturalWordRect = wordEl.getBoundingClientRect();
        const slotRect = slotEl.getBoundingClientRect();

        const targetX = slotRect.left - naturalWordRect.left;
        const targetY = slotRect.top - naturalWordRect.top;

        if (prevStyle) {
          wordEl.setAttribute('style', prevStyle);
        } else {
          wordEl.removeAttribute('style');
        }

        return { targetX, targetY, targetFontSize };
      };

      const { targetX, targetY, targetFontSize } = calcTargetPosition();

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      // 1. Initial simultaneous reveals
      tl.from(
        leftArrowRef.current,
        {
          x: 100,
          duration: 0.5,
          autoAlpha: 0,
          ease: 'power3.out',
        },
        'arrow'
      )
        .from(
          rightArrowRef.current,
          {
            x: -100,
            duration: 0.5,
            autoAlpha: 0,
            ease: 'power3.out',
          },
          'arrow'
        )
        .from(
          centerRectRef.current,
          {
            clipPath: 'inset(50% 0% 50% 0%)',
            duration: 0.5,
          },
          'centerRect'
        );

      // 2. Red bar shrinks down from wide band to crisp thin diagonal accent
      tl.to(animateRectRef.current, {
        height: '4vh',
        duration: 0.5,
        ease: 'power1.out',
      });

      // 3. "DESIGN" typography unfolds with letter-spacing from faint to sharp black
      tl.from(wordRef.current, {
        letterSpacing: '0.2vw',
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.out',
      });

      // 4. "DESIGN" shifts slightly up, paragraph reveals below, and ambient whitish blur fades in
      tl.to(
        wordRef.current,
        {
          y: '-1vw',
          letterSpacing: '0.4em',
          color: '#ffffffe0',
          duration: 0.7,
          ease: 'power2.out',
        },
        'wordAnimate'
      )
        .to(
          paraRef.current,
          {
            y: '-1vw',
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power2.out',
          },
          'wordAnimate'
        )
        .to(
          numberRef.current,
          {
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power2.out',
          },
          'wordAnimate'
        )
        .to(
          bgBlurRef.current,
          {
            autoAlpha: 0.35,
            duration: 0.7,
            ease: 'power2.out',
          },
          'wordAnimate'
        );

      // 5. Center canvas expands to fill viewport
      tl.to(
        centerRectRef.current,
        {
          width: '100vw',
          height: '100vh',
          duration: 0.5,
          ease: 'power1.in',
        },
        'remove'
      ).to(
        paraRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power1.inOut',
        },
        'remove'
      ).to(animateRectRef.current, {
        background: "linear-gradient(90deg, #c3423cff 0%, #931313ff 50%, #6e0000 100%)",
        duration: 0.5,
        ease: "power1.inOut",
      }, 'remove')
        .to(leftArrowRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power1.inOut'
        }, 'remove')
        .to(rightArrowRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power1.inOut'
        }, 'remove')


      tl.to(wordRef.current, {
        duration: 0.8,
        x: targetX,
        y: targetY,
        fontSize: targetFontSize,
        letterSpacing: "0",
        paddingLeft: "0px",
        color: "#ea4d4dff",
        ease: "power1.inOut",
      }, "animateposition")
        .to(paraword.current, {
          duration: 0.7,
          opacity: 1,
          ease: "power1.inOut",
        }, "animateposition")
        .to('.social-icon', {
          color: '#ffffff',
          autoAlpha: 1,
          duration: 0.1,
          ease: 'power1.inOut',
        }, 'animateposition')
        .to(".textColorChange", {
          color: '#ffffff',
          autoAlpha: 1,
          duration: 0.1,
          ease: 'power1.inOut',
        }, 'animateposition')
        .from(".char-word", {
          opacity: 0,
          duration: 0.4,
          stagger: {
            amount: 0.8,
            from: "random",
          },
          ease: "power2.out",
        });

      const handleResize = () => {
        if (tl.progress() === 1 && wordRef.current && designSlotRef.current) {
          const { targetX: rx, targetY: ry, targetFontSize: rFs } = calcTargetPosition();
          gsap.set(wordRef.current, { x: rx, y: ry, fontSize: rFs });
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none bg-[#f5f5f7] font-sans"
    >
      {/* Ambient Soft Architectural Blur & Whitish Background */}
      <div
        ref={bgBlurRef}
        className="pointer-events-none absolute inset-0 opacity-0 invisible will-change-[opacity] z-0"
      >
        <img
          src={BG}
          alt="ambient background"
          className="w-full h-full object-cover object-center filter blur-md grayscale brightness-125 contrast-75"
        />
        <div className="absolute inset-0 bg-white/75 backdrop-blur-sm" />
      </div>

      {/* Outer Border Framing - Proportional on all screens */}
      <div className="pointer-events-none relative w-full h-full z-20">
        <div className="absolute top-0 w-full h-[6vw] min-h-[38px] max-h-[64px] flex items-center justify-between px-4 sm:px-6">
          <div className="w-12 sm:w-16 md:w-20 h-6 sm:h-8 md:h-10 bg-gray-300 rounded-full"></div>
          <div className="w-12 sm:w-16 md:w-20 h-6 sm:h-8 md:h-10 bg-gray-300 rounded-full"></div>
          <div className="w-12 sm:w-16 md:w-20 h-6 sm:h-8 md:h-10 bg-gray-300 rounded-full"></div>
        </div>
        <div className="absolute left-0 top-0 w-[6vw] min-w-[36px] max-w-[64px] h-full flex flex-col items-center justify-around py-16 sm:py-20 md:py-28 font-['outfit'] select-none">
          <div className="textColorChange text-[9px] sm:text-[11px] md:text-xs tracking-[0.2em] font-medium whitespace-nowrap -rotate-90 origin-center flex items-center justify-center">
            CREATIVE
          </div>
          <div className="textColorChange text-[9px] sm:text-[11px] md:text-xs tracking-[0.2em] font-medium whitespace-nowrap -rotate-90 origin-center flex items-center justify-center">
            3D MODELS
          </div>
          <div className="textColorChange text-[9px] sm:text-[11px] md:text-xs tracking-[0.2em] font-medium whitespace-nowrap -rotate-90 origin-center flex items-center justify-center">
            PACKAGES
          </div>
        </div>
        <div className="absolute right-0 top-0 w-[6vw] min-w-[36px] max-w-[64px] h-full flex flex-col items-center justify-center gap-2.5 sm:gap-3 md:gap-4">
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="social-icon w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-gray-700 hover:text-[#ff2d20] rounded-full flex items-center justify-center pointer-events-auto transition-transform duration-300 hover:scale-110 shadow-sm"
          >
            <svg className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="social-icon w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-gray-700 hover:text-[#ff2d20] rounded-full flex items-center justify-center pointer-events-auto transition-transform duration-300 hover:scale-110 shadow-sm"
          >
            <svg className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="social-icon w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-gray-700 hover:text-[#ff2d20] rounded-full flex items-center justify-center pointer-events-auto transition-transform duration-300 hover:scale-110 shadow-sm"
          >
            <svg className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="social-icon w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-gray-700 hover:text-[#ff2d20] rounded-full flex items-center justify-center pointer-events-auto transition-transform duration-300 hover:scale-110 shadow-sm"
          >
            <svg className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="social-icon w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-gray-700 hover:text-[#ff2d20] rounded-full flex items-center justify-center pointer-events-auto transition-transform duration-300 hover:scale-110 shadow-sm"
          >
            <svg className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-[6vw] min-h-[38px] max-h-[64px] flex items-center justify-between px-4 sm:px-6">
          {/* Dollar SVG */}
          <button
            type="button"
            aria-label="Dollar"
            className="textColorChange w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-gray-700 hover:text-[#ff2d20] rounded-full flex items-center justify-center pointer-events-auto transition-transform duration-300 hover:scale-110 cursor-pointer"
          >
            <svg
              className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          </button>

          {/* Cross SVG */}
          <button
            type="button"
            aria-label="Close"
            className="textColorChange w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-gray-700 hover:text-[#ff2d20] rounded-full flex items-center justify-center pointer-events-auto transition-transform duration-300 hover:scale-110 cursor-pointer"
          >
            <svg
              className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 stroke-current fill-none stroke-[2.5]"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Share SVG */}
          <button
            type="button"
            aria-label="Share"
            className="textColorChange w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-gray-700 hover:text-[#ff2d20] rounded-full flex items-center justify-center pointer-events-auto transition-transform duration-300 hover:scale-110 cursor-pointer"
          >
            <svg
              className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Central Architectural Box (Peephole Card) */}
      <div
        ref={centerRectRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] sm:w-[160px] md:w-[13vw] max-w-[100vw] h-[60vh] sm:h-[68vh] md:h-[72vh] overflow-hidden bg-white z-10"
      >
        {/* Full-screen fixed background container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen pointer-events-none">
          <img
            src={BG}
            alt="architectural surface"
            className="w-full h-full object-cover object-center filter grayscale brightness-110"
          />

          {/* Diagonal Red Accent Bar - spans across screen edges on all devices */}
          <div
            ref={animateRectRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] lg:w-[50vw] h-[70vh] -rotate-35 origin-center will-change-[height] z-[3]"
            style={{
              background: 'linear-gradient(90deg, #ff2d20 0%, #ff2d20 50%, #ff2d20 100%)',
            }}
          />

          {/* Editorial Text Content (Layered in front of red bar) */}
          <div className="absolute top-[45%] left-[12%] sm:left-[10%] md:left-[18%] -translate-y-1/2 max-w-[84vw] sm:max-w-[80vw] md:max-w-[55vw] z-[10]">
            <h2 className="text-[clamp(2.2rem,6.5vw,5.2rem)] text-white font-medium leading-tight font-['Doppio_One'] whitespace-nowrap">
              {"OUR COMPLETE".split("").map((char, i) => (
                <span key={`line1-${i}`} className="char-word inline-block">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h2>
            <h2 className="text-[clamp(2.2rem,6.5vw,5.2rem)] text-white font-medium leading-tight font-['Doppio_One'] flex items-baseline whitespace-nowrap">
              <span
                ref={designSlotRef}
                className="inline-block opacity-0 pointer-events-none select-none mr-[0.45em]"
              >
                DESIGN
              </span>
              {"SERVICE".split("").map((char, i) => (
                <span key={`line2-${i}`} className="char-word inline-block">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h2>
            <p ref={paraword} className='text-white/60 text-[13px] sm:text-sm md:text-[1rem] mt-3 opacity-0 max-w-[80vw] sm:max-w-[75vw] md:max-w-[48vw] leading-relaxed'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique illum eum doloremque tenetur sequi soluta corrupti harum dolorem a cumque earum distinctio repellendus ducimus porro sit, totam animi, odit adipisci?
            </p>
          </div>
        </div>
      </div>

      {/* Side Arrows / Indicator Elements */}
      <div
        ref={leftArrowRef}
        className="absolute top-1/2 -translate-y-1/2 left-[4%] sm:left-[8%] md:left-[12%] w-[8vw] sm:w-[7vw] h-[6vw] sm:h-[5vw] max-w-[80px] max-h-[60px] bg-gray-200 will-change-transform z-20"
      />
      <div
        ref={rightArrowRef}
        className="absolute top-1/2 -translate-y-1/2 right-[4%] sm:right-[8%] md:right-[12%] w-[8vw] sm:w-[7vw] h-[6vw] sm:h-[5vw] max-w-[80px] max-h-[60px] bg-gray-200 will-change-transform z-20"
      />

      {/* Center Editorial Typography & Paragraph in Foreground */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[60vw] flex flex-col items-center justify-center gap-2 z-30">
        <h1
          ref={wordRef}
          className='font-bold text-4xl sm:text-6xl md:text-7xl lg:text-9xl tracking-[0.4em] sm:tracking-[0.6em] md:tracking-[0.7em] text-black will-change-[transform,opacity] font-["Doppio_One"] pl-[0.4em] sm:pl-[0.6em] md:pl-[0.7em] whitespace-nowrap'
        >
          DESIGN
        </h1>

        <p
          ref={paraRef}
          className="opacity-0 invisible mt-5 text-[11px] sm:text-[13px] text-black/75 max-w-[280px] sm:max-w-[340px] md:max-w-[420px] break-words text-center font-normal leading-relaxed will-change-[transform,opacity]"
        >
          We can help you develop solutions for your facility that serve your
          needs, maximize your property utilization.
        </p>
      </div>

      {/* Bottom-Right Faint Watermark "002" */}
      <div
        ref={numberRef}
        className='pointer-events-none absolute bottom-[4%] sm:bottom-[6%] right-[5%] sm:right-[8%] text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-light text-black/[0.06] tracking-tighter opacity-0 invisible font-["Doppio_One"] select-none z-10 will-change-[opacity]'
      >
        002
      </div>

    </div>
  );
};

export default HomeScreen;