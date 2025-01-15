// // prints "Hello!" every 2 minutes
// cronAdd("nowplaying", "*/2 * * * *", () => {
//   const res = $http.send({
//     url: "https://music.abcradio.net.au/api/v1/plays/triplej/now.json",
//     method: "GET",
//     body: "", // ex. JSON.stringify({"test": 123}) or new FormData()
//     headers: {}, // ex. {"content-type": "application/json"}
//     timeout: 120, // in seconds
//   });
//   /*
//    next_updated timestamp
//    next, now, prev
//    recording
//     title
//     artists(list)
//      name
//      is_australian
//     releases(list) AND release
//      name
//      artists
    
//   */
//   const data = res.json;

//   try {
//     // Get the now object from the data
//     // If now does not have a title then use prev
//     const now = data.now?.recording?.title
//       ? data.now.recording
//       : data.prev?.recording;
//     if (!now?.title || !now?.artists.length) {
//       console.log("No data");
//       return;
//     }
//     const title = now.title;
//     const artist = now.artists.map((artist) => artist.name).join(" - ");
//     console.log(`Now playing: "${title}" by ${artist}`);
//     let played = $app.findCollectionByNameOrId("played");
//     let songs = $app.findCollectionByNameOrId("songs");
//     let existingSong;
//     try {
//       existingSong = $app.findFirstRecordByFilter(
//         "songs",
//         "name = {:title} && artist = {:artist}",
//         { title, artist }
//       );
//     } catch (e) {
//       console.log(`No song found for "${title}" by "${artist}".`);
//       let newSong = new Record(songs);

//       newSong.set("name", title);
//       newSong.set("artist", artist);

//       $app.save(newSong);
//       console.log("New song added.");

//       existingSong = $app.findFirstRecordByFilter(
//         "songs",
//         "name = {:title} && artist = {:artist}",
//         { title, artist }
//       );
//     }
//     const playedSong = new DynamicModel({
//       id: "",
//     });
//     try {
//       $app
//         .db()
//         .select("id")
//         .from("played")
//         .andWhere(
//           $dbx.exp("song = {:song_id}", {
//             song_id: existingSong.get("id"),
//           })
//         )
//         .one(playedSong);
//     } catch (e) {
//       console.log(e);
//       console.log(`Song "${title}" by "${artist}" has not been played yet.`);
//     }

//     if (playedSong?.id) {
//       console.log(`Song "${title}" by "${artist}" has already been played.`);
//       return;
//     }

//     let newPlayed = new Record(played);
//     newPlayed.set("song", existingSong.get("id"));
//     $app.save(newPlayed);
//     console.log("New played added.");
//   } catch (e) {
//     console.log(`Error: ${e}`);
//   }
// });
