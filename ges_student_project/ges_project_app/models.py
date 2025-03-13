from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


#Définition des rôles des utilisateurs
ROLE_CHOICES = [
    ('student', 'Étudiant'),
    ('supervisor', 'Encadrant'),
    ('admin', 'Administrateur'),
]

STATUS_CHOICES = [
    ('pending', 'En attente'),
    ('approved', 'Approuvé'),
    ('rejected', 'Rejeté'),
]

LEVEL_CHOICES = [
    ('L2', 'Licence 2'),
    ('L3', 'Licence 3'),
    ('M1', 'Master 1'),
    ('M2', 'Master 2'),
]

class User(AbstractUser):
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student")
    level = models.CharField(max_length=5, choices=LEVEL_CHOICES, default='null')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} ({self.level})"

# class Supervisor(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)

class Project(models.Model):
    code = models.CharField(max_length=10, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    number_groups = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    supervisor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project')
    level = models.CharField(max_length=5, choices=LEVEL_CHOICES, default='null')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.code} - {self.title} ({self.level})"

class Voeux(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="voeux")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="voeux")
    rank = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    note_preference = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    
    class Meta:
        unique_together = ('student', 'project')  # Un étudiant ne peut noter un projet qu'une seule fois
        ordering = ['student', 'rank']
        
    def __str__(self):
        return f"{self.student} -> {self.project} (Rank: {self.rank}, Note: {self.note_preference})"

class Team(models.Model):
    name = models.CharField(max_length=255)
    min_students = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    max_students = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="teams")
    
    def __str__(self):
        return f"Team {self.name} ({self.project})"


class StudentsTeams(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE,related_name="teams")
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="members")

    def __str__(self):
        return f"{self.student} in {self.team}"
    
class Conflit(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="conflits")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="conflits")
    description = models.TextField()
    statut = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Conflit: {self.student} vs {self.project} ({self.statut})"


class Assignment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="assignments")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="assignments")
    assignment_date = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Assignment: {self.student} -> {self.project} ({self.statut})"

class UpdateAssignment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="updates")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="updates")
    raison = models.TextField()
    statut = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Update: {self.student} -> {self.project} ({self.statut})"

class ProjectsConflits(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    conflit = models.ForeignKey(Conflit, on_delete=models.CASCADE)

