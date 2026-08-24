import { AnimatePresence, motion } from 'framer-motion';

export interface Testimonial {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const testimonial = testimonials[0];

  if (!testimonial) return null;

  return (
    <div className="testimonial-carousel" aria-label="Klantreview">
      <div className="testimonial-carousel__layout">
        <div className="testimonial-carousel__image-frame">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={testimonial.imageUrl}
              className="testimonial-carousel__image-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <img
                src={testimonial.imageUrl}
                alt={`Klantreview van ${testimonial.name}`}
                width={1536}
                height={2048}
                className="testimonial-carousel__image"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <article className="testimonial-carousel__card">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <p className="testimonial-carousel__quote">“{testimonial.description}”</p>
              <footer className="testimonial-carousel__author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.title}</span>
              </footer>
            </motion.div>
          </AnimatePresence>
        </article>
      </div>
    </div>
  );
}
