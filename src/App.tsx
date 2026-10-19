import { AudioProvider } from './context/AudioContext';
import { BirthdayStory } from './components/BirthdayStory';
import { PresentationMotion } from './context/MotionPreference';

export default function App() {
  return <PresentationMotion><AudioProvider><BirthdayStory /></AudioProvider></PresentationMotion>;
}
