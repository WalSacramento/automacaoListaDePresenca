import { Header } from '@/components/Header'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-6">
        <Link to="/alunos">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Alunos</CardTitle>
              <CardDescription>Gerenciar cadastro de alunos</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to="/turmas">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Turmas</CardTitle>
              <CardDescription>Gerenciar cadastro de turmas</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to="/frequencia">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Frequência</CardTitle>
              <CardDescription>Registrar frequência dos alunos</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
