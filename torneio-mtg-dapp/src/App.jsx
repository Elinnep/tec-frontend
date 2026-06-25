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
  const [ultimoInscrito, setUltimoInscrito] = useState("")

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
  // Função para reiniciar o torneio (Limpar Sessão)
  const reiniciarTorneio = async () => {
    // Confirmação para evitar cliques acidentais
    if (!window.confirm("Atenção! Isto irá apagar todos os jogadores e votos. Deseja continuar?")) return;

    try {
      setCarregando(true)
      const tx = await contrato.reiniciarTorneio()

      alert("A enviar transação de reinício... Aguarde.")
      await tx.wait()
      alert("Torneio reiniciado com sucesso! Sessão limpa.")

      carregarDadosIniciais() // Atualiza o ecrã para refletir o torneio vazio
    } catch (err) {
      console.error(err)
      alert("Erro ao reiniciar. Apenas o organizador pode executar esta ação.")
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

      setUltimoInscrito(nomeJogador)
      setNomeJogador("")
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
        <h1>DApp Organizador de Torneios</h1>
        <div className="wallet-status">
          {!conta ? (
            <button onClick={conectarCarteira}>Conectar MetaMask</button>
          ) : (
            <p>Carteira Conectada: {conta.substring(0, 6)}...{conta.substring(38)}</p>
          )}
        </div>
      </header>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {conta && contrato && (
        <main>
          <div className="top-grid">
            {conta === organizador && (
              <section className="card organizer-card">
                <div className="card-header">
                  <h2>Painel do Organizador</h2>
                  <span className="status-chip">Organizador</span>
                </div>
                <p>Insira o nome do formato que será votado pelos inscritos.</p>

                <div className="input-row">
                  <input
                    type="text"
                    placeholder="Ex: Standard, Pauper, Legacy"
                    value={novoFormato}
                    onChange={(e) => setNovoFormato(e.target.value)}
                  />
                  <button onClick={adicionarFormato} disabled={carregando}>
                    {carregando ? "A processar..." : "Adicionar Formato"}
                  </button>
                </div>

                <button className="secondary-button" onClick={reiniciarTorneio} disabled={carregando}>
                  {carregando ? "A processar..." : "Reiniciar Torneio"}
                </button>
              </section>
            )}

            <section className="card signup-card">
              <div className="card-header">
                <h2>Inscrição</h2>
                <span className="status-chip">Acesso aberto</span>
              </div>
              <p>Para se inscrever, informe seu nome e pague a taxa.</p>

              <div className="input-row">
                <input
                  type="text"
                  placeholder="Nome do Jogador"
                  value={nomeJogador}
                  onChange={(e) => setNomeJogador(e.target.value)}
                />
                <button onClick={inscreverJogador} disabled={carregando}>
                  {carregando ? "Processando..." : "Pagar Inscrição"}
                </button>
              </div>

              <p className="info-note">
                Taxa de inscrição: <strong>0.01 ETH</strong>
              </p>

              {ultimoInscrito && (
                <div className="inscricao-summary">
                  <strong>Último inscrito:</strong> {ultimoInscrito}
                </div>
              )}

              {opcoesFormato.length === 0 && (
                <p className="info-note">
                  A aba de votação aparecerá depois que o organizador inserir os formatos.
                </p>
              )}
            </section>
          </div>

          {opcoesFormato.length > 0 && (
            <section className="card vote-card">
              <div className="card-header">
                <h2>Votação de Formato</h2>
                <span className="status-chip">DAO</span>
              </div>
              <p>Escolha o formato oficial deste torneio entre as opções disponíveis.</p>

              <div className="opcoes-grid">
                {opcoesFormato.map((opcao, index) => (
                  <div key={index} className="opcao-card">
                    <h3>{opcao.nome}</h3>
                    <p>Votos: <strong>{opcao.votos.toString()}</strong></p>
                    <button onClick={() => votar(index)} disabled={carregando}>
                      Votar
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  )
}

export default App