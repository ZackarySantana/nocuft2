package dev.nocuft.client.mod.plot;

import dev.nocuft.client.plot.Codespace;
import dev.nocuft.client.plot.PlotSize;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import net.minecraft.client.Minecraft;
import net.minecraft.core.BlockPos;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.entity.SignBlockEntity;

/**
 * Reads what is on a plot's codespace out of the world.
 *
 * <p>Every code block is a real block with a sign on it, and in dev mode the
 * codespace is loaded around the player, so the headers of every line can be
 * read without moving, clicking, or sending anything. That is worth doing
 * first: it needs none of the automation DiamondFire only tolerates in dev,
 * and it answers most of what the screen wants to say.
 *
 * <p>It does not answer everything. A header says which line this is, not
 * whether its code is the code that was built, and the arguments live in
 * chests a client is not sent until it opens them. Telling current from
 * drifted needs the line itself, which means picking it up.
 */
public final class PlotReader {
    /**
     * Empty positions to pass before deciding the lines have run out.
     *
     * <p>Lines are placed into the first free spot, so a gap is left behind
     * whenever one is removed, and stopping at the first gap would miss
     * everything after it.
     */
    private static final int RUN_OF_EMPTIES = 6;

    /** One code line as it stands in the world. */
    public record ObservedLine(int index, int x, int y, int z, String block, String name) {
        public String header() {
            return block + " " + name;
        }
    }

    /** What could be read of a plot without touching it. */
    public record Reading(
        Codespace codespace,
        List<ObservedLine> lines,
        /** Positions that held something this could not read as a code line. */
        int unreadable
    ) {}

    private PlotReader() {
    }

    /**
     * Reads the codespace around a known origin.
     *
     * <p>Empty when the world is not loaded, rather than reporting a plot with
     * nothing on it: an unloaded chunk and an empty plot look identical from
     * here, and only one of them is safe to act on.
     */
    public static Optional<Reading> read(Minecraft client, Codespace codespace) {
        Level world = client.level;
        if (world == null) {
            return Optional.empty();
        }

        List<ObservedLine> lines = new ArrayList<>();
        int unreadable = 0;
        int empties = 0;
        int index = 0;
        int limit = codespace.capacity().orElse(RUN_OF_EMPTIES * 8);

        while (index < limit && empties < RUN_OF_EMPTIES) {
            Optional<Codespace.LinePosition> position = codespace.lineAt(index);
            if (position.isEmpty()) {
                break;
            }
            BlockPos pos = new BlockPos(position.get().x(), position.get().y(), position.get().z());
            if (world.getBlockState(pos).isAir()) {
                empties += 1;
                index += 1;
                continue;
            }
            empties = 0;
            Optional<ObservedLine> line = readLine(world, pos, index);
            if (line.isPresent()) {
                lines.add(line.get());
            } else {
                unreadable += 1;
            }
            index += 1;
        }
        return Optional.of(new Reading(codespace, List.copyOf(lines), unreadable));
    }

    /**
     * Reads one line's header from the sign on its first block.
     *
     * <p>The sign is what DiamondFire writes the block and the action onto,
     * and it is the only part of a line a client is told without asking.
     */
    /**
     * Whether DiamondFire has expanded a template into a code line here.
     *
     * <p>The presence of a block is not enough. Minecraft predicts a placement
     * locally before the server has agreed to it, so the item appears for a
     * moment whether or not it was accepted. A sign does not: DiamondFire
     * writes it when it expands the template, so it is the first thing that
     * only exists if the placement really happened.
     */
    public static boolean lineExistsAt(Level world, BlockPos start) {
        return readLine(world, start, 0).isPresent();
    }

    private static Optional<ObservedLine> readLine(Level world, BlockPos start, int index) {
        // The line's own position and the column west of it, and nothing
        // else. A sign sits either on the block or just west of it, but the
        // column east belongs to the line before this one: looking there found
        // that line's sign and reported a refused placement as a line that
        // exists.
        for (BlockPos candidate : List.of(start, start.west())) {
            if (world.getBlockEntity(candidate) instanceof SignBlockEntity sign) {
                String block = line(sign, 0);
                String name = line(sign, 1);
                if (!block.isEmpty()) {
                    return Optional.of(new ObservedLine(
                        index, start.getX(), start.getY(), start.getZ(), block, name
                    ));
                }
            }
        }
        return Optional.empty();
    }

    private static String line(SignBlockEntity sign, int row) {
        return sign.getFrontText().getMessage(row, false).getString().trim();
    }

