import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, IconButton, Zoom } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useInView } from 'react-intersection-observer';

function ShootingRanges() {
  const navigate = useNavigate();
  const [activeRange, setActiveRange] = useState(null);
  const { scrollYProgress } = useViewportScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const ranges = [
    {
      title: "Älgbana",
      subtitle: "Traditionell 80 meters löpande älg",
      description: "Testa dina färdigheter med vår elektroniska markering och automatisk resultatservice.",
      image: "/src/assets/moose.jpg",
      textAlign: 'left',
      animation: 'fade-right',
    },
    {
      title: "Viltmålsbana",
      subtitle: "50 meters löpande viltmålsbana",
      description: "Perfekt för att träna precision och timing på vår moderna bana.",
      image: "/src/assets/vildsvin.jpg",
      textAlign: 'right',
      animation: 'fade-left',
    },
    {
      title: "Trapp och Skeetbana",
      subtitle: "Modern trapp- och skeetbana",
      description: "Förbättra din teknik och precision på vår toppmoderna skeetbana.",
      image: "/src/assets/hagel.jpg",
      textAlign: 'left',
      animation: 'fade-up',
    },
    {
      title: "Inskjutningsbana",
      subtitle: "100 meters inskjutningsbana",
      description: "Säkerställ din precision och förbered dig inför jaktsäsongen.",
      image: "/src/assets/inskjutning.jpg",
      textAlign: 'center',
      animation: 'fade-down',
    },
  ];

  const scrollToSection = (index) => {
    const section = document.getElementById(`range-${index}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ParallaxProvider>
      <div>
        {ranges.map((range, index) => {
          const [ref, inView] = useInView({
            threshold: 0.3,
            triggerOnce: true,
          });

          return (
            <Parallax key={range.title} y={[-20, 20]} tagOuter="figure">
              <Box
                id={`range-${index}`}
                ref={ref}
                sx={{
                  position: 'relative',
                  backgroundImage: `url(${range.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundAttachment: 'fixed',
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  padding: '0 10%',
                  color: '#F0EED6',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    transition: 'background-color 0.3s ease-in-out',
                  },
                  '&:hover::before': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  },
                }}
                onMouseEnter={() => setActiveRange(index)}
                onMouseLeave={() => setActiveRange(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  style={{ scale }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      padding: '30px',
                      borderRadius: '8px',
                      width: { xs: '80vw', md: '40vw' },
                      maxWidth: '500px',
                      textAlign: range.textAlign,
                      transform: activeRange === index ? 'translateY(-10px)' : 'translateY(0)',
                      transition: 'all 0.3s ease-in-out',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(5px)',
                      marginRight: { xs: 0, md: '10%' },
                    }}
                    data-aos={range.animation}
                  >
                    <Typography variant="h3" sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      fontSize: { xs: '2rem', md: '3rem' },
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      fontFamily: "'Playfair Display', serif",
                      color: '#D4A15E',
                    }}>
                      {range.title}
                    </Typography>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 500, 
                      mb: 4, 
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      fontFamily: "'Roboto Slab', serif",
                    }}>
                      {range.subtitle}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      {range.description}
                    </Typography>
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      size="large"
                      sx={{ 
                        backgroundColor: '#D4A15E', 
                        color: '#5D6651',
                        '&:hover': {
                          backgroundColor: '#5D6651',
                          color: '#D4A15E',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease-in-out',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                      }}
                    >
                      Boka Banan
                    </Button>
                  </Box>
                </motion.div>
                <Box sx={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                  {index > 0 && (
                    <Zoom in={inView} style={{ transitionDelay: inView ? '500ms' : '0ms' }}>
                      <IconButton
                        sx={{
                          color: '#F0EED6',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                          mr: 2,
                        }}
                        onClick={() => scrollToSection(index - 1)}
                      >
                        <ArrowUpwardIcon fontSize="large" />
                      </IconButton>
                    </Zoom>
                  )}
                  {index < ranges.length - 1 && (
                    <Zoom in={inView} style={{ transitionDelay: inView ? '500ms' : '0ms' }}>
                      <IconButton
                        sx={{
                          color: '#F0EED6',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                        }}
                        onClick={() => scrollToSection(index + 1)}
                      >
                        <ArrowDownwardIcon fontSize="large" />
                      </IconButton>
                    </Zoom>
                  )}
                </Box>
              </Box>
            </Parallax>
          );
        })}
      </div>
    </ParallaxProvider>
  );
}

export default ShootingRanges;
