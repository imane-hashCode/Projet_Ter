import random
from collections import defaultdict
from django.db import transaction
from ges_project_app.models import ProjectAssignment, Student, Project, Voeux, Team





def calculer_score(rank, note_preference, alpha=0.6, beta=0.4):
    if not (0 <= note_preference <= 20):
        raise ValueError("Le rang doit être entre 1 et 10, et la note entre 0 et 20.")
    return alpha * (13 - rank) + beta * note_preference

def affecter_projets():
    with transaction.atomic():  # Sécurise la transaction
        ProjectAssignment.objects.all().delete()  # Réinitialise les affectations

        # Stockage des scores {Projet: [(score, étudiant)]}
        scores = defaultdict(list)

        # Récupération des Voeux des étudiants
        preferences = Voeux.objects.all()
        for pref in preferences:
            score = calculer_score(pref.rank, pref.note_preference)
            scores[pref.project].append((score, pref.student))

        print(len(list(scores.values())[11]))
        # Trier les étudiants pour chaque projet par score décroissant
        for projet in scores:
            scores[projet].sort(key=lambda x: x[0], reverse=True)

        # Stocker la capacité restante de chaque équipe
        equipes_disponibles = {
            equipe: equipe.max_students for equipe in Team.objects.all()
        }

        affectations = {}  # {Étudiant: Équipe}

        # 1️⃣ Affectation aux projets prioritaires (au moins une équipe par projet prioritaire)
        for projet in Project.objects.filter(priority=True):
            equipes_projet = [equipe for equipe in equipes_disponibles if equipe.project == projet]
            if equipes_projet and projet in scores and scores[projet]:
                _, etudiant = scores[projet].pop(0)  # Prendre le meilleur étudiant
                equipe_choisie = equipes_projet[0]  # On prend la première équipe disponible
                affectations[etudiant] = equipe_choisie
                equipes_disponibles[equipe_choisie] -= 1

        # 2️⃣ Affectation générale des étudiants
        for projet, etudiants_scores in scores.items():
            equipes_projet = [equipe for equipe in equipes_disponibles if equipe.project == projet]
            if not equipes_projet:  # S'il n'y a plus d'équipe dispo pour ce projet, on passe
                continue

            while etudiants_scores:
                # Sélection des meilleurs étudiants selon la capacité
                equipe_courante = next((e for e in equipes_projet if equipes_disponibles[e] > 0), None)
                if not equipe_courante:
                    break  # Plus de place dans ce projet

                # Récupérer les meilleurs étudiants disponibles
                meilleurs_scores = etudiants_scores[:equipes_disponibles[equipe_courante]]

                # Vérifier s'il y a des égalités de score
                dernier_score = meilleurs_scores[-1][0] if meilleurs_scores else None
                candidats = [et for sc, et in meilleurs_scores if sc == dernier_score]

                # Sélection aléatoire en cas d'égalité
                etudiant_choisi = random.choice(candidats) if len(candidats) > 1 else candidats[0]

                # Affectation de l'étudiant à l'équipe
                affectations[etudiant_choisi] = equipe_courante
                equipes_disponibles[equipe_courante] -= 1

                # Supprimer l'étudiant affecté des listes restantes
                etudiants_scores = [(s, e) for s, e in etudiants_scores if e != etudiant_choisi]

        # 3 Affectation des étudiants non placés à une équipe disponible
        etudiants_non_affectes = set(Student.objects.all()) - set(affectations.keys())

        for etudiant in etudiants_non_affectes:
            equipe_disponible = next((e for e, cap in equipes_disponibles.items() if cap > 0), None)

            if equipe_disponible:
                affectations[etudiant] = equipe_disponible
                equipes_disponibles[equipe_disponible] -= 1

        # 4️⃣ Sauvegarde des affectations en base
        for etudiant, equipe in affectations.items():
            ProjectAssignment.objects.create(student=etudiant, project=equipe.project, status='pending')

        return f"Affectation terminée avec {len(affectations)} étudiants placés."
    
    
    
def calculer_satisfaction():
    affectations = Team.objects.all()
    total_score = 0
    max_possible_score = 0
    n_etudiants = affectations.count()

    for affectation in affectations:
        etudiant = affectation.etudiant
        projet = affectation.projet
        try:
            pref = Voeux.objects.get(etudiant=etudiant, projet=projet)
            score = calculer_score(pref.rank, pref.note_preference)
        except Voeux.DoesNotExist:
            score = 0  # Étudiant affecté à un projet non choisi

        total_score += score
        max_possible_score += calculer_score(1, 10)  # Score idéal

    return (total_score / max_possible_score) * 100 if max_possible_score > 0 else 0