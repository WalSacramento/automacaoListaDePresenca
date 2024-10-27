from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from database import Base

# Modelo de Aluno
class Aluno(Base):
    __tablename__ = "alunos"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    matricula = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)

    # Relacionamento: Um aluno pode ter várias frequências
    frequencias = relationship("Frequencia", back_populates="aluno")

# Modelo de Turma
class Turma(Base):
    __tablename__ = "turmas"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    codigo = Column(String, unique=True, index=True)

    # Relacionamento: Uma turma pode ter várias frequências
    frequencias = relationship("Frequencia", back_populates="turma")

# Modelo de Frequência
class Frequencia(Base):
    __tablename__ = "frequencias"
    
    id = Column(Integer, primary_key=True, index=True)
    data = Column(String, index=True)
    presente = Column(Boolean, default=False)
    
    # Chaves estrangeiras
    aluno_id = Column(Integer, ForeignKey("alunos.id"))
    turma_id = Column(Integer, ForeignKey("turmas.id"))

    # Relacionamento: Frequência pertence a um aluno e uma turma
    aluno = relationship("Aluno", back_populates="frequencias")
    turma = relationship("Turma", back_populates="frequencias")
