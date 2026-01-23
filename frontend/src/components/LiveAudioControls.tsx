import { FaPlay, FaPause  } from "react-icons/fa6";

type Props = {
  isPlaying: boolean;
  onToggle: () => void;
};

export function LiveAudioControls({
  isPlaying,
  onToggle,
}: Props) {
  return (
      <button
        onClick={onToggle}
        className="bg-primarybg hover:bg-orange-700 text-white font-bold py-4 px-4 rounded-full absolute top-0 mt-6 mr-6"
      >
        {isPlaying ? <FaPause size={40} /> : <FaPlay size={40} />}
      </button>
  );
}
