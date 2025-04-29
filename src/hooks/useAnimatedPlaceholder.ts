
import { useState, useEffect } from 'react';

const prompts = [
  "I need help creating a business plan for my SaaS startup...",
  "How can I validate my marketplace business idea...",
  "Help me prepare a pitch deck for potential investors...",
  "I need to research my target market and competitors...",
  "Define my startup's value proposition and mission..."
];

export const useAnimatedPlaceholder = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const typeSpeed = 50;
    const deleteSpeed = 30;
    const pauseDuration = 2000;

    const animatePlaceholder = () => {
      const currentPrompt = prompts[currentIndex];
      
      if (!isDeleting) {
        if (currentText.length < currentPrompt.length) {
          setCurrentText(currentPrompt.slice(0, currentText.length + 1));
          timeout = setTimeout(animatePlaceholder, typeSpeed);
        } else {
          timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
          timeout = setTimeout(animatePlaceholder, deleteSpeed);
        } else {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % prompts.length);
          // Start typing immediately after selecting the next prompt
          timeout = setTimeout(animatePlaceholder, 100);
        }
      }
    };

    // Initialize the animation with a small delay on mount
    timeout = setTimeout(animatePlaceholder, 100);
    
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex]);

  return currentText;
};
