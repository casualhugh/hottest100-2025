routerAdd("POST", "/import-songs", async (e) => {
    let songs;
    if (!e.auth?.isSuperuser()) {
        return e.json(403, { error: "Forbidden" })
    }
    try {
        console.log("Importing songs...", console.log(e.request));

        songs = await e.request.json()
    } catch (err) {
        console.log(err)
        return e.json(400, { error: "Invalid JSON body" + (err.message ? ": " + err.message : "") })
    }

    if (!Array.isArray(songs)) {
        return e.json(400, { error: "Expected an array of songs" })
    }

    const collection = $app.findCollectionByNameOrId("songs")

    let results = {
        created: 0,
        updated: 0,
        errors: []
    }

    for (const song of songs) {
        const {
            id,
            name,
            artist,
            game_rule,
            searchable_name,
            searchable_artist
        } = song

        if (!id) {
            results.errors.push({ song, error: "Missing id" })
            continue
        }

        try {
            let record

            try {
                // Try fetch by ID
                record = $app.findRecordById("songs", id)

                // Exists → update game_rule only
                record.set("game_rule", game_rule)
                $app.save(record);

                results.updated++
            } catch (err) {
                // Not found → create new
                record = new Record(collection)

                record.set("id", id)
                record.set("name", name)
                record.set("artist", artist)
                record.set("game_rule", game_rule)
                record.set("searchable_name", searchable_name)
                record.set("searchable_artist", searchable_artist)

                $app.save(record);

                results.created++
            }

        } catch (err) {
            results.errors.push({
                id,
                error: err.message ?? String(err)
            })
        }
    }

    return e.json(200, results)
})