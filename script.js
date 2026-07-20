document.addEventListener('DOMContentLoaded', () => {
    const clock = document.getElementById('clock');
    const greeting = document.getElementById('greeting');
    const centerContainer = document.getElementById('center-links-container');
    const leftContainer = document.getElementById('left-links-container');
    const rightContainer = document.getElementById('right-links-container');
    const linksEditorList = document.getElementById('links-editor-list');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsModal = document.getElementById('settings-modal');
    const btnClose = document.getElementById('btn-close');
    const btnExport = document.getElementById('btn-export');
    const btnImport = document.getElementById('btn-import');
    const btnReset = document.getElementById('btn-reset');
    const importFile = document.getElementById('import-file');
    const usernameInput = document.getElementById('username-input');
    const bgImgInput = document.getElementById('bg-img-input');
    const bgBlurInput = document.getElementById('bg-blur-input');
    const blurValueDisplay = document.getElementById('blur-value');
    const editLinkIndex = document.getElementById('edit-link-index');
    const linkNameInput = document.getElementById('link-name-input');
    const linkUrlInput = document.getElementById('link-url-input');
    const linkSvgInput = document.getElementById('link-svg-input');
    const linkZoneSelect = document.getElementById('link-zone-select');
    const btnAddLink = document.getElementById('btn-add-link');
    const colorBg = document.getElementById('color-bg');
    const colorSurface = document.getElementById('color-surface');
    const colorText = document.getElementById('color-text');
    const colorAccent = document.getElementById('color-accent');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const presetSelect = document.getElementById('preset-select');
    const presetWrapper = document.getElementById('preset-selector-wrapper');

    const defaultSvgInner = `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>`;

    const defaultSettings = {
        username: '',
        bgImage: '',
        bgBlur: 0,
        colors: {
            background: '#24273a',
            surface: '#363a4f',
            text: '#cad3f5',
            accent: '#9a87ed'
        },
        links: {
            center: [
                { name: 'Github', url: 'https://github.com', svg: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>' },
                { name: 'YouTube', url: 'https://youtube.com', svg: '<path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z"/><path d="M7 21h10"/><rect width="20" height="14" x="2" y="3" rx="2"/>' },
                { name: 'Telegram', url: 'https://web.telegram.org', svg: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>' },
                { name: 'Gmail', url: 'https://mail.google.com', svg: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>' }
            ],
            left: [
                { name: 'Twitch', url: 'https://twitch.tv', svg: '<path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z"/><path d="M7 21h10"/><rect width="20" height="14" x="2" y="3" rx="2"/>' }
            ],
            right: [
                { name: 'Docker Hub', url: 'https://hub.docker.com', svg: '<path d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z"/><path d="M10 21.9V14L2.1 9.1"/><path d="m10 14 11.9-6.9"/><path d="M14 19.8v-8.1"/><path d="M18 17.5V9.4"/></svg>' }
            ]
        }
    };

    let userSettings = JSON.parse(localStorage.getItem('tab_settings')) || JSON.parse(JSON.stringify(defaultSettings));

    if (!userSettings.links) userSettings.links = JSON.parse(JSON.stringify(defaultSettings.links));
    if (userSettings.bgImage === undefined) userSettings.bgImage = '';
    if (userSettings.bgBlur === undefined) userSettings.bgBlur = 0;

    let loadedPresets = [];

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    async function loadPresetsFile() {
        try {
            const response = await fetch('presets.json');
            if (!response.ok) return; 
            const presets = await response.json();
            
            if (Array.isArray(presets) && presets.length > 0) {
                loadedPresets = presets;
                presetWrapper.style.display = 'flex';
                presetSelect.innerHTML = '<option value="">-- Выберите пресет --</option>';
                presets.forEach((preset, index) => {
                    const opt = document.createElement('option');
                    opt.value = index;
                    opt.textContent = preset.name;
                    presetSelect.appendChild(opt);
                });
            }
        } catch (e) {
            console.log("Локальный файл пресетов пуст или отсутствует. Используются базовые настройки.");
        }
    }

    presetSelect.addEventListener('change', (e) => {
        const selectedIdx = e.target.value;
        if (selectedIdx === "") return;

        const preset = loadedPresets[selectedIdx];
        if (preset) {
            userSettings.colors.background = preset.background;
            userSettings.colors.surface = preset.surface;
            userSettings.colors.text = preset.text;
            userSettings.colors.accent = preset.accent;
            
            saveSettings();
            applySettings();
        }
    });

    function buildSvgMarkup(customSvgSource) {
        const raw = customSvgSource ? customSvgSource.trim() : '';
        if (!raw) {
            return `<svg viewBox="0 0 24 24">${defaultSvgInner}</svg>`;
        }
        if (raw.toLowerCase().startsWith('<svg')) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(raw, 'image/svg+xml');
            const svgEl = doc.querySelector('svg');
            if (svgEl) {
                const viewBox = svgEl.getAttribute('viewBox') || '0 0 24 24';
                return `<svg viewBox="${viewBox}">${svgEl.innerHTML}</svg>`;
            }
        }
        return `<svg viewBox="0 0 24 24">${raw}</svg>`;
    }

    function renderDashboardLinks() {
        centerContainer.innerHTML = '';
        leftContainer.innerHTML = '';
        rightContainer.innerHTML = '';

        userSettings.links.center.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.innerHTML = `${buildSvgMarkup(link.svg)} ${link.name}`;
            centerContainer.appendChild(a);
        });

        userSettings.links.left.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.innerHTML = `${buildSvgMarkup(link.svg)} <span>${link.name}</span>`;
            leftContainer.appendChild(a);
        });

        userSettings.links.right.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.innerHTML = `${buildSvgMarkup(link.svg)} <span>${link.name}</span>`;
            rightContainer.appendChild(a);
        });
    }

    function resetLinkForm() {
        editLinkIndex.value = "-1";
        linkNameInput.value = '';
        linkUrlInput.value = '';
        linkSvgInput.value = '';
        btnAddLink.textContent = "Сохранить ссылку";
        btnAddLink.classList.remove('primary-btn');
    }

    function renderSettingsLinksEditor() {
        linksEditorList.innerHTML = '';
        const zone = linkZoneSelect.value;
        
        userSettings.links[zone].forEach((link, index) => {
            const item = document.createElement('div');
            item.className = 'link-editor-item';
            
            item.innerHTML = `
                <div class="link-info">
                    ${buildSvgMarkup(link.svg)}
                    <div class="link-details">
                        <span class="l-name">${link.name}</span>
                        <span class="l-url">${link.url}</span>
                    </div>
                </div>
                <div class="link-item-actions">
                    <button class="btn-edit-link" data-index="${index}" title="Редактировать">✎</button>
                    <button class="btn-delete-link" data-index="${index}" title="Удалить">✕</button>
                </div>
            `;
            linksEditorList.appendChild(item);
        });

        document.querySelectorAll('.btn-delete-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                userSettings.links[zone].splice(idx, 1);
                saveSettings();
                renderDashboardLinks();
                renderSettingsLinksEditor();
                resetLinkForm();
            });
        });

        document.querySelectorAll('.btn-edit-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'), 10);
                const currentLink = userSettings.links[zone][idx];
                
                editLinkIndex.value = idx;
                linkNameInput.value = currentLink.name;
                linkUrlInput.value = currentLink.url;
                linkSvgInput.value = currentLink.svg || '';
                
                btnAddLink.textContent = "Обновить изменения";
                btnAddLink.classList.add('primary-btn');
                linkNameInput.focus();
            });
        });
    }

    function applySettings() {
        const root = document.documentElement;
        
        root.style.setProperty('--background', userSettings.colors.background);
        root.style.setProperty('--surface', userSettings.colors.surface);
        root.style.setProperty('--text', userSettings.colors.text);
        root.style.setProperty('--accent', userSettings.colors.accent);
        
        usernameInput.value = userSettings.username;
        bgImgInput.value = userSettings.bgImage || '';
        bgBlurInput.value = userSettings.bgBlur;
        blurValueDisplay.textContent = `${userSettings.bgBlur}px`;
        
        if (userSettings.bgImage.trim()) {
            document.body.style.backgroundImage = `url('${userSettings.bgImage.trim()}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backdropFilter = `blur(${userSettings.bgBlur}px)`;
            document.body.style.filter = `blur(0px)`; 
        } else {
            document.body.style.backgroundImage = 'none';
            document.body.style.backdropFilter = 'none';
        }
        colorBg.value = userSettings.colors.background;
        colorSurface.value = userSettings.colors.surface;
        colorText.value = userSettings.colors.text;
        colorAccent.value = userSettings.colors.accent;

        setGreeting();
        renderDashboardLinks();
    }

    function saveSettings() {
        localStorage.setItem('tab_settings', JSON.stringify(userSettings));
    }

    function updateClock() {
        const d = new Date();
        clock.textContent =
            String(d.getHours()).padStart(2, '0') + ':' +
            String(d.getMinutes()).padStart(2, '0') + ':' +
            String(d.getSeconds()).padStart(2, '0');
    }

    function setGreeting() {
        const h = new Date().getHours();
        const name = userSettings.username.trim();
        const nameSuffix = name ? ` ${name}` : '';
        let greetStr = '';

        if (h < 5) greetStr = `Доброй ночи${nameSuffix}`;
        else if (h < 12) greetStr = `Доброе утро${nameSuffix}`;
        else if (h < 18) greetStr = `Добрый день${nameSuffix}`;
        else greetStr = `Добрый вечер${nameSuffix}`;

        greeting.textContent = greetStr;
    }

    linkZoneSelect.addEventListener('change', () => {
        resetLinkForm();
        renderSettingsLinksEditor();
    });

    btnAddLink.addEventListener('click', () => {
        const name = linkNameInput.value.trim();
        const url = linkUrlInput.value.trim();
        const svg = linkSvgInput.value.trim();
        const zone = linkZoneSelect.value;
        const idx = parseInt(editLinkIndex.value, 10);

        if (!name || !url) {
            alert('Пожалуйста, заполните как минимум Название и URL ссылки.');
            return;
        }

        if (idx === -1) {
            userSettings.links[zone].push({ name, url, svg });
        } else {
            userSettings.links[zone][idx] = { name, url, svg };
        }

        saveSettings();
        resetLinkForm();
        renderDashboardLinks();
        renderSettingsLinksEditor();
    });

    settingsToggle.addEventListener('click', () => {
        settingsModal.classList.add('open');
        tabButtons[0].click();
        resetLinkForm();
        renderSettingsLinksEditor();
    });
    
    btnClose.addEventListener('click', () => settingsModal.classList.remove('open'));
    
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.remove('open');
    });

    usernameInput.addEventListener('input', (e) => {
        userSettings.username = e.target.value;
        saveSettings();
        setGreeting();
    });

    bgImgInput.addEventListener('input', (e) => {
        userSettings.bgImage = e.target.value;
        saveSettings();
        applySettings();
    });

    bgBlurInput.addEventListener('input', (e) => {
        userSettings.bgBlur = parseInt(e.target.value, 10);
        blurValueDisplay.textContent = `${userSettings.bgBlur}px`;
        saveSettings();
        if (userSettings.bgImage.trim()) {
            document.body.style.backdropFilter = `blur(${userSettings.bgBlur}px)`;
        }
    });

    const handleColorChange = (key, e) => {
        userSettings.colors[key] = e.target.value;
        presetSelect.value = "";
        saveSettings();
        applySettings();
    };

    colorBg.addEventListener('input', (e) => handleColorChange('background', e));
    colorSurface.addEventListener('input', (e) => handleColorChange('surface', e));
    colorText.addEventListener('input', (e) => handleColorChange('text', e));
    colorAccent.addEventListener('input', (e) => handleColorChange('accent', e));

    btnReset.addEventListener('click', () => {
        if (confirm('Сбросить все настройки по умолчанию (включая ссылки)?')) {
            userSettings = JSON.parse(JSON.stringify(defaultSettings));
            saveSettings();
            applySettings();
            resetLinkForm();
            renderSettingsLinksEditor();
            presetSelect.value = "";
            settingsModal.classList.remove('open');
        }
    });

    btnExport.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userSettings, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "tab_config.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    btnImport.addEventListener('click', () => importFile.click());
    
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed.colors && parsed.links) {
                    userSettings = parsed;
                    if (userSettings.bgBlur === undefined) userSettings.bgBlur = 0;
                    saveSettings();
                    applySettings();
                    resetLinkForm();
                    presetSelect.value = "";
                    alert('Настройки и ссылки успешно импортированы!');
                    settingsModal.classList.remove('open');
                } else {
                    alert('Неверный формат файла конфигурации.');
                }
            } catch (err) {
                alert('Ошибка при чтении файла настроек.');
            }
        };
        reader.readAsText(file);
    });

    setInterval(updateClock, 500);
    updateClock();
    applySettings();
    loadPresetsFile();
});