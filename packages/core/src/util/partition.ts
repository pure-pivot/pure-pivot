export function partitionData<T>(data: T[], equivalence: (d1: T, d2: T) => boolean): T[][] {
    const partitions: T[][] = [];
    for (const row of data) {
        const partition = partitions.find((partition) => equivalence(row, partition[0]));
        if (partition) {
            partition.push(row);
        } else {
            partitions.push([row]);
        }
    }
    return partitions;
}
