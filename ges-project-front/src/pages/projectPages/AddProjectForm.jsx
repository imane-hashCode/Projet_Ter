import React, { useState } from 'react';
import api from '../../api/axios';

const AddProjectForm = () => {
    const [formData, setFormData] = useState({
        code: '',
        title: '',
        description: '',
        number_groups: 1,
        level: 'L2',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects/', formData);
            alert('Projet ajouté avec succès !');
            setFormData({ code: '', title: '', description: '', number_groups: 1, level: 'L2' });
        } catch (error) {
            console.error('Failed to add project', error);
        }
    };

    return (
        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            <div className='flex'>
                <label>Code du projet :</label>
                <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Titre du projet :</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Description :</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Nombre de groupes :</label>
                <input
                    type="number"
                    name="number_groups"
                    value={formData.number_groups}
                    onChange={handleChange}
                    min="1"
                    required
                />
            </div>
            <div>
                <label>Niveau :</label>
                <select name="level" value={formData.level} onChange={handleChange}>
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                    <option value="M1">M1</option>
                    <option value="M2">M2</option>
                </select>
            </div>
            <button type="submit">Ajouter le projet</button>
        </form>
    );
};

export default AddProjectForm;