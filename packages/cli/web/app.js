/* Nocuft code viewer.
   Read-only view of the live compiler state: projects, templates, and the
   DiamondFire code line drawn as numbered, bracket-indented rows. */

const projectsElement = required("projects");
const viewerElement = required("viewer");
const connectionElement = required("connection");
const connectionLabel = required("connection-label");
const searchElement = required("project-search");

const MAX_DEPTH = 8;
const PIN_STORAGE_KEY = "nocuft.web.pinned-projects.v1";
const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
});
const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
});
const datedYearFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
});
const fullDateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "short",
});

let snapshot = { revision: 0, projects: [] };
let selectedTemplateId;
let initialSelectionSettled = false;
let idCounter = 0;
let pinnedProjects = loadPinnedProjects();

searchElement.addEventListener("input", renderProjects);
scheduleDayRefresh();
document.addEventListener("keydown", (event) => {
    const focused = document.activeElement;
    const editing = focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement;
    if (
        (event.key === "/" && !editing && !event.ctrlKey && !event.metaKey && !event.altKey) ||
        (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey))
    ) {
        event.preventDefault();
        searchElement.focus();
        searchElement.select();
        return;
    }
    if (event.key === "Escape" && focused === searchElement) {
        if (searchElement.value !== "") {
            searchElement.value = "";
            renderProjects();
        } else {
            searchElement.blur();
        }
    }
});

const events = new EventSource("/api/events");
events.addEventListener("open", () => setConnection("live", "Live"));
events.addEventListener("error", () => setConnection("waiting", "Reconnecting"));
events.addEventListener("state", (event) => {
    try {
        snapshot = JSON.parse(event.data);
        setConnection("live", "Live");
        render();
    } catch {
        setConnection("error", "Invalid update");
    }
});

function render() {
    idCounter = 0;
    const templates = snapshot.projects.flatMap((project) =>
        project.templates.map((template) => ({ project, template })));
    const preferredTemplateId = orderedProjects("")
        .flatMap(({ project }) => project.templates)
        .at(0)?.id;
    const selectedTemplateExists = templates.some(
        ({ template }) => template.id === selectedTemplateId,
    );
    if (!selectedTemplateExists || !initialSelectionSettled) {
        selectedTemplateId = preferredTemplateId;
    }
    if (!snapshot.projects.some((project) => project.status === "compiling")) {
        initialSelectionSettled = true;
    }
    renderProjects();
    renderViewer(templates.find(({ template }) => template.id === selectedTemplateId));
}

function renderProjects() {
    const query = searchElement.value.trim().toLocaleLowerCase();
    const projects = orderedProjects(query);
    if (projects.length === 0) {
        projectsElement.replaceChildren(element(
            "p",
            "search-empty",
            query === "" ? "No registered projects" : `No matches for “${searchElement.value.trim()}”`,
        ));
        return;
    }
    projectsElement.replaceChildren(...projects.map(({ project }) => {
        const section = element("section", "project");
        if (pinnedProjects.has(project.name)) {
            section.classList.add("is-pinned");
        }
        const name = element("h3", "project-name");
        name.append(sourceLink(project.sources?.[0], project.name, "project-link"));
        name.id = uniqueId("project");
        section.setAttribute("aria-labelledby", name.id);

        const head = element("div", "project-head");
        const actions = element("div", "project-actions");
        actions.append(statusText(project), pinButton(project));
        head.append(name, actions);
        const meta = element("p", "project-meta");
        meta.append(element("span", "project-module", project.module));
        const timestamp = projectTimestamp(project.modifiedAtMs);
        if (timestamp !== undefined) {
            meta.append(timestamp);
        }
        section.append(head, meta);

        if (project.templates.length > 0) {
            const list = element("div", "templates");
            list.setAttribute("role", "group");
            list.setAttribute("aria-label", `Templates in ${project.name}`);
            for (const template of project.templates) {
                list.append(templateButton(template));
            }
            section.append(list);
        } else {
            section.append(element(
                "p",
                "project-empty",
                project.status === "failed" ? "No successful build" : "Compiling",
            ));
        }

        if (project.diagnostics.length > 0) {
            const diagnostics = element("div", "rail-diags");
            diagnostics.setAttribute("role", "group");
            diagnostics.setAttribute("aria-label", `Diagnostics for ${project.name}`);
            for (const diagnostic of project.diagnostics) {
                diagnostics.append(diagnosticLine(diagnostic));
            }
            section.append(diagnostics);
        }
        return section;
    }));
}

