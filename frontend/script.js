const chat = document.getElementById("chat");
const input = document.getElementById("input");
const hero = document.getElementById("hero");
const historyList = document.getElementById("historyList");
const mapCard = document.getElementById("mapCard");
const statusIndicator = document.getElementById("statusIndicator");

const BACKEND_URL = "http://127.0.0.1:8001/api";

async function backendRequest(path, options = {}) {
    const response = await fetch(`${BACKEND_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options
    });

    if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status}`);
    }

    return response.json();
}

if (!window.pywebview) {
    window.pywebview = {
        api: {
            chat: async message => {
                const data = await backendRequest("/chat", {
                    method: "POST",
                    body: JSON.stringify({ message })
                });
                return data.response;
            },
            get_history: () => backendRequest("/history"),
            clear_history: () => backendRequest("/clear-history", { method: "POST" }),
            speak: async text => {
                const data = await backendRequest("/speak", {
                    method: "POST",
                    body: JSON.stringify({ text })
                });
                return data.status || "ok";
            },
            voice_input: async () => {
                const data = await backendRequest("/voice-input", { method: "POST" });
                return data.text;
            },
            get_ip_location: () => backendRequest("/ip-location"),
            set_voice: index => backendRequest("/set-voice", {
                method: "POST",
                body: JSON.stringify({ index })
            }),
            set_speed: speed => backendRequest("/set-speed", {
                method: "POST",
                body: JSON.stringify({ speed })
            }),
            set_volume: volume => backendRequest("/set-volume", {
                method: "POST",
                body: JSON.stringify({ volume })
            })
        }
    };
}

let map;
let marker;
let voiceEnabled = true;
let showTimestamps = true;
let compactMode = false;
let historyData = [];
let activeHistoryIndex = -1;
let historySearchOpen = false;
let appVersion = "2.0.0";

// Premium features: Settings persistence
const SETTINGS_KEY = "explorer-ai-settings";
const BACKUP_KEY = "explorer-ai-backup";

function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
        const settings = JSON.parse(saved);
        voiceEnabled = settings.voiceEnabled !== false;
        showTimestamps = settings.showTimestamps !== false;
        compactMode = settings.compactMode || false;

        document.getElementById("voiceToggle").checked = voiceEnabled;
        document.getElementById("timestampToggle").checked = showTimestamps;
        document.getElementById("compactModeToggle").checked = compactMode;
    }
}

function saveSettings() {
    const settings = {
        voiceEnabled,
        showTimestamps,
        compactMode,
        lastSaved: new Date().toISOString()
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function autoBackupConversations() {
    if (historyData.length > 0) {
        const backup = {
            timestamp: new Date().toISOString(),
            count: historyData.length,
            data: historyData
        };
        localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
    }
}

// Keyboard shortcuts
document.addEventListener("keydown", event => {
    if (event.ctrlKey || event.metaKey) {
        if (event.key === "n") {
            event.preventDefault();
            newChat();
        } else if (event.key === "m") {
            event.preventDefault();
            voice();
        } else if (event.key === "Enter") {
            event.preventDefault();
            send();
        } else if (event.key === "k") {
            event.preventDefault();
            toggleHistorySearch();
        }
    }
    if (event.shiftKey && event.key === "C") {
        event.preventDefault();
        if (confirm("Clear all chat history?")) {
            clearHistory();
        }
    }
    if (event.key === "?") {
        event.preventDefault();
        showHelp();
    }
});

function formatText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/\n/g, "<br>");
}

function getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function autoResize() {
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
}

function trimPreview(text, max = 70) {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (!clean) return "Untitled conversation";
    return clean.length > max ? `${clean.slice(0, max - 1)}...` : clean;
}

function setHeroVisibility(show) {
    hero.style.display = show ? "block" : "none";
}

function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = `message ${type}`;

    let content = `<div class="message-timestamp${!showTimestamps ? ' hidden' : ''}">${getTimestamp()}</div>`;
    content += `<div class="message-content">${type === "ai" ? formatText(text) : text}</div>`;
    content += `<div class="message-actions">
        <button class="message-action-btn" onclick="copyMessage(this)" title="Copy">📋</button>
        ${type === "ai" ? `<button class="message-action-btn" onclick="speakMessage(this)" title="Speak">🔊</button>` : ''}
    </div>`;

    div.innerHTML = content;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    setHeroVisibility(false);
    return div;
}

function copyMessage(button) {
    const message = button.closest(".message");
    const content = message.querySelector(".message-content").innerText;
    navigator.clipboard.writeText(content).then(() => {
        const original = button.innerText;
        button.innerText = "✓";
        setTimeout(() => button.innerText = original, 1500);
    });
}

function speakMessage(button) {
    const message = button.closest(".message");
    const content = message.querySelector(".message-content").innerText;
    if (window.pywebview) {
        window.pywebview.api.speak(content);
    }
}

