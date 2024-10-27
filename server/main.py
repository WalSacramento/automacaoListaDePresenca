from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Aluno, Turma, Frequencia
from typing import List
from pydantic import BaseModel

# Cria as tabelas no banco de dados (se não existirem)
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependência para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Modelo Pydantic para validar dados de entrada
class AlunoBase(BaseModel):
    nome: str
    matricula: str
    email: str

class AlunoResponse(AlunoBase):
    id: int

    class Config:
        orm_mode = True

# --------------------
# CRUD de Alunos
# --------------------

# 1. Criar um novo aluno
@app.post("/alunos/", response_model=AlunoResponse, status_code=status.HTTP_201_CREATED)
def create_aluno(aluno: AlunoBase, db: Session = Depends(get_db)):
    db_aluno = Aluno(nome=aluno.nome, matricula=aluno.matricula, email=aluno.email)
    db.add(db_aluno)
    db.commit()
    db.refresh(db_aluno)
    return db_aluno

# 2. Listar todos os alunos
@app.get("/alunos/", response_model=List[AlunoResponse])
def read_alunos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    alunos = db.query(Aluno).offset(skip).limit(limit).all()
    return alunos

# 3. Buscar um aluno pelo ID
@app.get("/alunos/{aluno_id}", response_model=AlunoResponse)
def read_aluno(aluno_id: int, db: Session = Depends(get_db)):
    aluno = db.query(Aluno).filter(Aluno.id == aluno_id).first()
    if aluno is None:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return aluno

# 4. Atualizar dados de um aluno
@app.put("/alunos/{aluno_id}", response_model=AlunoResponse)
def update_aluno(aluno_id: int, aluno: AlunoBase, db: Session = Depends(get_db)):
    db_aluno = db.query(Aluno).filter(Aluno.id == aluno_id).first()
    if db_aluno is None:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    db_aluno.nome = aluno.nome
    db_aluno.matricula = aluno.matricula
    db_aluno.email = aluno.email
    db.commit()
    db.refresh(db_aluno)
    return db_aluno

