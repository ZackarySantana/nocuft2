package dev.nocuft.client.plan;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Works out what a selection puts on a plot, and refuses what it cannot.
 *
 * <p>This runs without Minecraft so it can be tested, and there is deliberately
 * little of it. Every apply clears the codespace and places the selection, so a
 * plot carries exactly what was last applied to it. That removes the questions
 * this used to answer: there is no line to match by name, no drift to find, no
 * foreign line to account for, and no order of operations that could leave a
 * plot holding half of two builds. What is left is checking that the selection
 * is real and saying what it comes to.
 */
public final class Planner {
    private Planner() {
    }

    /** What an apply was asked to put on the plot. */
    public record Request(String projectId, List<String> selectedUnitIds) {
        public Request {
            selectedUnitIds = List.copyOf(selectedUnitIds);
        }
    }

    /** The lines an apply will place, and what they come to together. */
    public record Plan(List<Bundle.Unit> place, String digest) {
        public Plan {
            place = List.copyOf(place);
        }
    }

    /**
     * Resolves a request against the builds this client holds.
     *
     * @param held every bundle this client currently holds, by project id
     */
    public static Plan plan(Map<String, Bundle> held, Request request) {
        Bundle bundle = held.get(request.projectId());
        if (bundle == null) {
            throw new BundleException(
                "bundle.unknown_project",
                "This client holds no build for " + request.projectId() + "."
            );
        }

        // Named units rather than all of them, and deduplicated, because a
        // selection is a set and asking for the same line twice would place it
        // twice.
        List<Bundle.Unit> place = new ArrayList<>();
        Set<String> selected = new LinkedHashSet<>(request.selectedUnitIds());
        for (String id : selected) {
            place.add(bundle.unit(id).orElseThrow(() -> new BundleException(
                "apply.unknown_unit",
                "The build for " + request.projectId() + " produces no unit " + id + "."
            )));
        }
        return new Plan(place, bundle.digestOf(place));
    }
}
