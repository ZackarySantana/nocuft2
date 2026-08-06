package dev.nocuft.client.mod.ui;

import dev.nocuft.client.mod.NocuftClient;
import net.minecraft.client.gui.GuiGraphicsExtractor;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;

/** Confirms whether a new immutable item revision should fan out to projects. */
public final class ItemCaptureScreen extends Screen {
    private final String name;
    private final String snbt;
    private final int currentVersion;
    private final int nextVersion;
    private final int projects;
    private final boolean updateAllAvailable;

    public ItemCaptureScreen(
        String name,
        String snbt,
        int currentVersion,
        int nextVersion,
        int projects,
        boolean updateAllAvailable
    ) {
        super(Component.literal("Update " + name));
        this.name = name;
        this.snbt = snbt;
        this.currentVersion = currentVersion;
        this.nextVersion = nextVersion;
        this.projects = projects;
        this.updateAllAvailable = updateAllAvailable;
    }

    @Override
    protected void init() {
        int width = 210;
        int left = (this.width - width) / 2;
        int top = this.height / 2 + 12;
        Button updateAll = Button.builder(Component.literal(updateAllAvailable
            ? "Create v" + nextVersion + " and update all"
            : "Update all unavailable"),
            button -> choose("update-all")).bounds(left, top, width, 20).build();
        updateAll.active = updateAllAvailable;
        addRenderableWidget(updateAll);
        addRenderableWidget(Button.builder(Component.literal("Create v" + nextVersion + " only"),
            button -> choose("catalog-only")).bounds(left, top + 24, width, 20).build());
        addRenderableWidget(Button.builder(Component.translatable("gui.cancel"), button -> onClose())
            .bounds(left, top + 48, width, 20).build());
    }

    private void choose(String action) {
        onClose();
        NocuftClient.completeItemCapture(name, snbt, action, currentVersion);
    }

    @Override
    public void extractRenderState(
        GuiGraphicsExtractor context,
        int mouseX,
        int mouseY,
        float delta
    ) {
        super.extractRenderState(context, mouseX, mouseY, delta);
        int centre = width / 2;
        context.centeredText(
            font,
            Component.literal("Update " + name + " from v" + currentVersion + " to v" + nextVersion + "?"),
            centre,
            height / 2 - 34,
            0xFFFFFFFF
        );
        context.centeredText(
            font,
            Component.literal("Installed by " + projects + (projects == 1 ? " registered project." : " registered projects.")),
            centre,
            height / 2 - 16,
            0xFFAAAAAA
        );
    }
}
