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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'

export default function Alunos() {
  const [alunos, setAlunos] = useState<
    { id: number; nome: string; matricula: string; email: string }[]
  >([])
  const [nomeAluno, setNomeAluno] = useState('')
  const [matriculaAluno, setMatriculaAluno] = useState('')
  const [emailAluno, setEmailAluno] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { toast } = useToast()

  const handleCreateAluno = async () => {
    try {
      const response = await api.post('/alunos', {
        nome: nomeAluno,
        matricula: matriculaAluno,
        email: emailAluno
      })
      console.log(response.data)
      handleGetAlunos()
    } catch (error) {
      setAlertOpen(true)
      console.error(error)
    }
  }

  const handleGetAlunos = async () => {
    try {
      const response = await api.get('/alunos')
      setAlunos(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteAluno = async (id: number) => {
    try {
      await api.delete(`/alunos/${id}`)
      handleGetAlunos()
    } catch (error) {
      console.error(error)
    }
  }

  const handleReadTag = () => {
    setTimeout(() => {
      setAlertOpen(false)
      toast({
        title: 'Aluno cadastrado com sucesso',
        description: 'O aluno foi cadastrado com sucesso'
      })
      handleGetAlunos()
    }, 5000)
    setDialogOpen(false)
  }

  useEffect(() => {
    handleGetAlunos()
  }, [])

  return (
    <>
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Cadastro de Alunos</h1>
        <div className="mb-4 flex">
          <Dialog open={dialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" onClick={() => setDialogOpen(true)}>
                Adicionar Aluno
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar aluno</DialogTitle>
                <DialogDescription>
                  Adicione os dados do aluno
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Nome</Label>
                  <Input
                    id="nome"
                    value={nomeAluno}
                    onChange={e => setNomeAluno(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={matriculaAluno}
                    onChange={e => setMatriculaAluno(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">E-mail</Label>
                  <Input
                    id="email"
                    value={emailAluno}
                    onChange={e => setEmailAluno(e.target.value)}
                    className="col-span-3"
                    type="email"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateAluno}>Cadastrar aluno</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div>
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Aproxime a tag do aluno</AlertDialogTitle>
                  <AlertDialogDescription>
                    Aproxime a tag do aluno para realizar a leitura e completar
                    o cadastro
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button onClick={handleReadTag}>OK</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alunos.map(aluno => (
              <TableRow key={aluno.id}>
                <TableCell>{aluno.nome}</TableCell>
                <TableCell>{aluno.matricula}</TableCell>
                <TableCell>{aluno.email}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteAluno(aluno.id)}
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
