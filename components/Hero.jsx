import Image from "next/image";
import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const particlesConfig = {
  fullScreen: {
    enable: false,
    zIndex: 1,
  },
  particles: {
    number: {
      value: 16,
      density: {
        enable: false,
        value_area: 800,
      },
    },
    color: {
      value: "#179942",
    },
    shape: {
      type: "polygon",
      options: {
        sides: 4,
      },
    },
    opacity: {
      value: 0.8,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 2.2,
      random: false,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    // rotate: {
    //   value: 0,
    //   random: true,
    //   direction: "clockwise",
    //   animation: {
    //     enable: true,
    //     speed: 5,
    //     sync: false,
    //   },
    // },
    line_linked: {
      enable: true,
      distance: 120,
      color: "#a0dbaa",
      opacity: 0.8,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: false,
      straight: true,
      out_mode: "out",
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: ["grab"],
      },
      onclick: {
        enable: false,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 300,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: {
        distance: 200,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
  // background: {
  //   color: "#111",
  //   image: "",
  //   position: "50% 50%",
  //   repeat: "no-repeat",
  //   size: "cover",
  // },
};

const Hero = () => {
  const particlesInit = async (main) => {
    // console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };

  return (
    <div className="w-full py-8">
      <div className="container">
        <div dir="ltr" className="grid grid-cols-12 gap-y-8 gap-x-4">
          <div className="col-span-12 md:col-span-6 flex items-center justify-center">
            <Image
              src="/pp.jpg"
              // src="/t.png"
              width={500}
              height={700}
              className="object-cover hover:scale-95 duration-500 ease-in shadow-sm shadow-gray-600 "
              alt=""
            />
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-col justify-center items-center">
            <p dir="rtl" className="text-tasi text-2xl md:text-5xl text-right">
              منصة تصويت ودردشة مع متداولين في سوق الأسهم السعودي (تداول ).
            </p>
            {/* <hr className="mt-8 mb-4 w-full h-[2px] bg-gray-400" /> */}
            <div className="w-full">
              {/* <Particles
                className="w-full h-[140px] bg-transparent shadow-md"
                id="tsparticles"
                init={particlesInit}
                options={particlesConfig}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
