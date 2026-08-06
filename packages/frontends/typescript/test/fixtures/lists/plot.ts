import { line, list, players, plot, type List, type PlayerTarget } from "nocuft";

const plotNumbers = plot.var.game.list<number>("numbers");
const playerRows = players.var.saved.list<List<number>>("rows");

export function lists(rows: List<List<number>>, player: PlayerTarget): void {
    let values = line.list(list<number>(1, 2));
    let empty = list<number>();
    let nested = list<List<number>>(list<number>(3), list<number>(4));
    let second = values[1];
    let size = values.length;
    values = values.with(0, second);
    values = values.appended(size, 5);
    values = values.concatenated(empty);
    values = values.slice(1, 3);
    values = values.slice(undefined, size);
    nested = nested.appended(empty);
    plotNumbers.set(values);
    let fromPlot = plotNumbers.get();
    playerRows.set(player, nested);
    let fromPlayer = playerRows.get(player);

    for (const row of rows) {
        for (const value of row) {
            fromPlot = fromPlot.appended(value);
        }
    }

    empty = fromPlayer[0];
}
