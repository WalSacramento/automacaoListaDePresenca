import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home';
import AlunoPage from '../pages/Aluno';
import TurmaPage from '../pages/Turma';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aluno" element={<AlunoPage />} />
        <Route path="/turma" element={<TurmaPage />} />

      </Routes>
    </BrowserRouter>
  );
}