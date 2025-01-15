// Adds a player to a game if it exists
// Must be logged in
routerAdd(
  "POST",
  "/api/hottest/join/{id}",
  (e) => {
    let authRecord = e.auth;
    let game_id = e.request.pathValue("id");
    let existingGame;
    try {
      existingGame = $app.findFirstRecordByFilter(
        "games",
        "game_code = {:id}",
        {
          id: game_id,
        }
      );
    } catch (e) {}
    if (
      existingGame &&
      authRecord &&
      !existingGame.get("players").includes(authRecord.id)
    ) {
      existingGame.set("players+", authRecord.id);
      $app.save(existingGame);
    }

    return e.json(200, { success: existingGame && authRecord ? true : false });
  },
  $apis.requireAuth()
);
// Anyone can check if a game exists
routerAdd("GET", "/api/hottest/exists/{id}", (e) => {
  let game_id = e.request.pathValue("id");
  let existingGame;
  try {
    existingGame = $app.findFirstRecordByFilter("games", "game_code = {:id}", {
      id: game_id,
    });
  } catch (e) {}
  return e.json(200, { success: existingGame ? true : false });
});
