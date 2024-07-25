export function getColor(d: string) {
  switch (d) {
    case 'ARBOREO':
      return '#006400'
    case 'URBANO':
      return '#FF0000'
    case 'SOLO EXPOSTO':
      return '#FFA500'
    case 'HERBACEO':
      return '#006401'
    case "Corpos D'água":
      return '#0000FF'
    default:
      return '#000000'
  }
}

interface CalcularRaioVooProps {
  tipoCadastro: 'apicultor' | 'meliponicultor'
  especie?:
    | 'Frieseomelitta silvestrii'
    | 'Frieseomelitta longipes'
    | 'Frieseomelitta doederleini'
    | 'Tetragonisca angustula'
    | 'Scaptotrigona polysticta'
    | 'Melipona subnitida'
    | 'Melipona seminigra'
    | 'Melipona flavolineata'
    | 'Melipona fasciculata'
}

export function calcularRaioVoo({
  tipoCadastro,
  especie,
}: CalcularRaioVooProps) {
  let raioVooKM: number
  let raioVooDEC: number
  console.log('especie', especie)
  if (tipoCadastro === 'MELIPONICULTOR') {
    switch (especie) {
      case 'Frieseomelitta silvestrii':
      case 'Frieseomelitta longipes':
      case 'Frieseomelitta doederleini':
      case 'Tetragonisca angustula':
        raioVooKM = 500
        raioVooDEC = 0.5
        break
      case 'Scaptotrigona polysticta':
      case 'Melipona subnitida':
      case 'Melipona seminigra':
      case 'Melipona flavolineata':
      case 'Melipona fasciculata':
        raioVooKM = 2500
        raioVooDEC = 2.5
        break
      default:
        raioVooKM = 1200
        raioVooDEC = 1.2
    }
  } else {
    raioVooKM = 1500
    raioVooDEC = 1.5
  }

  return { raioVooKM, raioVooDEC }
}

export function exibirPorTipo(
  tipoCadastro: string,
  marker: any,
  suporte?: number,
) {
  if (tipoCadastro === 'apicultor') {
    return marker
      .bindTooltip(`Capacidade de suporte apicultura: ${suporte}`)
      .openTooltip()
  } else if (tipoCadastro === 'meliponicultor') {
    return marker
      .bindTooltip(`Capacidade de suporte Meliponicultura: ${suporte}`)
      .openTooltip()
  }
}

export function removeMask(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

export function validarCPF(cpf: string | undefined) {
  if (!cpf) {
    return false
  }
  cpf = cpf.replace(/\D/g, '')

  if (cpf.length !== 11) {
    return false
  }

  // Verifica se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1*$/.test(cpf)) {
    return false
  }

  // Validação dos dígitos verificadores
  const digitos = cpf.split('').map(Number)
  const dv1 = digitos[9] // Primeiro dígito verificador
  const dv2 = digitos[10] // Segundo dígito verificador

  // Cálculo do primeiro dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += digitos[i] * (10 - i)
  }
  let resto = soma % 11
  const calcDv1 = resto < 2 ? 0 : 11 - resto

  if (calcDv1 !== dv1) {
    return false
  }

  // Cálculo do segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += digitos[i] * (11 - i)
  }
  resto = soma % 11
  const calcDv2 = resto < 2 ? 0 : 11 - resto

  if (calcDv2 !== dv2) {
    return false
  }

  return true
}
