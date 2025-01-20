// // prints "Hello!" every 2 minutes
cronAdd("nowplaying", "*/2 * * * *", () => {
  try {
    // Fetch Currently playing song
    const res = $http.send({
        url: "https://music.abcradio.net.au/api/v1/plays/triplej/now.json",
        method: "GET",
        // body: "", // ex. JSON.stringify({"test": 123}) or new FormData()
        // headers: {}, // ex. {"content-type": "application/json"}
        timeout: 120, // in seconds
    });
    const data = res.json;
    // Extract the "now" playing song, fallback to "prev" if "now" is missing
    const now = data.now?.recording?.title
        ? data.now.recording
        : data.prev?.recording;
        if (!now?.title || !now?.artists.length) {
        console.log("No valid song data available.");
        return;
        }
    // Search by the simplified name
    const title = now.title;
    // Todo Search the artist table instead
    const artist = now.artists.map((artist) => artist.name).join(" - ");
    console.log(`Now playing: "${title}" by ${artist}`);
    // Access PocketBase collections
    const playedCollection = $app.findCollectionByNameOrId("played");
    const songsCollection = $app.findCollectionByNameOrId("songs");
    const votesCollection = $app.findCollectionByNameOrId("votes");

    // Check if the song exists in the "songs" collection
    let songRecord;
    try {
      songRecord = $app.findFirstRecordByFilter(
        "songs",
        "name = {:title} && artist = {:artist}",
        { title, artist }
      );
    } catch {
      console.log(`Song "${title}" by "${artist}" not found in the database. Adding it now.`);
      // Create a new song record if it doesn't exist
      const newSong = new Record(songsCollection);
      newSong.set("name", title);
      newSong.set("artist", artist);
      $app.save(newSong);

      // Retrieve the newly added song
      songRecord = $app.findFirstRecordByFilter(
        "songs",
        "name = {:title} && artist = {:artist}",
        { title, artist }
      );
    }

    // Check if the song is already in the "played" collection
    const songId = songRecord.get("id");
    let playedRecord;
    try {
      playedRecord = $app.findFirstRecordByFilter(
        "played",
        "song = {:song_id}",
        { song_id: songId }
      );
    } catch {
      console.log(`Song "${title}" by "${artist}" has not been played yet.`);
    }

    if (playedRecord?.id) {
      console.log(`Song "${title}" by "${artist}" has already been played.`);
      return;
    }
    let newPlayed = new Record(playedCollection);
    newPlayed.set("song", songId);
    $app.save(newPlayed);
    console.log(`Added "${title}" by "${artist}" to the played collection.`);
    playedRecord = $app.findFirstRecordByFilter(
        "played",
        "song = {:song_id}",
        { song_id: songId }
      );

    // Update the "votes" collection to link to the played record
    const playedId = playedRecord.get("id");
    const voteRecords = $app.findAllRecords(
      "votes",
      $dbx.exp("votes = {:song_id}", { song_id: songId })
    );

    for (const vote of voteRecords) {
      vote.set("played+", playedId);
      $app.save(vote);
    }

    console.log("New played added.");
    console.log(`Votes updated for "${title}" by "${artist}".`);
  } catch (e) {
    console.log(`Error: ${e}`);
  }
});
