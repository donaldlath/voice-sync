// 6. HistoryList.jsx - Historique local des enregistrements (bonus)
import React from 'react';

const HistoryList = ({ history }) => (
  <div className="card p-3 mb-3">
    <h4>📁 Historique</h4>
    <ul className="list-group">
      {history.map((item, i) => (
        <li key={i} className="list-group-item">
          <audio controls src={item} className="w-100" />
        </li>
      ))}
    </ul>
  </div>
);

export default HistoryList;