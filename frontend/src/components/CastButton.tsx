import { useCallback } from "react";
import { useCast } from "react-chromecast";
import { FaChromecast } from "react-icons/fa6";

function CastButton() {
  const cast = useCast({
    initialize_media_player: "DEFAULT_MEDIA_RECEIVER_APP_ID",
    auto_initialize: true,
  });
  const handleClick = useCallback(async () => {
    if (cast.castReceiver) {
      await cast.handleConnection();
    }
  }, [cast.castReceiver, cast.handleConnection]);
  return (
    <button
      onClick={handleClick}
      className="bg-primarybg hover:bg-orange-700 text-black font-bold py-4 px-4 rounded-full absolute top-24 right-0 mt-6 mr-6"
    >
      <FaChromecast size={32} />
    </button>
  );
}

export default CastButton;
