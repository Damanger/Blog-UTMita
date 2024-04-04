import React, { useState } from "react";
import '../css/Contacto.css';

export default function Contacto() {
    const [fileName, setFileName] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    function updateFileName(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const fileName = file.name;
            setFileName(fileName);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, seleccione un archivo de imagen.");
            event.target.value = "";
            setFileName("");
            setImagePreview(null);
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}>
            <form className="form">
                <div className="title">Contáctanos</div>
                <input type="text" placeholder="Nombre completo" />
                <input type="text" placeholder="Carrera" />
                <input type="number" placeholder="Teléfono" />
                <input type="email" placeholder="Correo" />
                <label htmlFor="file-upload" style={{color:'gray'}}>Credencial UTM</label>
                <input type="file" id="file-upload" accept="image/*" onChange={updateFileName} />
                {imagePreview && <img src={imagePreview} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} />}
                <span>{fileName ? `Credencial UTM: ${fileName}` : "Seleccione un archivo"}</span>
                <textarea placeholder="Materias o cursos que puedo impartir"></textarea>
                <button>Enviar</button>
            </form>
        </div>
    )
}