function renderHistoryList(data, searchQuery = "") {
    historyData = Array.isArray(data) ? data : [];
    historyList.innerHTML = "";

    let filtered = historyData;
    if (searchQuery) {
        filtered = historyData.filter(item => {
            const query = searchQuery.toLowerCase();
            return (item.user || "").toLowerCase().includes(query) ||
                   (item.ai || "").toLowerCase().includes(query);
        });
    }

    if (filtered.length === 0) {
        const message = searchQuery ? "No conversations match your search." : "Your recent chats will appear here once you start asking questions.";
        historyList.innerHTML = `<div class="empty-history">${message}</div>`;
        return;
    }

    const recent = [...filtered].reverse().slice(0, 12);

    recent.forEach((item, reversedIndex) => {
        const actualIndex = historyData.length - 1 - reversedIndex;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "history-item";
        if (actualIndex === activeHistoryIndex) {
            button.classList.add("active");
        }

        const title = trimPreview(item.user, 42);
        const preview = trimPreview(item.ai, 82);

        button.innerHTML = `<strong>${title}</strong><span>${preview}</span>`;
        button.addEventListener("click", () => replayConversation(actualIndex));
        historyList.appendChild(button);
    });
}

function rebuildChat(messages) {
    chat.innerHTML = "";

    if (!messages || messages.length === 0) {
        setHeroVisibility(true);
        return;
    }

    setHeroVisibility(false);
    messages.forEach(item => {
        addMessage(item.user, "user");
        addMessage(item.ai, "ai");
    });
}

function replayConversation(index) {
    activeHistoryIndex = index;
    renderHistoryList(historyData);

    if (index < 0 || index >= historyData.length) {
        return;
    }

    rebuildChat([historyData[index]]);
}

function loadHistory() {
    if (!window.pywebview) {
        renderHistoryList([]);
        setHeroVisibility(true);
        return;
    }

    window.pywebview.api.get_history().then(data => {
        historyData = Array.isArray(data) ? data : [];
        activeHistoryIndex = historyData.length ? historyData.length - 1 : -1;
        renderHistoryList(historyData);
        rebuildChat(historyData);
    });
}

function send() {
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";
    autoResize();

    const loading = addMessage("<div class='spinner'></div>", "ai");

    if (!window.pywebview) {
        loading.innerText = "Backend not connected";
        return;
    }

    window.pywebview.api.chat(msg).then(response => {
        loading.remove();
        addMessage(response, "ai");
        window.pywebview.api.get_history().then(data => {
            historyData = Array.isArray(data) ? data : [];
            activeHistoryIndex = historyData.length ? historyData.length - 1 : -1;
            renderHistoryList(historyData);
        });

        if (voiceEnabled) {
            window.pywebview.api.speak(response).then(status => {
                if (status !== "ok") {
                    addMessage(status, "ai");
                }
            });
        }
    }).catch(err => {
        loading.remove();
        addMessage("Error: Failed to get response. Please try again.", "ai");
    });
}

function insertPrompt(text) {
    input.value = text;
    autoResize();
    input.focus();
}

function voice() {
    if (!window.pywebview) {
        alert("Voice only works in app");
        return;
    }

    const loading = addMessage("Listening...", "ai");

    window.pywebview.api.voice_input().then(text => {
        loading.remove();

        if (
            !text ||
            text.toLowerCase().includes("failed") ||
            text.toLowerCase().includes("could not") ||
            text.toLowerCase().includes("timed out") ||
            text.toLowerCase().includes("unavailable")
        ) {
            addMessage(text, "ai");
            return;
        }

        input.value = text;
        autoResize();
        input.focus();
    });
}

function setVoice(index) {
    if (window.pywebview) {
        window.pywebview.api.set_voice(index);
    }
}

function setSpeed(speed) {
    document.getElementById("speedValue").innerText = speed;
    if (window.pywebview) {
        window.pywebview.api.set_speed(speed);
    }
}

function setVolume(volume) {
    const percent = Math.round(volume * 100);
    document.getElementById("volumeValue").innerText = percent;
    if (window.pywebview) {
        window.pywebview.api.set_volume(volume);
    }
}

function testVoice() {
    if (window.pywebview) {
        window.pywebview.api.speak("Voice settings are working correctly.");
    }
}

function initMap(lat, lon) {
    mapCard.style.display = "block";

    if (!map) {
        map = L.map("map").setView([lat, lon], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    }

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lon]).addTo(map).bindPopup("You are here").openPopup();
    map.setView([lat, lon], 13);
    setTimeout(() => map.invalidateSize(), 150);
}

function showLocation(lat, lon, label = "Location found") {
    addMessage(`${label}: ${lat.toFixed(4)}, ${lon.toFixed(4)}`, "ai");
    initMap(lat, lon);
}

function fallbackLocation() {
    if (!window.pywebview) {
        addMessage("Unable to get location in browser mode.", "ai");
        return;
    }

    window.pywebview.api.get_ip_location().then(result => {
        if (!result || !result.ok) {
            addMessage(result?.message || "Unable to get location", "ai");
            return;
        }

        const area = [result.city, result.region, result.country].filter(Boolean).join(", ");
        const label = area ? `Approximate location via network (${area})` : "Approximate location via network";
        showLocation(result.lat, result.lon, label);
    }).catch(() => {
        addMessage("Unable to get location", "ai");
    });
}

