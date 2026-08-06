export function renderTextTable(
    headers: readonly string[],
    rows: readonly (readonly string[])[],
): string {
    if (headers.length === 0 || rows.some((row) => row.length !== headers.length)) {
        throw new Error("Text table rows must have the same number of columns as the header.");
    }
    const widths = headers.map((header, index) => Math.max(
        header.length,
        ...rows.map((row) => row[index]!.length),
    ));
    return [...[headers], ...rows]
        .map((row) => row.map((cell, index) => index === row.length - 1
            ? cell
            : cell.padEnd(widths[index]!)).join("  "))
        .join("\n") + "\n";
}
