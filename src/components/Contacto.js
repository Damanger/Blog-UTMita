import React, { useState } from "react";
import '../css/Contacto.css';

export default function Contacto() {
    const [fileName, setFileName] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [carrera, setCarrera] = useState("");

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
                <select value={carrera} onChange={(e) => setCarrera(e.target.value)}>
                    <option value="" disabled defaultValue>Seleccione su carrera</option>
                    <option value="Ing. Computación">Ing. Computación</option>
                    <option value="Ing. Alimentos">Ing. Alimentos</option>
                    <option value="Ing. Electrónica">Ing. Electrónica</option>
                    <option value="Ing. Mecatrónica">Ing. Mecatrónica</option>
                    <option value="Ing. Industrial">Ing. Industrial</option>
                    <option value="Ing. Física Aplicada">Ing. Física Aplicada</option>
                    <option value="Ing. Mecánica Automotiz">Ing. Mecánica Automotriz</option>
                    <option value="Ing. Civil">Ing. Civil</option>
                    <option value="Lic. Ciencias Empresariales">Lic. Ciencias Empresariales</option>
                    <option value="Lic. Matemáticas Aplicadas">Lic. Matemáticas Aplicadas</option>
                </select>
                <input type="number" placeholder="Teléfono" />
                <input type="email" placeholder="Correo" />
                <label htmlFor="file-upload" style={{color:'black'}}>Credencial UTM:</label>
                <input type="file" id="file-upload" accept="image/*" onChange={updateFileName} />
                {imagePreview && <img src={imagePreview} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} />}
                <span>{fileName ? `Credencial UTM: ${fileName}` : "Seleccione un archivo"}</span>
                <textarea placeholder="Materias o cursos que puedo impartir"></textarea>
                <button>Enviar</button>
            </form>
        </div>
    )
}