function orderedProjects(query) {
    return snapshot.projects
        .map((project, index) => ({ project: matchingProject(project, query), index }))
        .filter(({ project }) => project !== undefined)
        .sort(compareProjects);
}

function compareProjects(left, right) {
    const pinOrder = Number(pinnedProjects.has(right.project.name)) -
        Number(pinnedProjects.has(left.project.name));
    if (pinOrder !== 0) {
        return pinOrder;
    }
    const modifiedOrder = (right.project.modifiedAtMs ?? 0) -
        (left.project.modifiedAtMs ?? 0);
    if (modifiedOrder !== 0) {
        return modifiedOrder;
    }
    return left.project.name.localeCompare(right.project.name) || left.index - right.index;
}

function projectTimestamp(modifiedAtMs) {
    if (!Number.isFinite(modifiedAtMs)) {
        return undefined;
    }
    const date = new Date(modifiedAtMs);
    const timestamp = element("time", "project-time", formatProjectTimestamp(date));
    timestamp.dateTime = date.toISOString();
    timestamp.title = fullDateFormatter.format(date);
    return timestamp;
}

function formatProjectTimestamp(date) {
    const today = startOfDay(new Date());
    const savedDay = startOfDay(date);
    const daysAgo = calendarDaysBetween(savedDay, today);
    const day = daysAgo === 0
        ? "Today"
        : daysAgo === 1
            ? "Yesterday"
            : daysAgo > 1 && daysAgo < 7
                ? weekdayFormatter.format(date)
                : date.getFullYear() === today.getFullYear()
                    ? dateFormatter.format(date)
                    : datedYearFormatter.format(date);
    return `${day} · ${timeFormatter.format(date)}`;
}

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function calendarDaysBetween(earlier, later) {
    const earlierUtc = Date.UTC(earlier.getFullYear(), earlier.getMonth(), earlier.getDate());
    const laterUtc = Date.UTC(later.getFullYear(), later.getMonth(), later.getDate());
    return Math.round((laterUtc - earlierUtc) / 86_400_000);
}

function scheduleDayRefresh() {
    const nextDay = new Date();
    nextDay.setHours(24, 0, 1, 0);
    setTimeout(() => {
        renderProjects();
        scheduleDayRefresh();
    }, nextDay.getTime() - Date.now());
}

function matchingProject(project, query) {
    if (query === "") {
        return project;
    }
    const projectMatches = [project.name, project.module, ...(project.sources ?? [])]
        .some((value) => String(value ?? "").toLocaleLowerCase().includes(query));
    const templates = projectMatches
        ? project.templates
        : project.templates.filter((template) =>
            templateSearchText(template).includes(query));
    return projectMatches || templates.length > 0 ? { ...project, templates } : undefined;
}

function templateSearchText(template) {
    return [
        template.name,
        template.nativeName,
        template.kind,
        ...template.blocks.flatMap((block) => [
            block.block,
            humanize(block.block),
            block.action,
            humanize(block.action),
            block.data,
            block.target,
            ...(block.args?.items ?? []).flatMap(({ item }) => [item.id, stableJson(item.data)]),
        ]),
    ].filter((value) => value !== undefined).join("\n").toLocaleLowerCase();
}

function pinButton(project) {
    const pinned = pinnedProjects.has(project.name);
    const button = element("button", "pin");
    button.type = "button";
    button.setAttribute("aria-pressed", String(pinned));
    button.setAttribute("aria-label", `${pinned ? "Unpin" : "Pin"} ${project.name}`);
    button.title = `${pinned ? "Unpin" : "Pin"} ${project.name}`;
    button.append(pinIcon());
    button.addEventListener("click", () => {
        if (pinned) {
            pinnedProjects.delete(project.name);
        } else {
            pinnedProjects.add(project.name);
        }
        savePinnedProjects();
        renderProjects();
    });
    return button;
}