# 5. Deletar um aluno
@app.delete("/alunos/{aluno_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_aluno(aluno_id: int, db: Session = Depends(get_db)):
    db_aluno = db.query(Aluno).filter(Aluno.id == aluno_id).first()
    if db_aluno is None:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    db.delete(db_aluno)
    db.commit()
    return

# --------------------
# CRUD de Turmas
# --------------------

class TurmaBase(BaseModel):
    nome: str
    codigo: str

class TurmaResponse(TurmaBase):
    id: int

    class Config:
        orm_mode = True

# 1. Criar uma nova turma

@app.post("/turmas/", response_model=TurmaResponse, status_code=status.HTTP_201_CREATED)
def create_turma(turma: TurmaBase, db: Session = Depends(get_db)):
    db_turma = Turma(nome=turma.nome, codigo=turma.codigo)
    db.add(db_turma)
    db.commit()
    db.refresh(db_turma)
    return db_turma

# 2. Listar todas as turmas
@app.get("/turmas/", response_model=List[TurmaResponse])
def read_turmas(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    turmas = db.query(Turma).offset(skip).limit(limit).all()
    return turmas

# 3. Buscar uma turma pelo ID
@app.get("/turmas/{turma_id}", response_model=TurmaResponse)
def read_turma(turma_id: int, db: Session = Depends(get_db)):
    turma = db.query(Turma).filter(Turma.id == turma_id).first()
    if turma is None:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    return turma

# 4. Atualizar dados de uma turma
@app.put("/turmas/{turma_id}", response_model=TurmaResponse)
def update_turma(turma_id: int, turma: TurmaBase, db: Session = Depends(get_db)):
    db_turma = db.query(Turma).filter(Turma.id == turma_id).first()
    if db_turma is None:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    db_turma.nome = turma.nome
    db_turma.codigo = turma.codigo
    db.commit()
    db.refresh(db_turma)
    return db_turma

# 5. Deletar uma turma
@app.delete("/turmas/{turma_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_turma(turma_id: int, db: Session = Depends(get_db)):
    db_turma = db.query(Turma).filter(Turma.id == turma_id).first()
    if db_turma is None:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    db.delete(db_turma)
    db.commit()
    return


# --------------------
# CRUD de Frequências
# --------------------

class FrequenciaBase(BaseModel):
    data: str
    presente: bool
    aluno_id: int
    turma_id: int

class FrequenciaResponse(FrequenciaBase):
    id: int

    class Config:
        orm_mode = True

# 1. Criar uma nova frequência
@app.post("/frequencias/", response_model=FrequenciaResponse, status_code=status.HTTP_201_CREATED)
def create_frequencia(frequencia: FrequenciaBase, db: Session = Depends(get_db)):
    db_frequencia = Frequencia(data=frequencia.data, presente=frequencia.presente, aluno_id=frequencia.aluno_id, turma_id=frequencia.turma_id)
    db.add(db_frequencia)
    db.commit()
    db.refresh(db_frequencia)
    return db_frequencia

# 2. Listar todas as frequências
@app.get("/frequencias/", response_model=List[FrequenciaResponse])
def read_frequencias(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    frequencias = db.query(Frequencia).offset(skip).limit(limit).all()
    return frequencias

# 3. Buscar uma frequência pelo ID
@app.get("/frequencias/{frequencia_id}", response_model=FrequenciaResponse)
def read_frequencia(frequencia_id: int, db: Session = Depends(get_db)):
    frequencia = db.query(Frequencia).filter(Frequencia.id == frequencia_id).first()
    if frequencia is None:
        raise HTTPException(status_code=404, detail="Frequência não encontrada")
    return frequencia

# 4. Atualizar dados de uma frequência
@app.put("/frequencias/{frequencia_id}", response_model=FrequenciaResponse)
def update_frequencia(frequencia_id: int, frequencia: FrequenciaBase, db: Session = Depends(get_db)):
    db_frequencia = db.query(Frequencia).filter(Frequencia.id == frequencia_id).first()
    if db_frequencia is None:
        raise HTTPException(status_code=404, detail="Frequência não encontrada")
    db_frequencia.data = frequencia.data
    db_frequencia.presente = frequencia.presente
    db_frequencia.aluno_id = frequencia.aluno_id
    db_frequencia.turma_id = frequencia.turma_id
    db.commit()
    db.refresh(db_frequencia)
    return db_frequencia

# 5. Deletar uma frequência
@app.delete("/frequencias/{frequencia_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_frequencia(frequencia_id: int, db: Session = Depends(get_db)):
    db_frequencia = db.query(Frequencia).filter(Frequencia.id == frequencia_id).first()
    if db_frequencia is None:
        raise HTTPException(status_code=404, detail="Frequência não encontrada")
    db.delete(db_frequencia)
    db.commit()
    return

# 6. Listar todas as frequências de um aluno
@app.get("/alunos/{aluno_id}/frequencias/", response_model=List[FrequenciaResponse])
def read_frequencias_aluno(aluno_id: int, db: Session = Depends(get_db)):
    frequencias = db.query(Frequencia).filter(Frequencia.aluno_id == aluno_id).all()
    return frequencias

# 7. Listar todas as frequências de uma turma
@app.get("/turmas/{turma_id}/frequencias/", response_model=List[FrequenciaResponse])
def read_frequencias_turma(turma_id: int, db: Session = Depends(get_db)):
    frequencias = db.query(Frequencia).filter(Frequencia.turma_id == turma_id).all()
    return frequencias

# 8. Listar todas as frequências de um aluno em uma turma
@app.get("/alunos/{aluno_id}/turmas/{turma_id}/frequencias/", response_model=List[FrequenciaResponse])
def read_frequencias_aluno_turma(aluno_id: int, turma_id: int, db: Session = Depends(get_db)):
    frequencias = db.query(Frequencia).filter(Frequencia.aluno_id == aluno_id, Frequencia.turma_id == turma_id).all()
    return frequencias 