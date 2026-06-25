import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { TORNEIO_ADDRESS, TORNEIO_ABI } from './constants/contrato'
import './App.css'

function App() {
  const [conta, setConta] = useState(null)
  const [contrato, setContrato] = useState(null)
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  // Endereço do organizador (dono do contrato)
  const [organizador, setOrganizador] = useState("")

  // Estados para Inscrição
  const [nomeJogador, setNomeJogador] = useState("")

  // Estados para Votação (DAO)
  const [opcoesFormato, setOpcoesFormato] = useState([])
  const [novoFormato, setNovoFormato] = useState("") // Para o painel admin

  const conectarCarteira = async () => {
    if (window.ethereum) {
      try {
        const contas = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setConta(contas[0].toLowerCase()) // Salva em minúsculo para facilitar a comparação

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const contratoInstancia = new ethers.Contract(TORNEIO_ADDRESS, TORNEIO_ABI, signer)
        setContrato(contratoInstancia)
      } catch (err) {
        setErro("Falha ao conectar: " + err.message)
      }
    } else {
      setErro("MetaMask não encontrada. Por favor, instale a extensão.")
    }
  }

  // Carrega as opções e o endereço do organizador assim que o contrato é instanciado
  useEffect(() => {
    if (contrato) {
      carregarDadosIniciais()
    }
  }, [contrato])

  const carregarDadosIniciais = async () => {
    try {
      // Busca o endereço do organizador no contrato
      const org = await contrato.organizador()
      setOrganizador(org.toLowerCase())

      // Busca os formatos já cadastrados
      const opcoes = await contrato.obterOpcoesDeFormato()
      setOpcoesFormato(opcoes)
    } catch (err) {
      console.error("Erro ao carregar dados do contrato:", err)
    }
  }

  // --- FUNÇÕES DE ESCRITA NA BLOCKCHAIN ---

  // 1. Função exclusiva do Organizador
  const adicionarFormato = async () => {
    if (!novoFormato) return alert("Digite o nome do formato!")

    try {
      setCarregando(true)
      const tx = await contrato.adicionarOpcaoFormato(novoFormato)

      alert("Transação enviada! Aguarde a confirmação...")
      await tx.wait()
      alert("Novo formato adicionado com sucesso!")

      setNovoFormato("") // Limpa o input
      carregarDadosIniciais() // Recarrega a lista para atualizar a tela
    } catch (err) {
      console.error(err)
      alert("Erro ao adicionar formato. Você é realmente o organizador?")
    } finally {
      setCarregando(false)
    }
  }

  // 2. Inscrição (Aberto a todos, inclusive ao organizador)
  const inscreverJogador = async () => {
    if (!nomeJogador) return alert("Digite seu nome primeiro!")

    try {
      setCarregando(true)
      const tx = await contrato.inscrever(nomeJogador, {
        value: ethers.parseEther("0.01")
      })

      alert("Transação enviada! Aguarde a confirmação...")
      await tx.wait()
      alert("Inscrição realizada com sucesso!")

    } catch (err) {
      console.error(err)
      alert("Erro na inscrição. Você tem saldo? Já está inscrito?")
    } finally {
      setCarregando(false)
    }
  }

  // 3. Votar (Apenas inscritos)
  const votar = async (idOpcao) => {
    try {
      setCarregando(true)
      const tx = await contrato.votarFormato(idOpcao)

      alert("Voto enviado! Aguarde a confirmação...")
      await tx.wait()
      alert("Voto registrado com sucesso!")

      carregarDadosIniciais()
    } catch (err) {
      console.error(err)
      alert("Erro ao votar. Apenas inscritos podem votar, e apenas uma vez.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="App">
      <header>
        <h1>Torneio de Magic: The Gathering (DAO)</h1>
        {!conta ? (
          <button onClick={conectarCarteira}>Conectar MetaMask</button>
        ) : (
          <p>🟢 Carteira Conectada: {conta.substring(0, 6)}...{conta.substring(38)}</p>
        )}
      </header>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {conta && contrato && (
        <main>
          {/* PAINEL DO ORGANIZADOR: Só aparece se a carteira for a do dono do contrato */}
          {conta === organizador && (
            <section className="card" style={{ border: '2px solid #4CAF50', backgroundColor: '#e8f5e9' }}>
              <h2 style={{ color: '#2e7d32' }}>👑 Painel do Organizador</h2>
              <p>Adicione formatos para a comunidade votar:</p>
              <input
                type="text"
                placeholder="Ex: Pauper, Standard..."
                value={novoFormato}
                onChange={(e) => setNovoFormato(e.target.value)}
              />
              <button onClick={adicionarFormato} disabled={carregando} style={{ backgroundColor: '#4CAF50', marginLeft: '10px' }}>
                {carregando ? "Processando..." : "Adicionar Formato"}
              </button>
            </section>
          )}

          <hr />

          {/* SEÇÃO 1: INSCRIÇÃO */}
          <section className="card">
            <h2>Inscrever-se no Torneio</h2>
            <p>Taxa de inscrição: <strong>0.01 ETH</strong></p>
            <input
              type="text"
              placeholder="Nome do Jogador"
              value={nomeJogador}
              onChange={(e) => setNomeJogador(e.target.value)}
            />
            <button onClick={inscreverJogador} disabled={carregando}>
              {carregando ? "Processando..." : "Pagar Inscrição"}
            </button>
          </section>

          <hr />

          {/* SEÇÃO 2: VOTAÇÃO DAO */}
          <section className="card">
            <h2>DAO: Votação de Formato</h2>
            <p>Escolha o formato oficial deste torneio:</p>

            {opcoesFormato.length === 0 ? (
              <p>Nenhuma opção de formato cadastrada ainda.</p>
            ) : (
              <div className="opcoes-grid" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
                {opcoesFormato.map((opcao, index) => (
                  <div key={index} className="opcao-card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>{opcao.nome}</h3>
                    <p>Votos: <strong>{opcao.votos.toString()}</strong></p>
                    <button onClick={() => votar(index)} disabled={carregando}>
                      Votar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  )
}

export default App