function pinIcon() {
    const namespace = "http://www.w3.org/2000/svg";
    const icon = document.createElementNS(namespace, "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    const head = document.createElementNS(namespace, "path");
    head.setAttribute("class", "pin-head");
    head.setAttribute("d", "M8 3h8v2h-1v6l2 3v1H7v-1l2-3V5H8Z");
    const stem = document.createElementNS(namespace, "path");
    stem.setAttribute("d", "M12 15v6");
    icon.append(head, stem);
    return icon;
}

function templateButton(template) {
    const button = element("button", "template-btn");
    button.type = "button";
    if (template.id === selectedTemplateId) {
        button.setAttribute("aria-current", "true");
    }
    button.append(
        element("span", "template-name", template.nativeName),
        element("span", "template-kind", humanize(template.kind)),
    );
    button.addEventListener("click", () => {
        selectedTemplateId = template.id;
        initialSelectionSettled = true;
        render();
        viewerElement.focus();
    });
    return button;
}

function renderViewer(selected) {
    if (!selected) {
        const waiting = snapshot.projects.some((project) => project.status === "compiling");
        const failed = snapshot.projects.some((project) => project.status === "failed");
        viewerElement.replaceChildren(emptyState(
            failed ? "Build failed" : waiting ? "Compiling projects" : "No templates",
            failed
                ? "Fix the diagnostics listed beside the project. The viewer retries after the next save."
                : "Templates will appear here after a successful build.",
        ));
        return;
    }

    const { project, template } = selected;
    const contents = [documentHead(project, template)];

    if (project.diagnostics.length > 0) {
        const panel = element("section", "diags");
        const heading = element("h3", "group-label", "Current build diagnostics");
        heading.id = uniqueId("diagnostics");
        panel.setAttribute("aria-labelledby", heading.id);
        panel.append(heading);
        for (const diagnostic of project.diagnostics) {
            panel.append(diagnosticLine(diagnostic));
        }
        contents.push(panel);
    }

    contents.push(codeLine(template));
    viewerElement.replaceChildren(...contents);
}

function documentHead(project, template) {
    const category = template.kind === "function" ? "func" : template.kind;
    const header = element("header", `doc-head ${categoryClass(category)}`);

    const path = element("p", "doc-path");
    path.append(
        sourceLink(project.sources?.[0], project.name),
        separator("/"),
        document.createTextNode(project.module),
    );

    const meta = element("p", "doc-meta");
    meta.append(
        element("span", "doc-kind", humanize(template.kind)),
        separator("·"),
        element(
            "span",
            undefined,
            `${template.blocks.length} ${plural(template.blocks.length, "block")}`,
        ),
    );
    if (project.stale) {
        meta.append(separator("·"), element("span", "doc-stale", "Last successful build"));
    }

    header.append(path, element("h2", "doc-title", template.nativeName), meta);
    if (project.sources?.length > 0) {
        const sourceList = element("p", "source-list");
        sourceList.append(element("span", "source-label", "Sources"));
        project.sources.forEach((source, index) => {
            if (index > 0) {
                sourceList.append(separator("/"));
            }
            sourceList.append(sourceLink(source, sourceName(source)));
        });
        header.append(sourceList);
    }
    return header;
}

function codeLine(template) {
    const code = element("ol", "code");
    code.setAttribute("role", "list");
    code.setAttribute("aria-label", `DiamondFire code for ${template.nativeName}`);
    let depth = 0;
    for (const [index, block] of template.blocks.entries()) {
        const bracket = bracketInfo(block);
        if (bracket?.direct === "close") {
            depth = Math.max(0, depth - 1);
        }
        code.append(renderBlock(block, index, depth, bracket));
        if (bracket?.direct === "open") {
            depth += 1;
        }
    }
    return code;
}

function renderBlock(block, index, depth, bracket) {
    const row = element("li", `block ${categoryClass(bracket ? "bracket" : block.block)}`);
    if (bracket) {
        row.classList.add("is-bracket");
    }
    if (depth > 0) {
        row.dataset.depth = String(Math.min(depth, MAX_DEPTH));
    }
    row.append(element("span", "block-index", String(index + 1)));

    const body = element("div", "block-body");
    body.append(bracket ? bracketHead(bracket) : blockHead(block));

    const items = [...(block.args?.items ?? [])];
    const values = items
        .filter(({ item }) => item.id !== "bl_tag")
        .sort((left, right) => left.slot - right.slot);
    const tags = items
        .filter(({ item }) => item.id === "bl_tag")
        .sort((left, right) => left.slot - right.slot);

    if (values.length > 0) {
        const list = element("div", "args");
        list.setAttribute("role", "group");
        list.setAttribute("aria-label", "Arguments");
        for (const value of values) {
            list.append(...argumentCells(value));
        }
        body.append(list);
    }

    if (tags.length > 0) {
        const list = element("div", "args tags");
        list.setAttribute("role", "group");
        list.setAttribute("aria-label", "Tags");
        list.append(element("p", "group-label", "Tags"));
        for (const tag of tags) {
            list.append(...tagCells(tag));
        }
        body.append(list);
    }

    if (values.length === 0 && tags.length === 0 && !bracket) {
        body.append(element("p", "block-empty", "No arguments"));
    }

    row.append(body);
    return row;
}

function argumentCells({ slot, item }) {
    const parts = valueParts(item);
    const value = element("span", `arg-value value-${safeClass(item.id)}`);
    if (parts.text.length > 0) {
        value.append(document.createTextNode(parts.text));
    } else {
        value.append(element("span", "arg-blank", "empty"));
    }
    if (parts.note !== undefined) {
        value.append(element("span", "arg-note", parts.note));
    }
    value.title = stableJson(item.data ?? {});
    return [slotLabel(slot), element("span", "arg-type", valueType(item.id)), value];
}

function tagCells({ slot, item }) {
    const data = item.data ?? {};
    const value = element("span", "arg-value tag-value", String(data.option ?? ""));
    value.title = stableJson(data);
    return [
        slotLabel(slot),
        element("span", "arg-type tag-name", String(data.tag ?? "Tag")),
        value,
    ];
}

function slotLabel(slot) {
    const label = element("span", "arg-slot", String(slot));
    label.title = `Slot ${slot}`;
    return label;
}

function blockHead(block) {
    const head = element("div", "block-head");
    head.append(element("span", "block-kind", humanize(block.block)));
    const title = block.action ?? block.data ?? block.block;
    head.append(element("h3", "block-name", humanize(title)));
    if (block.target) {
        const target = element("span", "block-target");
        const arrow = element("span", "arrow", "→");
        arrow.setAttribute("aria-hidden", "true");
        target.append(arrow, document.createTextNode(humanize(block.target)));
        target.title = `Target: ${humanize(block.target)}`;
        head.append(target);
    }
    return head;
}

function bracketHead(bracket) {
    const head = element("div", "block-head");
    const glyph = bracket.direct === "open" ? "{" : bracket.direct === "close" ? "}" : "{ }";
    const mark = element("span", "bracket-glyph", glyph);
    mark.setAttribute("aria-hidden", "true");
    head.append(mark, element("span", "block-kind", "Bracket"));
    const note = [bracket.direct, bracket.type]
        .filter((part) => part !== undefined && part !== null)
        .map((part) => humanize(part));
    if (note.length > 0) {
        head.append(element("span", "bracket-note", note.join(" · ")));
    }
    return head;
}

function bracketInfo(block) {
    if (block.id !== "bracket" && block.block !== "bracket") {
        return undefined;
    }
    const direct = block.direct === "open" || block.direct === "close" ? block.direct : undefined;
    return { direct, type: block.type };
}

function diagnosticLine(diagnostic) {
    const line = element("p", "diag");
    line.append(
        element("span", "diag-code", String(diagnostic.code)),
        document.createTextNode(String(diagnostic.message)),
    );
    return line;
}

/* Values keep every detail they carried before: the leading text is the
   identity, the note holds the qualifier, and the title attribute exposes the
   raw payload. Unknown item ids fall back to stable JSON. */
function valueParts(item) {
    const data = item.data ?? {};
    switch (item.id) {
        case "txt":
        case "num":
        case "comp":
            return { text: String(data.name ?? "") };
        case "var":
            return {
                text: String(data.name ?? "variable"),
                note: String(data.scope ?? "unknown scope"),
            };
        case "g_val":
            return {
                text: String(data.type ?? "value"),
                note: String(data.target ?? "default"),
            };
        case "snd":
            return {
                text: String(data.sound ?? "sound"),
                note: `volume ${data.vol ?? "?"} · pitch ${data.pitch ?? "?"}`,
            };
        case "loc": {
            const location = data.loc ?? {};
            const angled = location.pitch !== undefined || location.yaw !== undefined;
            return {
                text: `${location.x ?? "?"}, ${location.y ?? "?"}, ${location.z ?? "?"}`,
                note: angled
                    ? `pitch ${location.pitch ?? "?"} · yaw ${location.yaw ?? "?"}`
                    : undefined,
            };
        }
        case "item":
            return { text: String(data.item ?? "item") };
        case "pn_el":
            return {
                text: String(data.name ?? "parameter"),
                note: String(data.type ?? "unknown"),
            };
        default:
            return { text: stableJson(data) };
    }
}

function valueType(id) {
    return ({
        txt: "Text",
        num: "Number",
        comp: "Component",
        var: "Variable",
        g_val: "Game value",
        snd: "Sound",
        loc: "Location",
        item: "Item",
        pn_el: "Parameter",
    })[id] ?? humanize(id);
}

function statusText(project) {
    const stale = project.status === "failed" && Boolean(project.stale);
    const label = project.status === "compiling"
        ? "Compiling"
        : project.status === "failed"
            ? stale ? "Stale" : "Failed"
            : "Ready";
    const status = element("span", `status status-${project.status}${stale ? " status-stale" : ""}`);
    const dot = element("span", "status-dot");
    dot.setAttribute("aria-hidden", "true");
    status.append(dot, document.createTextNode(label));
    return status;
}

function emptyState(title, description) {
    const section = element("section", "empty");
    section.append(
        element("p", "empty-kicker", "Live compiler"),
        element("h2", "empty-title", title),
        element("p", "empty-body", description),
    );
    return section;
}

function separator(glyph) {
    const span = element("span", "sep", glyph);
    span.setAttribute("aria-hidden", "true");
    return span;
}

function sourceLink(path, label, className) {
    if (!path) {
        return document.createTextNode(label);
    }
    const link = element("a", className ?? "source-link", label);
    link.href = `/api/source?${new URLSearchParams({ path })}`;
    link.title = path;
    return link;
}

function sourceName(path) {
    const parts = path.replace(/\\/gu, "/").split("/").filter(Boolean);
    return parts.slice(-2).join("/") || path;
}

function loadPinnedProjects() {
    try {
        const stored = JSON.parse(localStorage.getItem(PIN_STORAGE_KEY) ?? "[]");
        return new Set(Array.isArray(stored) ? stored.filter((value) => typeof value === "string") : []);
    } catch {
        return new Set();
    }
}

function savePinnedProjects() {
    try {
        localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify([...pinnedProjects]));
    } catch {
        // Pinning still works for this page session when storage is unavailable.
    }
}

