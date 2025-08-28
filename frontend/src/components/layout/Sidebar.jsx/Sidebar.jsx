import React from 'react';
// Anggap Anda menggunakan library ikon seperti react-icons
import { FaHome, FaUserFriends, FaMagic, FaInfoCircle, FaEnvelope } from 'react-icons/fa';

function Sidebar() {
    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h2>KaiaLink</h2>
            </div>
            <ul className="menu-list">
                <li><a href="/dashboard"><FaHome /> Dashboard</a></li>
                <li><a href="/missions"><FaMagic /> Misi</a></li>
                <li><a href="/referral"><FaUserFriends /> Referral</a></li>
                <li><a href="/ai-invest"><FaMagic /> AI Invest</a></li>
                <li><a href="/messages"><FaEnvelope /> Pesan</a></li>
                <li><a href="/about"><FaInfoCircle /> Tentang</a></li>
            </ul>
        </nav>
    );
}