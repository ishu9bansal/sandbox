
/**
 * Combine all pivot table headers into a single array
 * E.g. Input: 
 * [
 *  ["E1", "", "", "", "", "", "E2", "", "", "", "", ""],
 *  ["V1", "", "", "V2", "", "", "V1", "", "", "V2", "", ""],
 *  ["A", "B", "C", "A", "B", "C", "A", "B", "C", "A", "B", "C"],
 * ]
 * Output:
 * [
 *  "E1_V1_A", "E1_V1_B", "E1_V1_C", "E1_V2_A", "E1_V2_B", "E1_V2_C",
 *  "E2_V1_A", "E2_V1_B", "E2_V1_C", "E2_V2_A", "E2_V2_B", "E2_V2_C"
 * ]
 */

function processHeaders(headers: string[][]): string[] {
    return concat(fill(headers));
}

function concat(headers: string[][], delimeter: string = '_'): string[] {
    if (headers.length === 0) return [];

    const combined: string[] = [];
    const numColumns = headers[0].length;

    for (let col = 0; col < numColumns; col++) {
        let combinedHeader = '';
        for (let row = 0; row < headers.length; row++) {
            if (row > 0) combinedHeader += delimeter;
            combinedHeader += headers[row][col];
        }
        combined.push(combinedHeader);
    }

    return combined;
}

function fill(headers: string[][]): string[][] {
    return headers.map(row => {
        const filledRow: string[] = [];
        let lastValue = '';
        for (const cell of row) {
            if (cell !== '') {
                filledRow.push(cell);
                lastValue = cell;
            } else {
                filledRow.push(lastValue);
            }
        }
        return filledRow;
    });
}


export function tsvToTable(tsv: string): string[][] {
    const rows = tsv.trim().split('\n');
    return rows.map(row => row.split('\t'));
}

export function tableToTsv(table: string[][]): string {
    return table.map(row => row.join('\t')).join('\n');
}

export function processTable(table: string[][]): string[][] {
    const headers = processHeaders(table);
    return [headers];
}

export function transpose(table: string[][]): string[][] {
    if (table.length === 0) return [];

    const transposed: string[][] = [];
    const numRows = table.length;
    const numCols = table[0].length;

    for (let col = 0; col < numCols; col++) {
        const newRow: string[] = [];
        for (let row = 0; row < numRows; row++) {
            newRow.push(table[row][col]);
        }
        transposed.push(newRow);
    }

    return transposed;
}
