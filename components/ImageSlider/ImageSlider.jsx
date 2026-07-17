'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import { A11y, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { getProductMessages } from '@/lib/i18n/messages.mjs';

import SafeImage from '../SafeImage/SafeImage';

export default function ImageSlider({
  images = [],
  maxWidth = '600px',
  language = 'fi',
}) {
  if (!images.length) return null;
  const copy = getProductMessages(language).imageSlider;

  return (
    <Swiper
      modules={[A11y, Pagination]}
      pagination={{ clickable: true }}
      a11y={{
        firstSlideMessage: copy.firstSlide,
        lastSlideMessage: copy.lastSlide,
        nextSlideMessage: copy.nextSlide,
        prevSlideMessage: copy.previousSlide,
        paginationBulletMessage: copy.paginationBullet,
      }}
      spaceBetween={20}
      style={{
        width: '100%',
        maxWidth,
        marginLeft: 0,
        marginRight: 'auto',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <SafeImage
            src={img.src}
            alt={img.alt || ''}
            width={img.width || 1200}
            height={img.height || 800}
            sizes={img.sizes || '(max-width: 800px) 100vw, 800px'}
            priority={img.priority || false}
            loading={img.loading || 'lazy'}
            style={img.style || { width: '100%', maxWidth: '800px', height: 'auto' }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
