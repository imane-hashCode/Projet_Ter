import React from 'react';
import { Link } from 'react-router-dom';

const StudentNavBar = () => {
    return (
        <nav>
            <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
                <li>
                    <Link to="/add-project">Ajouter un projets</Link>
                </li>
                {/* <li>
                    <Link to="/voeux">Exprimer mes vœux</Link>
                </li> */}
            </ul>
        </nav>
    );
};

export default StudentNavBar;