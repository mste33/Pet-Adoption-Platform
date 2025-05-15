function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    document.getElementById('datetime').textContent = dateStr + ' | ' + timeStr;
}

updateDateTime();
setInterval(updateDateTime, 1000); 