    /** How far a border scan will look before giving up. */
    private static final int MAX_SCAN = 340;

    /** How far below the player to look for the floor they are standing over. */
    private static final int MAX_DROP = 24;

    /** Chunks either side of the player a survey looks through. */
    private static final int SURVEY_CHUNKS = 4;

    /** The floor of a codespace and the stone that bounds it. */
    public record Bounds(int floorY, int westX, int eastX, int northZ, int southZ) {
        /** Blocks of code the plot is wide, between the borders. */
        public int width() {
            return Math.max(0, eastX - westX - 1);
        }

        /** Blocks of code the plot is long. */
        public int length() {
            return Math.max(0, southZ - northZ - 1);
        }
    }

    /**
     * Measures the codespace the player is standing in from where its floor
     * stops.
     *
     * <p>DiamondFire lays a codespace on a floor of its own and edges it with
     * something else. Looking for stone in particular was wrong: three sides
     * are stone and the fourth, where the plot meets its play area, is
     * whatever that area is built from. What all four have in common is being
     * a different block from the floor between them, so the boundary is where
     * the floor changes rather than where a particular block appears.
     */
    public static Optional<Bounds> bounds(Minecraft client) {
        Level world = client.level;
        if (world == null || client.player == null) {
            return Optional.empty();
        }
        BlockPos feet = client.player.blockPosition();
        Optional<Integer> found = floorUnder(world, feet);
        if (found.isEmpty()) {
            return Optional.empty();
        }
        int floorY = found.get();

        Block floor = world.getBlockState(new BlockPos(feet.getX(), floorY, feet.getZ()))
            .getBlock();
        Optional<Integer> east = border(world, feet.getX(), feet.getZ(), floorY, floor, 1, 0);
        Optional<Integer> west = border(world, feet.getX(), feet.getZ(), floorY, floor, -1, 0);
        Optional<Integer> south = border(world, feet.getX(), feet.getZ(), floorY, floor, 0, 1);
        Optional<Integer> north = border(world, feet.getX(), feet.getZ(), floorY, floor, 0, -1);
        if (east.isEmpty() || west.isEmpty() || south.isEmpty() || north.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(new Bounds(floorY, west.get(), east.get(), north.get(), south.get()));
    }

    /**
     * Measures the codespace from its near edges, with the size taken as
     * given.
     *
     * <p>Measuring all four borders fails on a plot big enough that the far
     * ones sit in chunks the server never sent. The player is dropped by the
     * origin corner, so the east and north borders are loaded whatever the
     * plot's size, and the size, asked of the server rather than the world,
     * answers for where the other two must be.
     */
    public static Optional<Bounds> boundsFromSize(Minecraft client, PlotSize size) {
        Level world = client.level;
        if (world == null || client.player == null) {
            return Optional.empty();
        }
        Optional<Integer> width = size.codeWidth();
        Optional<Integer> length = size.codeLength();
        if (width.isEmpty() || length.isEmpty()) {
            return Optional.empty();
        }
        BlockPos feet = client.player.blockPosition();
        Optional<Integer> floorY = floorUnder(world, feet);
        if (floorY.isEmpty()) {
            return Optional.empty();
        }
        Block floor = world.getBlockState(new BlockPos(feet.getX(), floorY.get(), feet.getZ()))
            .getBlock();
        Optional<Integer> east = border(world, feet.getX(), feet.getZ(), floorY.get(), floor, 1, 0);
        Optional<Integer> north = border(world, feet.getX(), feet.getZ(), floorY.get(), floor, 0, -1);
        if (east.isEmpty() || north.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(new Bounds(
            floorY.get(),
            east.get() - width.get() - 1,
            east.get(),
            north.get(),
            north.get() + length.get() + 1
        ));
    }

    /** The first solid block under a position. */
    private static Optional<Integer> floorUnder(Level world, BlockPos feet) {
        for (int drop = 0; drop <= MAX_DROP; drop += 1) {
            BlockPos pos = feet.below(drop);
            if (!world.getBlockState(pos).isAir()) {
                return Optional.of(pos.getY());
            }
        }
        return Optional.empty();
    }

    /** Walks one way along the floor until it stops being the same floor. */
    private static Optional<Integer> border(
        Level world,
        int startX,
        int startZ,
        int floorY,
        Block floor,
        int stepX,
        int stepZ
    ) {
        for (int step = 1; step <= MAX_SCAN; step += 1) {
            BlockPos pos = new BlockPos(startX + stepX * step, floorY, startZ + stepZ * step);
            if (!world.getBlockState(pos).is(floor)) {
                return Optional.of(stepX != 0 ? pos.getX() : pos.getZ());
            }
        }
        return Optional.empty();
    }

    /**
     * The first free line positions on a codespace, in the order they fill.
     *
     * <p>Positions already holding something are skipped rather than counted,
     * because the plot may carry lines this client did not place and placing
     * into one is not replacing it.
     */
    public static List<Codespace.LinePosition> freePositions(
        Minecraft client,
        Codespace codespace,
        int wanted
    ) {
        Level world = client.level;
        if (world == null) {
            return List.of();
        }
        List<Codespace.LinePosition> free = new ArrayList<>();
        int total = codespace.capacity().orElse(0);
        for (int index = 0; index < total && free.size() < wanted; index += 1) {
            Optional<Codespace.LinePosition> at = codespace.lineAt(index);
            if (at.isEmpty()) {
                break;
            }
            BlockPos pos = new BlockPos(at.get().x(), at.get().y(), at.get().z());
            if (world.getBlockState(pos).isAir()) {
                free.add(at.get());
            }
        }
        return List.copyOf(free);
    }

    /** Every line position that currently holds a line, in the order they fill. */
    public static List<Codespace.LinePosition> occupiedPositions(
        Minecraft client,
        Codespace codespace
    ) {
        Level world = client.level;
        if (world == null) {
            return List.of();
        }
        List<Codespace.LinePosition> occupied = new ArrayList<>();
        int total = codespace.capacity().orElse(0);
        int empties = 0;
        for (int index = 0; index < total && empties < RUN_OF_EMPTIES; index += 1) {
            Optional<Codespace.LinePosition> at = codespace.lineAt(index);
            if (at.isEmpty()) {
                break;
            }
            BlockPos pos = new BlockPos(at.get().x(), at.get().y(), at.get().z());
            if (world.getBlockState(pos).isAir()) {
                empties += 1;
            } else {
                empties = 0;
                occupied.add(at.get());
            }
        }
        return List.copyOf(occupied);
    }

    /** Where the code already on a codespace sits. */
    public record CodeExtent(int eastmostX, int westmostX, int northmostZ, int lineY, int columns) {}

    /**
     * Finds the code already on this codespace.
     *
     * <p>Worth more than any inference about the layout: lines already down
     * are sitting exactly where the next one should go, so their column and
     * their height are the answer rather than an estimate of it.
     */
    public static Optional<CodeExtent> codeExtent(Minecraft client, Bounds bounds) {
        Level world = client.level;
        if (world == null || client.player == null) {
            return Optional.empty();
        }
        int centreX = client.player.chunkPosition().x();
        int centreZ = client.player.chunkPosition().z();

        List<BlockPos> code = new ArrayList<>();
        for (int x = centreX - SURVEY_CHUNKS; x <= centreX + SURVEY_CHUNKS; x += 1) {
            for (int z = centreZ - SURVEY_CHUNKS; z <= centreZ + SURVEY_CHUNKS; z += 1) {
                var chunk = world.getChunkSource().getChunkNow(x, z);
                if (chunk == null) {
                    continue;
                }
                for (var entry : chunk.getBlockEntities().entrySet()) {
                    if (entry.getValue() instanceof SignBlockEntity && inside(bounds, entry.getKey())) {
                        code.add(entry.getKey());
                    }
                }
            }
        }
        if (code.isEmpty()) {
            return Optional.empty();
        }

        int eastmost = Integer.MIN_VALUE;
        int westmost = Integer.MAX_VALUE;
        int northmost = Integer.MAX_VALUE;
        int lineY = Integer.MAX_VALUE;
        List<Integer> columns = new ArrayList<>();
        for (BlockPos pos : code) {
            eastmost = Math.max(eastmost, pos.getX());
            westmost = Math.min(westmost, pos.getX());
            northmost = Math.min(northmost, pos.getZ());
            lineY = Math.min(lineY, pos.getY());
            if (!columns.contains(pos.getX())) {
                columns.add(pos.getX());
            }
        }
        return Optional.of(new CodeExtent(eastmost, westmost, northmost, lineY, columns.size()));
    }

    private static boolean inside(Bounds bounds, BlockPos pos) {
        return pos.getX() > bounds.westX() && pos.getX() < bounds.eastX()
            && pos.getZ() > bounds.northZ() && pos.getZ() < bounds.southZ();
    }

}
