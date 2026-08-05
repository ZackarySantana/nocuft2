package dev.nocuft.client.mod;

import dev.nocuft.client.plan.Bundle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * The builds Nocuft has handed this client, for as long as Nocuft is attached.
 *
 * <p>Deliberately not kept on disk, and dropped when its supplying connection
 * closes. Nocuft is the source of truth for what a project builds to, and a
 * copy that outlives it is a second, older answer to the same question: a
 * build read back tomorrow describes source that has since changed, and
 * nothing here could tell. Rather than show that and qualify it, the client
 * holds nothing it was not just told.
 *
 * <p>The plot is a different matter. What is applied is recorded on the plot
 * itself, so reading it back needs no build and no connection.
 */
public final class BundleStore {
    private record Held(Object source, Bundle bundle) {}

    private final Map<String, Held> held = new ConcurrentHashMap<>();

    /** Keeps a build that just arrived. */
    public void push(Object source, Bundle bundle) {
        held.put(bundle.projectId(), new Held(source, bundle));
    }

    /** Forgets every build supplied by one connection. */
    public void forget(Object source) {
        held.values().removeIf(entry -> entry.source() == source);
    }

    public boolean forget(String projectId) {
        return held.remove(projectId) != null;
    }

    public List<Bundle> all() {
        List<Bundle> all = new ArrayList<>();
        held.values().forEach(entry -> all.add(entry.bundle()));
        all.sort((left, right) -> left.projectId().compareTo(right.projectId()));
        return all;
    }

    /** Every build by project id, which is what the planner takes. */
    public Map<String, Bundle> byProject() {
        Map<String, Bundle> bundles = new LinkedHashMap<>();
        for (Bundle bundle : all()) {
            bundles.put(bundle.projectId(), bundle);
        }
        return bundles;
    }

    public Optional<Bundle> get(String projectId) {
        return Optional.ofNullable(held.get(projectId)).map(Held::bundle);
    }

    public int size() {
        return held.size();
    }
}
