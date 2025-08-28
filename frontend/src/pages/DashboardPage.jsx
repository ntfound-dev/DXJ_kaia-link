function DashboardPage() {
    // ... fetch profil pengguna, data referral, dll ...

    return (
        <div className="dashboard">
            <h1>Dashboard Anda</h1>
            <div className="grid-container">
                <div className="card profile-summary">
                    <h3>Profil</h3>
                    <p>Level: {userProfile.level}</p>
                    <p>Reputasi: {userProfile.reputationScore}</p>
                </div>
                <div className="card wallet-summary">
                    <h3>Dompet</h3>
                    <p>Saldo KAIA: {balance} KAIA</p>
                    {/* ... saldo USDT ... */}
                </div>
                <div className="card referral-summary">
                    <h3>Referral</h3>
                    <p>Teman Diundang: {referralData.invitedCount}</p>
                    <p>Total Pendapatan: {referralData.totalEarnings} USDT</p>
                </div>
                <div className="card ai-summary">
                    <h3>Rekomendasi AI</h3>
                    <p>Vault Pilihan: {userProfile.aiRecommendation.vaultAddress}</p>
                    <a href="/ai-invest">Lihat Detail</a>
                </div>
            </div>
        </div>
    );
}