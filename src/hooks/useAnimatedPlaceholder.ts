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
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const typeSpeed = 35; // Faster typing - like someone actually typing
    const deleteSpeed = 20; // Faster deleting
    const pauseDuration = 1000; // 1 second pause as requested
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
          // Pause when complete, then start deleting
          timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting phase
        if (currentText.length > baseText.length) {
          setCurrentText(currentText.slice(0, -1));
          timeout = setTimeout(animatePlaceholder, deleteSpeed);
        } else {
          // Move to next prompt
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % prompts.length);
          timeout = setTimeout(animatePlaceholder, 200);
        }
      }
    };

    // Start animation with initial delay
    timeout = setTimeout(animatePlaceholder, 500);
    
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex]);

  return currentText;
};