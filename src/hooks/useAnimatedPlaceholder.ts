import { useState, useEffect } from 'react';

const prompts = [
  "start a cloud kitchen dashboard",
  "launch a logistics delivery SaaS",
  "build an expense tracker for startups",
  "launch a smart grocery assistant",
  "offer a career coaching portal",
  "launch an event planning SaaS",
  "build AI-personalized meal subscriptions",
  "start last-mile delivery for small businesses",
  "launch a furniture rental platform"
];

export const useAnimatedPlaceholder = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Increased speed by 20% (80% of original values)
    const typeSpeed = 10; // was 12, now 80% faster
    const deleteSpeed = 6; // was 7, now 80% faster  
    const pauseDuration = 266; // was 333, now 80% faster
    const fadeOutDuration = 120; // was 150, now 80% faster
    const fadeInDuration = 120; // was 150, now 80% faster
    const baseText = "My idea is to ";

    const animatePlaceholder = () => {
      const currentPrompt = prompts[currentIndex];
      const fullText = baseText + currentPrompt;
      
      if (!isDeleting) {
        // Typing phase
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
          timeout = setTimeout(animatePlaceholder, typeSpeed);
        } else {
          // Pause when complete, then start fade out and deleting
          timeout = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
              setIsDeleting(true);
              setIsVisible(true);
            }, fadeOutDuration);
          }, pauseDuration);
        }
      } else {
        // Deleting phase
        if (currentText.length > baseText.length) {
          setCurrentText(currentText.slice(0, -1));
          timeout = setTimeout(animatePlaceholder, deleteSpeed);
        } else {
          // Fade out before moving to next prompt
          setIsVisible(false);
          setTimeout(() => {
            setIsDeleting(false);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % prompts.length);
            setIsVisible(true);
            timeout = setTimeout(animatePlaceholder, fadeInDuration);
          }, fadeOutDuration);
        }
      }
    };

    // Start animation with initial delay
    timeout = setTimeout(animatePlaceholder, 160); // was 200, now 80% faster
    
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex]);

  return { text: currentText, isVisible };
};