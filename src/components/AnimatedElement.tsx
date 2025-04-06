import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  once?: boolean;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'none';
  as?: keyof JSX.IntrinsicElements;
}

const getAnimationClasses = (animation: string, isVisible: boolean): string => {
  const baseClasses = 'transition-all duration-700 ease-out';
  const hiddenClasses = {
    'fade-up': 'opacity-0 translate-y-8',
    'fade-down': 'opacity-0 -translate-y-8',
    'fade-left': 'opacity-0 translate-x-8',
    'fade-right': 'opacity-0 -translate-x-8',
    'scale': 'opacity-0 scale-95',
    'none': ''
  };
  
  return `${baseClasses} ${isVisible ? '' : hiddenClasses[animation as keyof typeof hiddenClasses]}`;
};

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.2,
  once = true,
  animation = 'fade-up',
  as: Component = 'div'
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold, delay, once });

  return (
    <Component
      ref={ref}
      className={`${className} ${getAnimationClasses(animation, isVisible)}`}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </Component>
  );
};