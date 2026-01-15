import { useState } from "react";

function cleanString(inputString: string) {
  // Normalize accented characters to their non-accented counterparts
  const normalized = inputString.normalize("NFD");
  const noAccents = normalized
    .split("")
    .filter((char) => !char.match(/[\u0300-\u036f]/)) // Remove diacritical marks
    .join("");

  // Remove non-alphanumeric characters
  const cleaned = noAccents.replace(/[^a-zA-Z0-9]/g, "");

  // Return the original string (lowercased) if cleaned string is too short
  if (cleaned.length < 2) {
    return inputString.toLowerCase();
  }

  return cleaned.toLowerCase();
}

const AutoCompleteInput = ({
  songs,
  hasId,
  votes,
  updateVote,
  songInput,
  setSongInput,
  artistInput,
  setArtistInput,
}: {
  songs: any;
  hasId: any;
  votes: any;
  updateVote: any;
  songInput: any;
  setSongInput: any;
  artistInput: any;
  setArtistInput: any;
}) => {
  const votes_ids = votes.map((vote: any) => vote.id);
  const sortedSuggestions = songs
    .sort((a: any, b: any) =>
      a.searchable_name.localeCompare(b.searchable_name)
    )
    .filter((song: any) => !votes_ids.includes(song.id));

  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setTimeout(() => {
      setIsFocused(true);
    }, 200);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };
  const updateSongFilter = (input: string) => {
    setSongInput(input);
    const stripped_input = cleanString(input);
    setFilteredSuggestions(
      sortedSuggestions
        .filter((suggestion: any) =>
          suggestion.searchable_name.includes(stripped_input)
        )
        .slice(0, 10)
    );
  };

  const updateArtistFilter = (input: string) => {
    setArtistInput(input);
    const stripped_input = cleanString(input);
    setFilteredSuggestions(
      sortedSuggestions
        .filter((suggestion: any) =>
          suggestion.searchable_artist.includes(stripped_input)
        )
        .slice(0, 10)
    );
  };

  const handleSongChange = (e: any) => {
    const userInput = e.target.value;
    updateSongFilter(userInput);
  };

  const handleArtistChange = (e: any) => {
    const userInput = e.target.value;
    updateArtistFilter(userInput);
  };

  return (
    <div>
      <input
        value={songInput}
        onChange={handleSongChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type="text"
        placeholder={`Enter song name...`}
        className={`w-30 sm:w-40 md:w-48 lg:w-50 mt-1 py-2 text-center bg-black bg-opacity-50 focus:outline-none ${
          hasId ? "border border-green-600 border-2" : ""
        }`}
      />
      <input
        value={artistInput}
        onChange={handleArtistChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type="text"
        placeholder={`Enter artist...`}
        className={`w-20 sm:w-40 md:w-48 lg:w-50 ml-2 mt-1 py-2 text-center bg-black bg-opacity-50 focus:outline-none ${
          hasId ? "border border-green-600 border-2" : ""
        }`}
      />
      <div className="absolute bg-white text-gray-700 max-h-[200px] w-[240px] overflow-y-auto rounded-lg">
        {isFocused && filteredSuggestions.length > 0 && (
          <ul>
            {filteredSuggestions.map((suggestion: any, index: number) => (
              <li
                className="z-20 cursor-pointer"
                key={index}
                onClick={() =>
                  updateVote({
                    name: suggestion.name,
                    artist: suggestion.artist,
                    id: suggestion.id,
                  })
                }
              >
                {`${suggestion.name} | ${suggestion.artist}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AutoCompleteInput;