function setConnection(status, label) {
    connectionElement.className = `conn conn-${status}`;
    connectionLabel.textContent = label;
}

function categoryClass(value) {
    const category = safeClass(value);
    const known = new Set([
        "func", "call-func", "process", "start-process",
        "event", "entity-event", "game-event", "player-event",
        "player-action", "entity-action", "game-action",
        "select-obj", "set-var", "control", "repeat", "else", "bracket",
        "if-player", "if-entity", "if-game", "if-var",
    ]);
    return known.has(category) ? `category-${category}` : "category-other";
}

function humanize(value) {
    return String(value ?? "")
        .replace(/_/gu, " ")
        .replace(/([a-z0-9])([A-Z])/gu, "$1 $2")
        .replace(/\b\w/gu, (letter) => letter.toUpperCase());
}

function safeClass(value) {
    return String(value).replace(/_/gu, "-").replace(/[^a-zA-Z0-9-]/gu, "").toLowerCase();
}

function stableJson(value) {
    if (Array.isArray(value)) {
        return `[${value.map(stableJson).join(", ")}]`;
    }
    if (value !== null && typeof value === "object") {
        return `{${Object.entries(value)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([key, entry]) => `${JSON.stringify(key)}: ${stableJson(entry)}`)
            .join(", ")}}`;
    }
    return JSON.stringify(value);
}

function plural(count, singular) {
    return count === 1 ? singular : `${singular}s`;
}

function element(tag, className, text) {
    const output = document.createElement(tag);
    if (className) {
        output.className = className;
    }
    if (text !== undefined) {
        output.textContent = text;
    }
    return output;
}

function uniqueId(prefix) {
    idCounter += 1;
    return `${prefix}-${idCounter}`;
}

function required(id) {
    const value = document.getElementById(id);
    if (!value) {
        throw new Error(`Missing page element: ${id}`);
    }
    return value;
}
