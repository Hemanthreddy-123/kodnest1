// Leaderboard Logic

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('leaderboard-body');
    const noScoresMsg = document.getElementById('no-scores');
    const clearBtn = document.getElementById('clear-scores');

    function loadLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('neonGridLeaderboard')) || [];

        tableBody.innerHTML = '';

        if (scores.length === 0) {
            noScoresMsg.style.display = 'block';
            return;
        } else {
            noScoresMsg.style.display = 'none';
        }

        scores.forEach((entry, index) => {
            const row = document.createElement('tr');

            // Add medal icons for top 3
            let rankDisplay = index + 1;
            if (index === 0) rankDisplay = '🥇';
            if (index === 1) rankDisplay = '🥈';
            if (index === 2) rankDisplay = '🥉';

            row.innerHTML = `
                <td style="font-weight: bold; color: ${index < 3 ? 'var(--accent-color)' : '#fff'}">${rankDisplay}</td>
                <td>${escapeHtml(entry.name)}</td>
                <td style="color: var(--primary-color); text-shadow: 0 0 5px var(--primary-color);">${entry.score}</td>
                <td style="font-size: 0.9rem; color: #aaa;">${entry.date}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Security: Escape HTML to prevent XSS
    function escapeHtml(text) {
        if (!text) return text;
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all scores?')) {
            localStorage.removeItem('neonGridLeaderboard');
            loadLeaderboard();
        }
    });

    loadLeaderboard();
});
