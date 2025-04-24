
import { useState, useEffect } from 'react';

const prompts = [
  "Create a weather dashboard with React and Tailwind...",
  "Build a crypto portfolio tracker with real-time data...",
  "Design an e-commerce product page with animations...",
  "Make a social media feed with infinite scroll...",
  "Generate a task management app with drag and drop..."
];

export const useAnimatedPlaceholder = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const typeSpeed = 50;
    const deleteSpeed = 30;
    const pauseDuration = 2000;

    const animatePlaceholder = () => {
      const currentPrompt = prompts[currentIndex];
      
      if (!isDeleting) {
        if (currentText.length < currentPrompt.length) {
          setCurrentText(currentPrompt.slice(0, currentText.length + 1));
          setTimeout(animatePlaceholder, typeSpeed);
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
          setTimeout(animatePlaceholder, deleteSpeed);
        } else {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % prompts.length);
        }
      }
    };

    const timeout = setTimeout(animatePlaceholder, 100);
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex]);

  return currentText;
};
