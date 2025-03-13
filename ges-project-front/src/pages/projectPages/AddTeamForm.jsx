import React, { useState } from 'react';
import api from '../../api/axios';

const AddTeamForm = ({ projects }) => {
    const [formData, setFormData] = useState({
        name: '',
        min_students: 1,
        max_students: 1,
        project: projects[0]?.id || '',  // Sélectionner le premier projet par défaut
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/teams/', formData);
            alert('Équipe ajoutée avec succès !');
            setFormData({ name: '', min_students: 1, max_students: 1, project: projects[0]?.id || '' });  // Réinitialiser le formulaire
        } catch (error) {
            console.error('Failed to add team', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nom de l'équipe :</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Nombre minimum d'étudiants :</label>
                <input
                    type="number"
                    name="min_students"
                    value={formData.min_students}
                    onChange={handleChange}
                    min="1"
                    required
                />
            </div>
            <div>
                <label>Nombre maximum d'étudiants :</label>
                <input
                    type="number"
                    name="max_students"
                    value={formData.max_students}
                    onChange={handleChange}
                    min="1"
                    required
                />
            </div>
            <div>
                <label>Projet :</label>
                <select name="project" value={formData.project} onChange={handleChange}>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.title}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Ajouter l'équipe</button>
        </form>
    );
};

export default AddTeamForm;