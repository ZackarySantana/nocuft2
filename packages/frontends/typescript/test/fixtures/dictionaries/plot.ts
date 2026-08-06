import {
    dictionary,
    line,
    list,
    players,
    plot,
    type Dictionary,
    type List,
    type PlayerTarget,
} from "nocuft";

const plotRows = plot.var.game.dictionary<List<number>>("rows");
const playerRows = players.var.saved.dictionary<List<number>>("rows");

export function dictionaries(
    input: Dictionary<List<number>>,
    player: PlayerTarget,
): void {
    let rows = line.dictionary(dictionary({ first: list<number>(1), second: list<number>(2) }));
    let empty: Dictionary<List<number>> = dictionary<List<number>>();
    let [first, foundFirst] = rows.get("first");
    let size = rows.size;
    let keys = rows.keys();
    let values = rows.values();
    rows = rows.with("first", first);
    rows = rows.without("second");
    rows = rows.merged(input);
    plotRows.set(rows);
    let fromPlot = plotRows.get();
    playerRows.set(player, rows);
    let fromPlayer = playerRows.get(player);
    if (rows.has("first")) {
        empty = rows;
    }
    for (const [key, value] of fromPlayer) {
        fromPlot = fromPlot.with(key, value);
    }
}
