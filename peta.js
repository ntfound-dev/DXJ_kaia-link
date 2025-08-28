<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diagram Arsitektur KaiaLink</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
        }
        .component-box {
            transition: all 0.3s ease;
            min-height: 160px;
        }
        .component-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .arrow {
            position: absolute;
            background-color: #6b7280;
            width: 2px;
            height: 40px;
        }
        .arrow.down::after {
            content: '';
            position: absolute;
            left: -5px;
            bottom: -2px;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid #6b7280;
        }
         .arrow.right {
            width: 50px;
            height: 2px;
        }
        .arrow.right::after {
            content: '';
            position: absolute;
            top: -5px;
            right: -2px;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            border-left: 8px solid #6b7280;
        }
    </style>
</head>
<body class="p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-4">Diagram Arsitektur Strategis KaiaLink</h1>
        <p class="text-center text-gray-600 mb-12">Visualisasi interaktif alur kerja dan komponen sistem.</p>
        
        <div id="architecture-diagram" class="relative flex flex-col items-center space-y-12">
            <!-- Diagram akan dirender di sini oleh JavaScript -->
        </div>
    </div>

    <script>
        // Data untuk komponen diagram
        const components = [
            { id: 'user', title: 'Pengguna di Aplikasi LINE', description: 'Interaksi via LIFF SDK', col: 2, row: 1 },
            { id: 'frontend', title: 'Frontend (React Mini dApp)', description: 'Manajemen UI/UX, State Klien, Interaksi Dompet & LIFF', col: 2, row: 2 },
            { id: 'backend', title: 'Backend (Node.js API)', description: 'API Gateway, Logika Bisnis, Otoritas Signer (EIP-712), CRON Jobs', col: 1, row: 3 },
            { id: 'database', title: 'Database (MongoDB)', description: 'Profil Pengguna & Misi, Cache Skor Reputasi', col: 3, row: 3 },
            { id: 'blockchain', title: 'Blockchain Kaia', description: 'Smart Contracts: KaiaLinkProfile (SBT), MissionReward, DeFi (Lend/Swap)', col: 1, row: 4 },
            { id: 'external', title: 'Layanan Eksternal', description: 'Kaia Node RPC, TheGraph, API Platform LINE', col: 3, row: 4 }
        ];

        // Data untuk koneksi antar komponen
        const connections = [
            { from: 'user', to: 'frontend', type: 'vertical', label: '' },
            { from: 'frontend', to: 'backend', type: 'diagonal', label: 'REST API Calls' },
            { from: 'backend', to: 'database', type: 'horizontal', label: '' },
            { from: 'backend', to: 'blockchain', type: 'vertical', label: 'RPC Calls & Tx Submission' },
            { from: 'blockchain', to: 'external', type: 'horizontal', label: '' }
        ];

        const diagramContainer = document.getElementById('architecture-diagram');

        // Fungsi untuk membuat elemen komponen
        function createComponentElement(component) {
            const descriptions = component.description.split(', ').map(d => `<li>${d.trim()}</li>`).join('');
            return `
                <div id="${component.id}" class="component-box bg-white p-4 rounded-lg shadow-md border border-gray-200 w-64" style="grid-column: ${component.col}; grid-row: ${component.row};">
                    <h3 class="text-lg font-semibold text-gray-900">${component.title}</h3>
                    <ul class="mt-2 text-sm text-gray-600 list-disc list-inside">
                        ${descriptions}
                    </ul>
                </div>
            `;
        }
        
        // Render semua komponen dalam grid layout
        function renderComponents() {
            const gridWrapper = document.createElement('div');
            gridWrapper.className = 'grid grid-cols-3 gap-x-16 gap-y-12 items-start';
            gridWrapper.style.minHeight = '800px';
            
            // Menempatkan komponen user di tengah
            const userComp = components.find(c => c.id === 'user');
            const userEl = createComponentElement(userComp);
            const userWrapper = document.createElement('div');
            userWrapper.style.gridColumn = '1 / span 3';
            userWrapper.className = 'flex justify-center';
            userWrapper.innerHTML = userEl;
            gridWrapper.appendChild(userWrapper);

            // Menempatkan komponen frontend di tengah
            const frontendComp = components.find(c => c.id === 'frontend');
            const frontendEl = createComponentElement(frontendComp);
            const frontendWrapper = document.createElement('div');
            frontendWrapper.style.gridColumn = '1 / span 3';
            frontendWrapper.className = 'flex justify-center';
            frontendWrapper.innerHTML = frontendEl;
            gridWrapper.appendChild(frontendWrapper);
            
            // Render komponen lainnya
            components
                .filter(c => c.id !== 'user' && c.id !== 'frontend')
                .forEach(c => {
                    gridWrapper.innerHTML += createComponentElement(c);
                });
            
            diagramContainer.appendChild(gridWrapper);
        }

        // Fungsi untuk menggambar garis koneksi
        // Catatan: Implementasi garis di HTML/CSS/JS bisa sangat kompleks.
        // Untuk kesederhanaan, kita akan menggunakan panah sederhana yang diposisikan secara manual.
        // Dalam aplikasi nyata, library seperti jsPlumb atau D3.js akan lebih cocok.
        function renderConnections() {
             // Koneksi dari Pengguna ke Frontend
            const user = document.getElementById('user');
            const frontend = document.getElementById('frontend');
            drawArrow(user, frontend, 'down', 'Interaksi via LIFF SDK');
            
            // Koneksi dari Frontend ke Backend
            drawArrow(frontend, document.getElementById('backend'), 'down', 'REST API Calls');
            
            // Koneksi dari Backend ke Database
            drawArrow(document.getElementById('backend'), document.getElementById('database'), 'right', '');

            // Koneksi dari Backend ke Blockchain
            drawArrow(document.getElementById('backend'), document.getElementById('blockchain'), 'down', 'RPC Calls & Tx Submission');

            // Koneksi dari Blockchain ke Layanan Eksternal
            drawArrow(document.getElementById('blockchain'), document.getElementById('external'), 'right', '');
        }

        function drawArrow(el1, el2, direction, label) {
            const containerRect = diagramContainer.getBoundingClientRect();
            const rect1 = el1.getBoundingClientRect();
            const rect2 = el2.getBoundingClientRect();

            const arrow = document.createElement('div');
            arrow.className = `absolute arrow ${direction} z-[-1]`;
            
            const labelEl = document.createElement('span');
            labelEl.className = 'absolute text-xs text-gray-500 bg-gray-100 px-1 rounded';
            labelEl.innerText = label;

            if (direction === 'down') {
                const startX = rect1.left + rect1.width / 2 - containerRect.left;
                const startY = rect1.bottom - containerRect.top;
                const endY = rect2.top - containerRect.top;
                arrow.style.left = `${startX - 1}px`;
                arrow.style.top = `${startY}px`;
                arrow.style.height = `${endY - startY}px`;
                labelEl.style.left = `${startX + 5}px`;
                labelEl.style.top = `${startY + (endY - startY) / 2 - 10}px`;
            } else if (direction === 'right') {
                const startX = rect1.right - containerRect.left;
                const startY = rect1.top + rect1.height / 2 - containerRect.top;
                const endX = rect2.left - containerRect.left;
                arrow.style.top = `${startY - 1}px`;
                arrow.style.left = `${startX}px`;
                arrow.style.width = `${endX - startX}px`;
                labelEl.style.top = `${startY - 20}px`;
                labelEl.style.left = `${startX + (endX - startX) / 2 - 20}px`;
            }
            diagramContainer.appendChild(arrow);
            if(label) diagramContainer.appendChild(labelEl);
        }


        // Render diagram saat halaman dimuat
        window.addEventListener('load', () => {
            renderComponents();
            // Menunggu sedikit agar posisi elemen stabil sebelum menggambar garis
            setTimeout(renderConnections, 100);
        });
        
        // Gambar ulang garis saat ukuran window berubah
        window.addEventListener('resize', () => {
            document.querySelectorAll('.arrow, .absolute.text-xs').forEach(el => el.remove());
            renderConnections();
        });

    </script>
</body>
</html>