import React from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills'; // NOVO IMPORT
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import ContactForm from '../components/sections/ContactForm'; 
import Contact from '../components/sections/Contact';
import '../styles/variables.css';
import '../styles/global.css'

const Portfolio = () => {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <ContactForm />
  
    </>
  );
};

export default Portfolio;