import random
from collections import defaultdict
from django.db import transaction
from ges_project_app.models import Student, Project, Team, Voeux, ProjectAssignment

def calculer_score(rank, note, total_projects):
    
    return (total_projects - rank + 1) + note

def affectation_projet(level):
    with transaction.atomic():
        # Supprimer uniquement les affectations du niveau concerné
        ProjectAssignment.objects.filter(
            student__level=level,
            project__level=level
        ).delete()

        # 1. Préparer les préférences des étudiants du niveau donné
        voeux = Voeux.objects.select_related("student", "project").filter(
            student__level=level,
            project__level=level
        )
        voeux_par_etudiant = defaultdict(list)
        
        total_projects = Project.objects.filter(level=level).count()

        for v in voeux:
            score = calculer_score(v.rank, v.note_preference, total_projects)
            
            voeux_par_etudiant[v.student].append((v.project, v.rank, score))

        for student in voeux_par_etudiant:
            voeux_par_etudiant[student].sort(key=lambda x: x[1])  # Tri des vœux

        # 2. Préparer les équipes et capacités pour le niveau
        equipes_disponibles = {
            equipe: [] for equipe in Team.objects.select_related("project").filter(project__level=level)
        }
        capacites = {equipe: equipe.max_students for equipe in equipes_disponibles}

        # 3. Regrouper les équipes par projet
        equipes_par_projet = defaultdict(list)
        for equipe in equipes_disponibles:
            equipes_par_projet[equipe.project].append(equipe)

        # 4. Liste des étudiants à affecter
        etudiants_libres = set(voeux_par_etudiant.keys())
        affectations = {}

        # 5. Algorithme de Gale-Shapley
        while etudiants_libres:
            etudiant = etudiants_libres.pop()

            if not voeux_par_etudiant[etudiant]:
                continue

            projet, _, score = voeux_par_etudiant[etudiant].pop(0)

            # Récupérer les équipes du projet qui ont de la place
            equipes_possibles = [e for e in equipes_par_projet[projet]
            if capacites[e] > 0 or etudiant in [s for s, _ in equipes_disponibles[e]]]

            if not equipes_possibles:
                continue

            equipe = random.choice(equipes_possibles)
            equipes_disponibles[equipe].append((etudiant, score))
            equipes_disponibles[equipe].sort(key=lambda x: x[1], reverse=True)

            if len(equipes_disponibles[equipe]) > capacites[equipe]:
                removed_student, _ = equipes_disponibles[equipe].pop()
                if removed_student != etudiant:
                    etudiants_libres.add(removed_student)
                    etudiants_libres.add(etudiant)
                else:
                    etudiants_libres.add(etudiant)
            else:
                affectations[etudiant] = equipe

        # 6. Sauvegarde en base
        for equipe, etudiants_scores in equipes_disponibles.items():
            for etudiant, _ in etudiants_scores:
                ProjectAssignment.objects.create(
                    student=etudiant,
                    project=equipe.project,
                    status='pending'
                )
                
        satisfaction_pourcentage = calculer_satisfaction(level)

        return {
            "message": f"Affectation (niveau {level}) terminée : {len(affectations)} étudiants affectés.",
            "assignments_count": len(affectations),
            "satisfaction (%)": round(satisfaction_pourcentage, 2)
        }
        
        
def calculer_satisfaction(level):
    affectations = ProjectAssignment.objects.filter(project__level=level)
    
    if not affectations.exists():
        return 0 
    
    voeux = Voeux.objects.filter(student__level=level, project__level=level)
    pref_dict = {(v.student_id, v.project_id): v for v in voeux}
    
    total_score = 0
    max_possible_score = 0
    n_etudiants = affectations.count()
    total_projects = Project.objects.filter(level=level).count()

    for affectation in affectations:
        etudiant = affectation.student
        projet = affectation.project

        if (etudiant.id, projet.id) in pref_dict:
            pref = pref_dict[(etudiant.id, projet.id)]
            score = calculer_score(pref.rank, pref.note_preference, total_projects)
        else:
            score = 0  # Projet non choisi

        total_score += score
        max_possible_score += calculer_score(1, 20, total_projects)  # Score idéal

    score_satisfaction = (total_score / max_possible_score) * 100 if max_possible_score > 0 else 0
    return score_satisfaction
