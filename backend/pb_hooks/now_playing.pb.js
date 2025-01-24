cronAdd("nowplaying", "*/1 * * * *", () => {
  console.log("Cronjob started");
  function sleep(ms) {
    const start = Date.now();
    console.log("Sleeping");
    while (Date.now() - start < ms) {
      // Busy-wait loop to simulate sleep
    }
    console.log("Done sleeping");
  }
  const busyWait = (runCount, jobStart, nextUpdated) => {
    if (runCount > 3) {
      return;
    }
    if (nextUpdated && nextUpdated - jobStart <= 40000) {
      // Check if the next update is within the next minute
      const delay = nextUpdated - jobStart + 1000; // Add 1 second to `next_updated`
      console.log(`Next update in ${delay / 1000} seconds. Waiting...`);

      // Schedule `handleNowPlaying` to run 1 second after `next_updated`
      sleep(delay);
      nowPlaying(runCount + 1, jobStart);
    } else {
      console.log(
        `Next update in ${
          (nextUpdated - jobStart) / 1000
        } seconds can wait till next run.`
      );
    }
  };

  const nowPlaying = (runCount, jobStart) => {
    console.log("Running now playing");
    const cleanString = (inputString) => {
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
    };

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
      // Extract the `next_updated` field
      const nextUpdated = new Date(data.next_updated).getTime();

      // Search by the simplified name
      const title = now.title;
      const searchable_name = cleanString(title);
      // Todo Search the artist table instead
      const artist = now.artists.map((artist) => artist.name)[0];
      const searchable_artist = cleanString(artist);
      console.log(`Now playing: "${title}" by ${artist}`);
      // Access PocketBase collections
      const playedCollection = $app.findCollectionByNameOrId("played");
      const songsCollection = $app.findCollectionByNameOrId("songs");
      const votesCollection = $app.findCollectionByNameOrId("votes");
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() - 8);
      const year = currentTime.getFullYear();
      const month = String(currentTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
      const day = String(currentTime.getDate()).padStart(2, "0");

      const hours = String(currentTime.getHours()).padStart(2, "0");
      const minutes = String(currentTime.getMinutes()).padStart(2, "0");
      const seconds = String(currentTime.getSeconds()).padStart(2, "0");

      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      let isNew = false;
      // Check if the song exists in the "songs" collection
      let songRecord;

      try {
        songRecord = $app.findFirstRecordByFilter(
          "songs",
          "searchable_name ~ {:searchable_name} && searchable_artist ~ {:searchable_artist}",
          { searchable_name, searchable_artist }
        );
      } catch {
        isNew = true;
        console.log(
          `Song "${title}" by "${artist}" not found in the database. Adding it now.`
        );
        // Create a new song record if it doesn't exist
        const newSong = new Record(songsCollection);
        newSong.set("name", title);
        newSong.set("artist", artist);
        newSong.set("searchable_name", searchable_name);
        newSong.set("searchable_artist", searchable_artist);
        $app.save(newSong);

        // Retrieve the newly added song
        songRecord = $app.findFirstRecordByFilter(
          "songs",
          "searchable_name = {:searchable_name} && searchable_artist = {:searchable_artist}",
          { searchable_name, searchable_artist }
        );
      }

      // Check if the song is already in the "played" collection
      const songId = songRecord.get("id");
      let playedRecord;
      let lastPlayedPosition = -1;
      try {
        playedRecord = $app.findFirstRecordByFilter(
          "played",
          `song = {:song_id} && played_at >= {:past_time}`,
          { song_id: songId, past_time: formattedTime }
        );
      } catch (e) {
        console.log(
          `Song "${title}" by "${artist}" has not been played yet.`,
          e
        );
      }

      if (playedRecord?.id) {
        console.log(`Song "${title}" by "${artist}" has already been played.`);
        busyWait(jobStart, nextUpdated);
        return;
      }

      const lastPlayed = $app.findRecordsByFilter(
        "played",
        `played_at >= {:past_time}`,
        "-played_at",
        1,
        0,
        { past_time: formattedTime }
      );
      if (lastPlayed?.length > 0) {
        lastPlayedPosition = lastPlayed[0].get("countdown_position");
      }

      let newPlayed = new Record(playedCollection);
      newPlayed.set("song", songId);
      newPlayed.set("new_song", isNew);
      if (lastPlayedPosition > 0) {
        newPlayed.set("countdown_position", lastPlayedPosition - 1);
      }

      $app.save(newPlayed);
      console.log(`Added "${title}" by "${artist}" to the played collection.`);
      if (lastPlayedPosition > 0) {
        playedRecord = $app.findFirstRecordByFilter(
          "played",
          "song = {:song_id}",
          {
            song_id: songId,
          }
        );

        // Update the "votes" collection to link to the played record
        const playedId = playedRecord.get("id");
        const voteRecords = $app.findAllRecords("votes");
        for (const vote of voteRecords) {
          if (
            vote.get("votes").includes(songId) &&
            !vote.get("played").includes(playedId)
          ) {
            vote.set("played+", [playedId]);
            $app.save(vote);
          }
        }
        console.log(`Votes updated for "${title}" by "${artist}".`);
      }
      busyWait(jobStart, nextUpdated);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  };
  const now = Date.now();
  nowPlaying(0, now);
  console.log("Cronjob finished");
});

cronAdd("update_played", "*/2 * * * *", () => {
  try {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - 12);
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(currentTime.getDate()).padStart(2, "0");

    const hours = String(currentTime.getHours()).padStart(2, "0");
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    const seconds = String(currentTime.getSeconds()).padStart(2, "0");

    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const lastPlayed = $app.findRecordsByFilter(
      "played",
      `played_at >= {:past_time} && countdown_position > 0`,
      "-played_at",
      100,
      0,
      { past_time: formattedTime }
    );
    const playedSongs = lastPlayed.map((record) => {
      return { song: record.get("song"), id: record.get("id") };
    });

    const voteRecords = $app.findAllRecords("votes");
    for (const played of playedSongs) {
      for (const vote of voteRecords) {
        if (
          vote.get("votes").includes(played.song) &&
          !vote.get("played").includes(played.id)
        ) {
          vote.set("played+", [played.id]);
          $app.save(vote);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
});
