import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

const presentationMotion = { reduced: false };
const MotionPreference = createContext(presentationMotion);

export function PresentationMotion({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.motion = 'full';
    return () => { delete document.documentElement.dataset.motion; };
  }, []);
  return <MotionPreference.Provider value={presentationMotion}>
    <MotionConfig reducedMotion="never">{children}</MotionConfig>
  </MotionPreference.Provider>;
}
export const usePresentationMotion = () => useContext(MotionPreference);
