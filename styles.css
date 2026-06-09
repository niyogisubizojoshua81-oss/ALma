const SUPABASE_URL = "https://ifrrnzminkpegscovxhh.supabase.co";
const SUPABASE_KEY = "sb_publish_yourspecificrandomcharactershere..."; // Replace this with your actual key

// --- 1. CONFIGURATION ---
// Fixed initialization crash by referencing the global window object explicitly
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let activeVideo = null;

// --- 2. ROUTING CONTROLLER ---
function showPage(pageId) {
    document.querySelectorAll('.page-view').forEach(p => p.classList.add('hidden'));
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) targetPage.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Completely slice out the iframe source when exiting player view to maximize performance
    if(pageId !== 'player') {
        const playerFrame = document.getElementById('main-player');
        if (playerFrame) playerFrame.src = "";
    }
}

// --- 3. FETCH & DISPLAY HOMEPAGE CONTENT ---
async function loadContentGrid() {
    const gridContainer = document.getElementById('video-grid');
    if (!gridContainer) return; // Prevents crash if running on an admin-isolated template
    
    const { data: videos, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !videos || videos.length === 0) {
        gridContainer.innerHTML = `<div class="text-gray-500 text-center col-span-full py-12">No media content found in database.</div>`;
        return;
    }

    gridContainer.innerHTML = "";
    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = "bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 cursor-pointer premium-glow transition duration-300 flex flex-col group";
        card.onclick = () => launchPlayerView(video);
        
        card.innerHTML = `
            <div class="relative aspect-video w-full bg-black overflow-hidden">
                <img src="${video.thumbnail_url}" alt="" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            </div>
            <div class="p-3.5 flex-grow flex flex-col justify-between">
                <h3 class="font-semibold text-sm line-clamp-2 text-gray-200 group-hover:text-red-400 transition mb-2">${video.title}</h3>
                <p class="text-xs text-gray-400 font-medium">${Number(video.view_count || 0).toLocaleString()} viewers watched</p>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// --- 4. SECURE PLAYER WITH HTML5 SANDBOX SHIELD ---
async function launchPlayerView(video) {
    activeVideo = video;
    showPage('player');
    
    const titleEl = document.getElementById('player-title');
    const viewsEl = document.getElementById('player-views');
    const playerFrame = document.getElementById('main-player');

    if (titleEl) titleEl.innerText = video.title;
    if (viewsEl) viewsEl.innerText = `${Number((video.view_count || 0) + 1).toLocaleString()} viewers watched`;
    
    // Inject source inside sandboxed security shield
    if (playerFrame) playerFrame.src = video.embed_url;

    // Background atomic update view counter call
    await supabase.rpc('increment_view', { video_id: video.id });
}

// --- 5. SOCIAL SHARING GENERATOR ---
const shareBtn = document.getElementById('share-btn');
if (shareBtn) {
    shareBtn.onclick = () => {
        if(!activeVideo) return;
        
        const baseAppUrl = window.location.origin + window.location.pathname;
        const textToCopy = `🔥 Watch "${activeVideo.title}" on ALma:\n${baseAppUrl}?v=${activeVideo.id}`;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = shareBtn.innerText;
            shareBtn.innerText = "Copied to Clipboard!";
            shareBtn.classList.replace('bg-red-600', 'bg-green-600');
            
            setTimeout(() => {
                shareBtn.innerText = originalText;
                shareBtn.classList.replace('bg-green-600', 'bg-red-600');
            }, 2000);
        });
    };
}

// --- 6. AUTHENTICATION & MANAGEMENT PANEL ---
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    const adminAuthEl = document.getElementById('admin-auth');
    const adminPanelEl = document.getElementById('admin-panel');

    if (session) {
        if (adminAuthEl) adminAuthEl.classList.add('hidden');
        if (adminPanelEl) adminPanelEl.classList.remove('hidden');
    } else {
        if (adminAuthEl) adminAuthEl.classList.remove('hidden');
        if (adminPanelEl) adminPanelEl.classList.add('hidden');
    }
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert(`Authentication Denied: ${error.message}`);
        } else {
            checkSession();
        }
    };
}

async function handleLogout() {
    await supabase.auth.signOut();
    checkSession();
}

// --- 7. DATA PUBLISHING INTERFACE ---
const uploadForm = document.getElementById('upload-form');
if (uploadForm) {
    uploadForm.onsubmit = async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('up-title').value;
        const thumbnail_url = document.getElementById('up-thumb').value;
        const embed_url = document.getElementById('up-embed').value;

        const { error } = await supabase.from('videos').insert([{ title, thumbnail_url, embed_url, view_count: 0 }]);

        if (error) {
            alert(`Publish Error: ${error.message}`);
        } else {
            alert('Content pushed instantly to live database catalog!');
            uploadForm.reset();
            await loadContentGrid();
            showPage('home');
        }
    };
}

// --- 8. INITIALIZE ROUTING RESOLVER ---
window.onload = async () => {
    await loadContentGrid();
    await checkSession();

    // Deep link query listener
    const urlParams = new URLSearchParams(window.location.search);
    const videoParamId = urlParams.get('v');
    if (videoParamId) {
        const { data, error } = await supabase.from('videos').select('*').eq('id', videoParamId).single();
        if (data && !error) {
            launchPlayerView(data);
        }
    }
};
