function LendPage() {
    const [marketData, setMarketData] = useState([]);
    const [userAccount, setUserAccount] = useState(null);

    // Ambil data pasar dan data akun pengguna
    useEffect(() => {
        apiClient.getLendMarkets().then(res => setMarketData(res.data));
        apiClient.getLendAccount().then(res => setUserAccount(res.data));
    }, []);

    const handleSupply = async (amount) => { /* ... logika supply ... */ };
    const handleBorrow = async (amount) => { /* ... logika borrow ... */ };

    return (
        <div>
            <h2>Pasar Pinjaman KaiaLink</h2>
            {/* ... Tampilkan tabel pasar ... */}

            {userAccount && (
                <div className="user-dashboard">
                    <h3>Dashboard Anda</h3>
                    <p>Total Aset Disimpan: ${userAccount.totalSupplyUSD}</p>
                    <p>Total Pinjaman: ${userAccount.totalBorrowUSD}</p>
                    <p>
                        Kekuatan Pinjaman: ${userAccount.totalBorrowingPower}
                        <span className="reputation-bonus">(Termasuk ${userAccount.reputationBonus} dari Reputasi Anda!)</span>
                    </p>
                    <p>Health Factor: {userAccount.healthFactor}</p>
                </div>
            )}
        </div>
    );
}