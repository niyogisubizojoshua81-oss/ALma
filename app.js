// ALma Sample Database Engine with 10 Mandated Photos per object
const propertiesDb = [
    {
        id: 1,
        title: "Modern 2 Bedroom Apartment",
        location: "Rubaga",
        category: "rent",
        price: "1,200,000 USh",
        numericPrice: 1200000,
        broker: "Kampala Realty Group",
        phone: "+256 772 123456",
        features: "2 Baths, Prepaid Meter, Secured Fencing",
        images: Array(10).fill("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80")
    },
    {
        id: 2,
        title: "Prime Commercial Corner Space",
        location: "Nakawa",
        category: "shop",
        price: "3,500,000 USh",
        numericPrice: 3500000,
        broker: "Arthur Musoke",
        phone: "+256 701 987654",
        features: "High Foot Traffic, Glass Display, Tiled Floors",
        images: Array(11).fill("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80")
    }
];

// Initialize and render property collection
document.addEventListener("DOMContentLoaded", () => {
    renderProperties(propertiesDb);
});

function renderProperties(data) {
    const grid = document.getElementById("propertyGrid");
    grid.innerHTML = "";

    if(data.length === 0) {
        grid.innerHTML = `<p class='no-results'>No listings match your search selection on ALma.</p>`;
        return;
    }

    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "property-card";
        card.innerHTML = `
            <div class="card-img-wrapper" onclick="openDetails(${item.id})">
                <img src="${item.images[0]}" alt="Property Showcase">
                <span class="img-badge"><i class="fa-solid fa-images"></i> ${item.images.length} Photos</span>
            </div>
            <div class="card-content">
                <div class="card-price">${item.price}</div>
                <h4 class="card-title">${item.title}</h4>
                <p class="card-meta"><i class="fa-solid fa-location-dot"></i> ${item.location} | <strong>${item.category.toUpperCase()}</strong></p>
                <div class="card-actions">
                    <button class="btn btn-primary btn-sm" onclick="startBrokerChat('${item.broker}')">Chat Agent</button>
                    <button class="flag-btn" title="Report Incorrect Information" onclick="toggleReportModal(true, ${item.id})">
                        <i class="fa-solid fa-triangle-exclamation"></i> Report Fraud
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Multi-tier Sorting & Searching Engine
function applyFilters() {
    const locValue = document.getElementById("searchLocation").value.toLowerCase();
    const catValue = document.getElementById("searchCategory").value;

    const filtered = propertiesDb.filter(prop => {
        const matchLoc = prop.location.toLowerCase().includes(locValue);
        const matchCat = catValue === "" || prop.category === catValue;
        return matchLoc && matchCat;
    });

    renderProperties(filtered);
}

// View Management & UI Modals Engine
function toggleAuthModal(show) {
    document.getElementById("authModal").style.display = show ? "flex" : "none";
}

function toggleReportModal(show, id = null) {
    document.getElementById("reportModal").style.display = show ? "flex" : "none";
    if(id) document.getElementById("reportPropertyId").value = id;
}

function toggleDetailModal(show) {
    document.getElementById("detailModal").style.display = show ? "flex" : "none";
}

// Strict ALma Ethical Flagging Framework
function submitReport(e) {
    e.preventDefault();
    const targetId = document.getElementById("reportPropertyId").value;
    const selection = document.getElementById("reportReason").value;

    alert(`Warning Logged! ALma Trust Team has flagged Listing ID #${targetId} for "${selection}". Our system will cross-reference pricing metrics immediately. Brokers giving wrong information face terminal account locks within 24 hours.`);
    
    toggleReportModal(false);
    document.getElementById("reportDetails").value = "";
}

// Opens complete portfolio including all 10 mandated high-res screens
function openDetails(id) {
    const target = propertiesDb.find(p => p.id === id);
    if(!target) return;

    const infoBox = document.getElementById("modalPropertyDetails");
    infoBox.innerHTML = `
        <h3>${target.title}</h3>
        <h2 style="color:var(--primary-red); margin: 10px 0;">${target.price}</h2>
        <p><strong>Location:</strong> ${target.location}</p>
        <p><strong>Amenities:</strong> ${target.features}</p>
        <p><strong>Authorized Broker:</strong> ${target.broker} (${target.phone})</p>
    `;

    const strip = document.getElementById("modalGalleryStrip");
    strip.innerHTML = "";
    target.images.forEach(imgUrl => {
        const thumb = document.createElement("img");
        thumb.src = imgUrl;
        strip.appendChild(thumb);
    });

    toggleDetailModal(true);
}

// ALma Messaging Ecosystem
function toggleChatList() {
    const chatBox = document.getElementById("chatSystem");
    chatBox.style.display = (chatBox.style.display === "flex") ? "none" : "flex";
}

function startBrokerChat(brokerName) {
    document.getElementById("chatPartnerName").innerText = `${brokerName} | ALma Chat`;
    const history = document.getElementById("chatHistory");
    history.innerHTML = `
        <div class="chat-bubble incoming">Hello! Welcome to ALma Secure Messaging. Let me know if you want to negotiate or set up an inspection for this property!</div>
    `;
    document.getElementById("chatSystem").style.display = "flex";
}

function sendChatMessage() {
    const input = document.getElementById("chatInputField");
    if(input.value.trim() === "") return;

    const history = document.getElementById("chatHistory");
    const outgoing = document.createElement("div");
    outgoing.className = "chat-bubble outgoing";
    outgoing.innerText = input.value;
    
    history.appendChild(outgoing);
    input.value = "";
    history.scrollTop = history.scrollHeight;
}
