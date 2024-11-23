import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/Header'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import api from '@/services/requests/api'

export default function Turmas() {
  const [turmas, setTurmas] = useState<
    { id: number; nome: string; codigo: string }[]
  >([])
  const [nomeTurma, setNomeTurma] = useState('')
  const [codigoTurma, setCodigoTurma] = useState('')

  const handleCreateTurma = async () => {
    try {
      const response = await api.post('/turmas', {
        nome: nomeTurma,
        codigo: codigoTurma
      })
      console.log(response.data)
      handleGetTurmas()
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetTurmas = async () => {
    try {
      const response = await api.get('/turmas')
      setTurmas(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleGetTurmas()
  }, [])

  const handleDeleteTurma = async (id: number) => {
    try {
      await api.delete(`/turmas/${id}`)
      handleGetTurmas()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Cadastro de Turmas</h1>
        <div className="mb-4 flex">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Cadastrar Turma</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Turma</DialogTitle>
                <DialogDescription>
                  Adicione os dados da turma
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Nome</Label>
                  <Input
                    id="nome"
                    value={nomeTurma}
                    onChange={e => setNomeTurma(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Código</Label>
                  <Input
                    id="codigo"
                    value={codigoTurma}
                    onChange={e => setCodigoTurma(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTurma}>Cadastrar turma</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Código da turma</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {turmas.map(turma => (
              <TableRow key={turma.id}>
                <TableCell>{turma.nome}</TableCell>
                <TableCell>{turma.codigo}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteTurma(turma.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </>
  )
}
