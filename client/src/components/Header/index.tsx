import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-slate-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Controle de Frequência</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/alunos" className="hover:underline">
                Alunos
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Início
              </Link>
            </li>
            <li>
              <Link to="/turmas" className="hover:underline">
                Turmas
              </Link>
            </li>
            <li>
              <Link to="/frequencia" className="hover:underline">
                Frequência
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
