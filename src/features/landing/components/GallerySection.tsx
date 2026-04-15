"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

export default function GallerySection() {
  const t = useTranslations("landing.gallery");

  const images = [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000",
    "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1000",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1000",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1000"
  ];

  return (
    <section className="w-full py-32 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center px-6 mb-20 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-secondary mb-6 leading-tight">
          {t("title")}
        </h2>
        <p className="text-content-muted text-xl md:text-2xl max-w-3xl leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <div className="w-full">
        <Swiper
          modules={[Autoplay, EffectCoverflow]}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1.3}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 150,
            modifier: 2,
            slideShadows: false,
          }}
          breakpoints={{
            768: { slidesPerView: 1.8 },
            1024: { slidesPerView: 2.5 },
          }}
          className="w-full !pb-14"
        >
          {images.map((imgUrl, index) => (
            <SwiperSlide key={index} className="transition-all duration-500">
              <div className="w-full aspect-[16/10] bg-card rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden relative group">
                <Image 
                  src={imgUrl} 
                  alt={t("screen_title")} 
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-secondary font-black text-lg shadow-xl">
                    {t("screen_title")} {index + 1}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}