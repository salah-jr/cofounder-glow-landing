import { useState, useEffect } from 'react';

const prompts = [
  "start a cloud kitchen dashboard.",
  "launch a logistics delivery SaaS.",
  "build an expense tracker for startups.",
  "launch a smart grocery assistant.",
  "offer a career coaching portal.",
  "launch an event planning SaaS."
];

export const useAnimatedPlaceholder = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseDuration = 2500;
    const startDelay = 500;

    const animatePlaceholder = () => {
      const baseText = "My idea is to ";
      const currentPrompt = prompts[currentIndex];
      const fullText = baseText + currentPrompt;
      
      if (!isTyping && !isDeleting) {
        // Start typing after delay
        setIsTyping(true);
        timeout = setTimeout(animatePlaceholder, startDelay);
      } else if (isTyping && !isDeleting) {
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
          timeout = setTimeout(animatePlaceholder, typeSpeed);
        } else {
          setIsTyping(false);
          timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else if (isDeleting) {
        if (currentText.length > baseText.length) {
          setCurrentText(currentText.slice(0, -1));
          timeout = setTimeout(animatePlaceholder, deleteSpeed);
        } else {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % prompts.length);
          timeout = setTimeout(() => setIsTyping(true), 200);
        }
      }
    };

    // Initialize the animation
    timeout = setTimeout(animatePlaceholder, 100);
    
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isTyping, currentIndex]);

  return currentText;
};