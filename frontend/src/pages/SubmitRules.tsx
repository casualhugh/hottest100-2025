import { useState, useEffect } from "react";
import { distance } from "fastest-levenshtein";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";

function SubmitRules() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submittedRules, setSubmittedRules] = useState([]);
  const [enteredRule, setEnteredRule] = useState("");
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const loadJSON = async () => {
      try {
        const songs_json: any = await import("../assets/official_output.json");
        setSongs(songs_json.default);
      } catch (error) {
        console.error("Error loading songs JSON:", error);
      }
    };
    loadJSON();
  }, []);

  console.log("Songs loaded:", songs[0]);
  
  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
    const results = songs.filter((song: any) =>
      song.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      song.artist.toLowerCase().includes(e.target.value.toLowerCase())
    );
    // Sort by levenshtein distance 
    results.sort((a: any, b: any) => {
        const distanceA = distance(e.target.value.toLowerCase(), a.name.toLowerCase());
        const distanceB = distance(e.target.value.toLowerCase(), b.name.toLowerCase());
        return distanceA - distanceB;
    });
    setSearchResults(results.slice(0, 10));
  };

  return (
    <div className="text-black">
      <h1 className="text-3xl font-bold text-center my-4">
          Hottest 100 the game suggestion box
        </h1>
      <div className="flex justify-center mt-10 relative">
        
        <div className="relative w-96">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search for a song or artist..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 "
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <CiSearch size={20} />
          </div>
          <div className="absolute right-3 top-2.5 text-gray-400 cursor-pointer">
            <GiPerspectiveDiceSixFacesRandom
              size={20}
              onClick={() => {
                if (songs.length > 0) {
                  const randomIndex = Math.floor(Math.random() * songs.length);
                  setSelected(songs[randomIndex]);
                  setSearch("");
                  setSearchResults([]);
                  setEnteredRule("");
                }
              }}
            />
          </div> 
          {searchResults.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-y-auto rounded-md shadow-lg">
              {searchResults.map((song: any) => (
                <li
                  key={`${song.name}-${song.artist}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelected(song);
                    setSearch("");
                    setSearchResults([]);
                    setEnteredRule("");
                  }}
                >
                  {song.name} | {song.artist}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {selected && (
        <div className="mt-6 text-center bg-gray-200 p-4 rounded-lg w-3/4 mx-auto">
          <h2 className="text-2xl font-bold">{selected.name}</h2>
          <p className="text-gray-600">{selected.artist}</p>
        </div>
      )}
      <div className="mt-6 flex justify-center">
        <textarea
          className="w-96 h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:none focus:ring-blue-500"
          placeholder="Enter a drinking rule..."
          value={enteredRule}
          onChange={(e) => setEnteredRule(e.target.value)}
          disabled={!selected}
        ></textarea>
      </div>
      <div className="mt-4 flex justify-center">
        <button className="bg-blue-500 text-white px-6 py-2 hover:bg-blue-600 disabled:bg-gray-400" disabled={!selected || enteredRule.trim() === ""}>
          Submit
        </button>
      </div>
      <div className="mt-8 mx-auto w-3/4">
        <h3 className="text-xl font-bold mb-4">
          Your Rules ({submittedRules.length})
        </h3>
        <ul>
          {submittedRules.map((rule: any, index: number) => (
            <li
              key={index}
              className="flex justify-between items-center mb-4 p-4 border border-gray-300 rounded-lg"
            >
              <div>
                <h4 className="text-lg font-bold">{rule.song.name}</h4>
                <p className="text-gray-600">{rule.song.artist}</p>
              </div>
              <button className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>      
    </div>
  );
}

export default SubmitRules;
