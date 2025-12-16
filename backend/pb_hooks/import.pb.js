router.add("POST", "/import-songs", async (c) => {
    let songs

    try {
        songs = await c.req.json()
    } catch (err) {
        return c.json(400, { error: "Invalid JSON body" })
    }

    if (!Array.isArray(songs)) {
        return c.json(400, { error: "Expected an array of songs" })
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

    return c.json(200, results)
})