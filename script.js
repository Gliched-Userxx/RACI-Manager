// ===== DATA =====
const processes = [
    { name: "Develop Job Plan Template", roles: ["C", "A/R", "C", "I", "I", "—"] },
    { name: "Develop Job Plan for Specific Jobs", roles: ["C", "A", "R", "—", "I", "—"] },
    { name: "Develop Library of Info", roles: ["R", "R", "C", "A", "R", "R"] },
    { name: "Keep Prints Updated", roles: ["A", "C", "R", "I", "I", "I"] },
    { name: "Stage Kitted Parts", roles: ["C", "R", "C", "—", "A", "R"] },
    { name: "Order Parts", roles: ["—", "R", "—", "—", "I", "A"] }
];

const roles = [
    { title: "Maintenance Supervisor", desc: "Oversees maintenance operations", tasks: 5, assignments: 4 },
    { title: "Maintenance Planner", desc: "Plans maintenance activities", tasks: 8, assignments: 6 },
    { title: "Maintenance Technician", desc: "Executes field maintenance work", tasks: 4, assignments: 5 },
    { title: "Maintenance Manager", desc: "Strategic oversight of operations", tasks: 6, assignments: 3 },
    { title: "Storeroom Manager", desc: "Manages parts inventory", tasks: 4, assignments: 4 },
    { title: "Purchasing Agent", desc: "Orders and procures parts", tasks: 3, assignments: 3 }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    populateMatrix();
    populateRoles();
    populateProcesses();
    setupEventListeners();
});

// ===== POPULATE FUNCTIONS =====
function populateMatrix() {
    const matrixBody = document.getElementById('matrixBody');
    matrixBody.innerHTML = processes.map(p => `
        <tr>
            <td>${p.name}</td>
            ${p.roles.map(r => `
                <td>
                    <div class="raci-cell ${r.charAt(0)}">${r}</div>
                </td>
            `).join('')}
        </tr>
    `).join('');
}

function populateRoles() {
    const rolesGrid = document.getElementById('rolesGrid');
    rolesGrid.innerHTML = roles.map(r => `
        <div class="role-card">
            <h3>${r.title}</h3>
            <p>${r.desc}</p>
            <div class="role-stats">
                <div class="role-stat">
                    <div class="role-stat-number">${r.tasks}</div>
                    <div class="role-stat-label">Key Tasks</div>
                </div>
                <div class="role-stat">
                    <div class="role-stat-number">${r.assignments}</div>
                    <div class="role-stat-label">RACI Slots</div>
                </div>
            </div>
        </div>
    `).join('');
}

function populateProcesses() {
    const processTimeline = document.getElementById('processTimeline');
    processTimeline.innerHTML = processes.map((p, i) => `
        <div class="timeline-item">
            <div class="timeline-marker">${i + 1}</div>
            <div class="timeline-content">
                <h4>${p.name}</h4>
                <p>Key roles: ${p.roles.filter(r => r !== '—').join(', ')}</p>
            </div>
        </div>
    `).join('');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const term = this.value.toLowerCase();
            const rows = document.querySelectorAll('#raciTable tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }
}

// ===== NAVIGATION & MENU =====
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected tab
    const activeTab = document.getElementById(tabName);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Add active class to corresponding tab button
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabNames = ['overview', 'matrix', 'roles', 'processes', 'analytics', 'help'];
    const tabIndex = tabNames.indexOf(tabName);
    if (tabIndex >= 0 && tabIndex < tabButtons.length) {
        tabButtons[tabIndex].classList.add('active');
    }
    
    // Add active class to corresponding nav link
    const navLinks = document.querySelectorAll('.nav-link');
    if (tabIndex >= 0 && tabIndex < navLinks.length) {
        navLinks[tabIndex].classList.add('active');
    }
}

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('exportModal');
    if (event.target === modal) {
        modal.classList.remove('active');
    }
};

// ===== EXPORT FUNCTIONS =====
function exportToCSV() {
    let csv = "Process,Supervisor,Planner,Technician,Manager,Storeroom,Purchasing\n";
    
    processes.forEach(process => {
        csv += `"${process.name}",${process.roles.join(',')}\n`;
    });
    
    downloadFile(csv, 'maintenance_raci.csv', 'text/csv');
    closeModal('exportModal');
}

function exportToJSON() {
    const data = {
        processes: processes,
        roles: roles,
        exportedAt: new Date().toISOString()
    };
    
    downloadFile(JSON.stringify(data, null, 2), 'maintenance_raci.json', 'application/json');
    closeModal('exportModal');
}

function downloadFile(content, filename, type) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function copyToClipboard() {
    let text = "MAINTENANCE PLANNING RACI MATRIX\n";
    text += "================================\n\n";
    
    processes.forEach((process, index) => {
        text += `${index + 1}. ${process.name}\n`;
        text += `   Roles: ${process.roles.join(', ')}\n\n`;
    });
    
    text += "\nROLE DESCRIPTIONS\n";
    text += "=================\n\n";
    
    roles.forEach(role => {
        text += `${role.title}\n`;
        text += `${role.desc}\n\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✓ Copied to clipboard!');
        closeModal('exportModal');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27AE60;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== FILTER FUNCTIONS =====
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('keyup'));
    }
    
    // Show all rows
    const rows = document.querySelectorAll('#raciTable tbody tr');
    rows.forEach(row => {
        row.style.display = '';
    });
}

// ===== UTILITY FUNCTIONS =====
function getRoleDefinition(role) {
    const definitions = {
        'R': 'Responsible - Does the work',
        'A': 'Accountable - Owns outcome',
        'C': 'Consulted - Provides input',
        'I': 'Informed - Kept in loop',
        '—': 'Not involved'
    };
    return definitions[role.charAt(0)] || definitions[role];
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(event) {
    // Ctrl+P or Cmd+P to print
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        window.print();
    }
    
    // Escape to close modal
    if (event.key === 'Escape') {
        closeModal('exportModal');
        closeMenu();
    }
});

// ===== PRINT STYLES =====
window.addEventListener('beforeprint', function() {
    // Hide mobile header during print
    document.querySelector('.mobile-header').style.display = 'none';
});

window.addEventListener('afterprint', function() {
    // Show mobile header after print
    document.querySelector('.mobile-header').style.display = 'flex';
});
