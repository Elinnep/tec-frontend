// src/constants/contrato.js
export const TORNEIO_ADDRESS = import.meta.env.VITE_TORNEIO_ADDRESS;

export const TORNEIO_ABI = [
        {
            "type": "constructor",
            "inputs": [
                {
                    "name": "_taxaInscricao",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "_maxJogadores",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "adicionarOpcaoFormato",
            "inputs": [
                {
                    "name": "_nome",
                    "type": "string",
                    "internalType": "string"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "encerrarVotacaoFormato",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "fecharInscricoes",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "inscrever",
            "inputs": [
                {
                    "name": "_nome",
                    "type": "string",
                    "internalType": "string"
                }
            ],
            "outputs": [],
            "stateMutability": "payable"
        },
        {
            "type": "function",
            "name": "inscricoesAbertas",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "jaVotouFormato",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "jogadores",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "nome",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "pontuacao",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "cadastrado",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "listaJogadores",
            "inputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "maxJogadores",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "obterOpcoesDeFormato",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "tuple[]",
                    "internalType": "struct TorneioMTG.OpcaoFormato[]",
                    "components": [
                        {
                            "name": "nome",
                            "type": "string",
                            "internalType": "string"
                        },
                        {
                            "name": "votos",
                            "type": "uint256",
                            "internalType": "uint256"
                        }
                    ]
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "opcoesFormato",
            "inputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "nome",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "votos",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "organizador",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "pontuar",
            "inputs": [
                {
                    "name": "j",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "p",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "premiar",
            "inputs": [
                {
                    "name": "_vencedor",
                    "type": "address",
                    "internalType": "address payable"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "reiniciarTorneio",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "taxaInscricao",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "votacaoEncerrada",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "votarFormato",
            "inputs": [
                {
                    "name": "_idOpcao",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "InscricaoRealizada",
            "inputs": [
                {
                    "name": "participante",
                    "type": "address",
                    "indexed": false,
                    "internalType": "address"
                },
                {
                    "name": "nome",
                    "type": "string",
                    "indexed": false,
                    "internalType": "string"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "NovaOpcaoFormato",
            "inputs": [
                {
                    "name": "nome",
                    "type": "string",
                    "indexed": false,
                    "internalType": "string"
                },
                {
                    "name": "idOpcao",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "VotacaoEncerrada",
            "inputs": [
                {
                    "name": "formatoVencedor",
                    "type": "string",
                    "indexed": false,
                    "internalType": "string"
                },
                {
                    "name": "totalVotos",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "VotoRegistrado",
            "inputs": [
                {
                    "name": "eleitor",
                    "type": "address",
                    "indexed": false,
                    "internalType": "address"
                },
                {
                    "name": "idOpcao",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        }
]