function getLocation() {
    addMessage("Checking your location...", "ai");

    if (!navigator.geolocation) {
        fallbackLocation();
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        showLocation(lat, lon, "Exact location");
    }, error => {
        const errors = {
            1: "Location permission was denied. Using network-based fallback instead.",
            2: "Device location is unavailable. Using network-based fallback instead.",
            3: "Location request timed out. Using network-based fallback instead."
        };

        addMessage(errors[error.code] || "Unable to get exact location. Using fallback instead.", "ai");
        fallbackLocation();
    }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });
}

function closeMap() {
    mapCard.style.display = "none";
}

function newChat() {
    chat.innerHTML = "";
    activeHistoryIndex = -1;
    closeMap();
    renderHistoryList(historyData);
    setHeroVisibility(true);
}

function clearHistory() {
    if (!window.pywebview) {
        historyData = [];
        renderHistoryList(historyData);
        newChat();
        return;
    }

    window.pywebview.api.clear_history().then(() => {
        historyData = [];
        renderHistoryList(historyData);
        newChat();
    });
}

function focusHistoryPanel() {
    historyList.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function toggleHistorySearch() {
    const searchInput = document.getElementById("historySearch");
    historySearchOpen = !historySearchOpen;
    searchInput.style.display = historySearchOpen ? "block" : "none";
    if (historySearchOpen) {
        searchInput.focus();
    } else {
        searchInput.value = "";
        renderHistoryList(historyData);
    }
}

function toggleSearchPanel() {
    addMessage("Use the search box in the history panel to find past conversations.", "ai");
}

function showHelp() {
    document.getElementById("helpModal").style.display = "flex";
}

function showSettings() {
    const modal = document.getElementById("settingsModal");
    document.getElementById("timestampToggleModal").checked = showTimestamps;
    document.getElementById("compactModeToggle").checked = compactMode;
    modal.style.display = "flex";
}

function exportHistory() {
    document.getElementById("exportModal").style.display = "flex";
}

function downloadConversation(format) {
    if (historyData.length === 0) {
        alert("No conversations to export.");
        return;
    }

    let content = "";
    const timestamp = new Date().toLocaleString();

    if (format === "txt") {
        content = "Explorer AI - Conversation Export\n";
        content += `Exported: ${timestamp}\n`;
        content += "=".repeat(50) + "\n\n";

        historyData.forEach((item, i) => {
            content += `Conversation ${i + 1}\n`;
            content += "-".repeat(30) + "\n";
            content += `You: ${item.user}\n\n`;
            content += `Assistant: ${item.ai}\n\n`;
        });
    } else if (format === "json") {
        content = JSON.stringify({
            exported: timestamp,
            conversations: historyData
        }, null, 2);
    } else if (format === "md") {
        content = "# Explorer AI - Conversation Export\n\n";
        content += `**Exported:** ${timestamp}\n\n`;

        historyData.forEach((item, i) => {
            content += `## Conversation ${i + 1}\n\n`;
            content += `**You:** ${item.user}\n\n`;
            content += `**Assistant:** ${item.ai}\n\n`;
            content += "---\n\n";
        });
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `explorer-ai-conversations.${format === 'json' ? 'json' : format === 'md' ? 'md' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    closeModal("exportModal");
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Close modals when clicking outside
document.addEventListener("click", event => {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
});

// Update topbar time
function updateTopbarTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("topbarTime").innerText = timeStr;
}

setInterval(updateTopbarTime, 60000);
updateTopbarTime();

// Input event listeners
input.addEventListener("input", autoResize);

input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        send();
    }
});

// History search
document.getElementById("historySearch").addEventListener("input", event => {
    renderHistoryList(historyData, event.target.value);
});

// Settings modal updates
document.addEventListener("DOMContentLoaded", () => {
    loadSettings();

    const toggle = document.getElementById("voiceToggle");
    voiceEnabled = toggle.checked;
    toggle.addEventListener("change", () => {
        voiceEnabled = toggle.checked;
        saveSettings();
    });

    const timestampToggle = document.getElementById("timestampToggle");
    showTimestamps = timestampToggle.checked;
    timestampToggle.addEventListener("change", () => {
        showTimestamps = timestampToggle.checked;
        updateTimestampVisibility();
        saveSettings();
    });

    closeMap();
    autoResize();
    loadHistory();

    // Auto-backup every 5 minutes
    setInterval(autoBackupConversations, 300000);
});

function updateTimestampVisibility() {
    const timestamps = document.querySelectorAll(".message-timestamp");
    timestamps.forEach(ts => {
        if (showTimestamps) {
            ts.classList.remove("hidden");
        } else {
            ts.classList.add("hidden");
        }
    });
}
