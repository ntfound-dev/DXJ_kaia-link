function MessagesPage() {
    // ... fetch notifikasi dari backend ...
    const notifications = [
        { id: 1, text: "Selamat! Hadiah misi 'Check-in Harian' telah diklaim.", time: "2 jam lalu" },
        { id: 2, text: "Skor Reputasi Anda naik menjadi 1500!", time: "1 hari lalu" }
    ];

    return (
        <div>
            <h2>Pusat Pesan</h2>
            <ul className="notification-list">
                {notifications.map(notif => (
                    <li key={notif.id}>{notif.text} <span>({notif.time})</span></li>
                ))}
            </ul>
        </div>
    );
}