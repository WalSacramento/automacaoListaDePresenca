import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Header } from '@/components/Header'
import api from '@/services/requests/api'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import autoTable from 'jspdf-autotable'
import { Button } from '@/components/ui/button'

export default function Frequencia() {
  const [turma, setTurma] = useState('')
  const [turmas, setTurmas] = useState<
    { id: number; nome: string; codigo: string }[]
  >([])
  const [selectedTurmaId, setSelectedTurmaId] = useState<string | null>(null)

  const [frequencias, setFrequencias] = useState<
    {
      id: number
      data: string
      presente: boolean
      aluno: {
        id: number
        nome: string
        matricula: string
        email: string
      }
    }[]
  >([])

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

  const handleGetFrequenciaForTurma = async (turmaId: string) => {
    try {
      const response = await api.get(`/turmas/${turmaId}/frequencias/`)
      setFrequencias(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const carregarAlunos = (turmaId: string) => {
    setSelectedTurmaId(turmaId)
    handleGetFrequenciaForTurma(turmaId)
  }

  const todayDate = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (selectedTurmaId) {
      const intervalId = setInterval(() => {
        handleGetFrequenciaForTurma(selectedTurmaId)
      }, 5000)

      return () => clearInterval(intervalId)
    }
  }, [selectedTurmaId])

  const generatePDF = () => {
    const doc = new jsPDF()
    doc.text('Lista de Frequência', 14, 16)
    autoTable(doc, {
      head: [['Nome', 'Presente']],
      body: frequencias.map(frequencia => [
        frequencia.aluno.nome,
        frequencia.presente ? 'Sim' : 'Não'
      ]),
      startY: 20
    })
    doc.save(`frequencia-${turma}-${todayDate}.pdf`)
  }

  return (
    <>
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Registro de Frequência</h1>
        <div className="mb-4 flex gap-4">
          <Select
            onValueChange={value => {
              setTurma(value)
              carregarAlunos(value)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione a turma" />
            </SelectTrigger>
            <SelectContent>
              {turmas.map(t => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={todayDate} />
          <Button
            onClick={generatePDF}
            variant="default"
          >
            Gerar relatório em PDF
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Presente</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {frequencias.map(frequencias => (
              <TableRow key={frequencias.aluno.id}>
                <TableCell>{frequencias.aluno.nome}</TableCell>
                <TableCell>
                  <Checkbox checked={frequencias.presente} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </>
  )
}
