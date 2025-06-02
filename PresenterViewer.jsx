/*
// 3. PresenterViewer.jsx - Affichage d'un présentateur
import React from 'react';

const PresenterViewer = () => (
  <div className="card p-3 mb-3 text-center">
    <h4>👤 Présentateur</h4>
    <img src="/presenter.png" alt="Présentateur" className="img-fluid rounded" style={{ maxWidth: '200px' }} />
  </div>
);


export default PresenterViewer;
*/
import React, { useState } from 'react';

function PresenterUploader() {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="card p-3 mb-4 text-center">
      <h5 className="mb-3">🖼️ Choisir l’image du présentateur</h5>

      <input
        type="file"
        accept="image/*"
        className="form-control mb-3"
        onChange={handleImageChange}
      />

      {image && (
        <div>
          <img
            src={image}
            alt="Aperçu"
            className="img-fluid rounded"
            style={{ maxWidth: '200px' }}
          />
          <p className="mt-2">Aperçu de l’image choisie</p>
        </div>
      )}
    </div>
  );
}

export default PresenterUploader;
