import React from 'react';

/**
 * Komponen untuk menampilkan satu kartu misi.
 * @param {{
 * mission: { id: string, title: string, description: string, reward: number },
 * onClaim: (missionId: string) => void,
 * isLoading: boolean,
 * isCompleted: boolean
 * }} props
 */
function MissionCard({ mission, onClaim, isLoading, isCompleted }) {
    return (
        <div className={`mission-card ${isCompleted ? 'completed' : ''}`}>
            <div className="mission-details">
                <h3 className="mission-title">{mission.title}</h3>
                <p className="mission-description">{mission.description}</p>
            </div>
            <div className="mission-action">
                <p className="mission-reward">Hadiah: {mission.reward} USDT</p>
                <button 
                    className="claim-button"
                    onClick={() => onClaim(mission.id)}
                    disabled={isLoading || isCompleted}
                >
                    {isLoading ? 'Memproses...' : (isCompleted ? 'Selesai' : 'Klaim Hadiah')}
                </button>
            </div>
        </div>
    );
}

export default MissionCard;