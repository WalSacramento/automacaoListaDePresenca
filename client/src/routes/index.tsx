import { Toaster } from '@/components/ui/toaster'
import AlunosPage from '@/pages/Alunos'
import Frequencia from '@/pages/Frequencia'
import HomePage from '@/pages/Home'
import TurmasPage from '@/pages/Turmas'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/turmas" element={<TurmasPage />} />
        <Route path="/alunos" element={<AlunosPage />} />
        <Route path="/frequencia" element={<Frequencia />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
