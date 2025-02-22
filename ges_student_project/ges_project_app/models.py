from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    role = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Project(models.Model):
    code = models.CharField(max_length=10)
    title = models.CharField(max_length=255)
    description = models.TextField()
    number_groups = models.IntegerField()
    supervisor = models.ForeignKey(Supervisor, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Voeux(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    rank = models.IntegerField()
    note_preference = models.IntegerField()

class Team(models.Model):
    name = models.CharField(max_length=255)
    min_students = models.IntegerField()
    max_students = models.IntegerField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

class StudentsTeams(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

class Conflit(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    description = models.TextField()
    statut = models.CharField(max_length=50)

class Assignment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    assignment_date = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=50)

class UpdateAssignment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    raison = models.TextField()
    statut = models.CharField(max_length=50)

class ProjectsConflits(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    conflit = models.ForeignKey(Conflit, on_delete=models.CASCADE)

