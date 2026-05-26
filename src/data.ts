import { TimelineEvent, Captain, Testimony, PhotoItem } from './types';

// Let's import or map our generated images
export const IMAGES = {
  heroBanner: '/src/assets/images/revolucao_cravos_1779813993282.png',
  salgueiroMaia: '/src/assets/images/salgueiro_maia_1779814012072.png',
  povoCelebracao: '/src/assets/images/povo_celebracao_1779814031652.png'
};

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'signal-1',
    time: '24 Abr - 22:55',
    hour: 22.9,
    title: 'A Primeira Senha: "E Depois do Adeus"',
    location: 'Lisboa - Emissores Associados',
    description: 'A canção de Paulo de Carvalho é transmitida pelas ondas da rádio, dando início à contagem decrescente para a revolução.',
    detailedText: 'Os oficiais rebeldes nas guarnições precisavam de uma confirmação indetetável pela censura para assegurar que as operações deveriam avançar. Às 22h55, o jornalista João Paulo Dinis põe a rodar nos Emissores Associados de Lisboa a música "E Depois do Adeus". Este sinal indicava aos Capitães para regularem os seus rádios e prepararem os tanques e contingentes.',
    importance: 'normal',
    audioTrack: {
      songTitle: 'E Depois do Adeus',
      artist: 'Paulo de Carvalho',
      description: 'A canção vencedora do Festival da Canção de 1974 serviu de primeiro sinal secreto.',
      lyricsKeySelection: [
        'Quis saber quem sou, o que faço aqui',
        'Quem me abandonou, de quem me esqueci',
        'Perguntei à noite guias e faróis',
        'Quase me perdi num mar de caracóis'
      ],
      importance: 'Esta senha permitia aos militares saberem que a operação militar não tinha sido cancelada e que se encontrava na fase de pré-alerta.'
    }
  },
  {
    id: 'signal-2',
    time: '25 Abr - 00:20',
    hour: 0.3,
    title: 'A Senha de Confirmação: "Grândola, Vila Morena"',
    location: 'Rádio Renascença',
    description: 'A canção proibida de José Afonso é transmitida pela Rádio Renascença. O movimento militar é imparável.',
    detailedText: 'No programa de rádio "Limite", na Rádio Renascença, a canção de intervenção "Grândola, Vila Morena" é transmitida à meia-noite e vinte minutos. Escrita pelo cantautor de protesto Zeca Afonso, expressava ideais de solidariedade camponesa e fraternidade e era banida pelo regime. Foi o sinal definitivo e sem retorno para que as tropas em todo o país ocupassem os alvos predefinidos.',
    importance: 'critical',
    audioTrack: {
      songTitle: 'Grândola, Vila Morena',
      artist: 'José Afonso',
      description: 'O hino imortal da democracia portuguesa que regeu as marchas das colunas militares na madrugada.',
      lyricsKeySelection: [
        'Grândola, vila morena',
        'Terra da fraternidade',
        'O povo é quem mais ordena',
        'Dentro de ti, ó cidade'
      ],
      importance: 'O segundo sinal estratégico. Determinava a tomada imediata dos pontos centrais do país pelas colunas rebeldes do MFA.'
    }
  },
  {
    id: 'event-0300',
    time: '25 Abr - 03:00',
    hour: 3.0,
    title: 'A Ocupação de Alvos Estratégicos',
    location: 'Lisboa, Porto, Coimbra',
    description: 'As unidades do Movimento das Forças Armadas (MFA) cercam e tomam emissores de rádio, aeroportos e quartéis principais.',
    detailedText: 'Sob a coordenação tática de Otelo Saraiva de Carvalho do Posto de Comando na Pontinha, várias forças militares saem às ruas. Com precisão cirúrgica, os militares revoltos cercam as instalações da RTP, o Rádio Clube Português, o aeroporto de Portela, e sedes de comando do regime ditatorial em Lisboa e noutras capitais de distrito.',
    importance: 'normal'
  },
  {
    id: 'event-0426',
    time: '25 Abr - 04:26',
    hour: 4.4,
    title: 'Primeiro Comunicado do MFA na Rádio',
    location: 'Estúdios do Rádio Clube Português',
    description: 'O MFA lê o primeiro comunicado nacional oficial, apelando aos cidadãos para estarem calmos e permanecerem em casa.',
    detailedText: 'Instalando um emissor provisório, o jornalista Joaquim Furtado passa a ler o Comunicado nº 1 do Movimento das Forças Armadas: "Apela-se para o civismo dos habitantes de Lisboa no sentido de recolherem a suas casas...". O país acorda em sobressalto ao perceber que um golpe militar libertador está em marcha.',
    importance: 'alert'
  },
  {
    id: 'event-0600',
    time: '25 Abr - 06:00',
    hour: 6.0,
    title: 'Salgueiro Maia Entra no Terreiro do Paço',
    location: 'Terreiro do Paço, Lisboa',
    description: 'A coluna blindada vinda de Santarém, liderada pelo Capitão Salgueiro Maia, ocupa o centro do poder estatal em Lisboa.',
    detailedText: 'Vindas da Escola Prática de Cavalaria de Santarém, dez viaturas blindadas e centenas de homens sob o comando direto de Salgueiro Maia cercam o Terreiro do Paço, onde se localizam os ministérios-chave do regime. Maia assume uma postura estoica de "nada de violência escusada", demonstrando enorme frieza tática ao desarmar e convencer as forças do regime a juntarem-se à revolta.',
    importance: 'critical'
  },
  {
    id: 'event-0900',
    time: '25 Abr - 09:00',
    hour: 9.0,
    title: 'O Confronto de Forças e a Recusa em Disparar',
    location: 'Terreiro do Paço, Lisboa',
    description: 'Forças leais ao regime ameaçam disparar contra o MFA, mas os soldados recusam os comandos de fogo de generais fascistas.',
    detailedText: 'O Brigadeiro Junqueira dos Reis, leal ao regime, ordena aos seus tanques e atiradores que abram fogo sobre os rebeldes liderados por Salgueiro Maia. O soldado cabo José Alves Costa e outros atiradores recusam-se corajosamente a disparar contra os seus compatriotas. Segue-se um momento de enorme tensão onde Junqueira dos Reis ameaça matar os seus próprios homens, mas a adesão popular e solidariedade das patentes mais baixas derrota os comandos do Estado Novo.',
    importance: 'alert'
  },
  {
    id: 'event-1130',
    time: '25 Abr - 11:30',
    hour: 11.5,
    title: 'Cerco ao Quartel do Carmo',
    location: 'Largo do Carmo, Lisboa',
    description: 'Salgueiro Maia avança com as tropas para o Quartel da Guarda Nacional Republicana (GNR), onde Marcello Caetano se refugiou.',
    detailedText: 'O Chefe do Governo, Marcello Caetano, e vários governantes refugiam-se no histórico Quartel do Carmo. A coluna de Salgueiro Maia move-se para lá, sendo instantaneamente rodeada por dezenas de milhares de cidadãos lisboetas que entoam vivas à liberdade e empurram voluntariamente os tanques pelas ruelas estreitas do Chiado.',
    importance: 'critical'
  },
  {
    id: 'event-1230',
    time: '25 Abr - 12:30',
    hour: 12.5,
    title: 'O Milagre dos Cravos',
    location: 'Mercado de Lisboa / Largo do Carmo',
    description: 'Celeste Caeiro oferece cravos vermelhos aos soldados, que os colocam nos canos das suas espingardas.',
    detailedText: 'Celeste Caeiro, funcionária de um restaurante que celebrava o seu primeiro aniversário e distribuía flores, depara-se com os blindados do MFA. Ao ser questionada por um soldado se tinha um cigarro, ela oferece-lhe antes um cravo vermelho da cesta. O soldado coloca o cravo no cano do seu fuzil G3. O gesto repete-se por toda a cidade: os cravos tornam-se o símbolo pacífico da mudança de regime, emprestando o nome à "Revolução dos Cravos".',
    importance: 'normal'
  },
  {
    id: 'event-1630',
    time: '25 Abr - 16:30',
    hour: 16.5,
    title: 'Marcello Caetano Aceita render-se a Spínola',
    location: 'Quartel do Carmo, Lisboa',
    description: 'Após ultimatos sucessivos, Marcello Caetano exige ceder o poder a um oficial general para evitar a anarquia na rua.',
    detailedText: 'Com o quartel sitiado e sob fogo de intimidação, Marcello Caetano aceita Render-se, mas recusa-se categoricamente a entregar o Estado aos "Capitães da Rua". Por telefone, estabelecem-se contactos e Caetano solicita a presença do General António de Spínola (oficial superior moderado leal à hierarquia militar) para efetuar a entrega do governo de forma honrosa.',
    importance: 'critical'
  },
  {
    id: 'event-1800',
    time: '25 Abr - 18:00',
    hour: 18.0,
    title: 'A Queda do Estado Novo',
    location: 'Largo do Carmo e Pontinha',
    description: 'Marcello Caetano entrega capitulação a António de Spínola. É o fim oficial de 48 anos de ditadura salazarista.',
    detailedText: 'O General Spínola chega ao Largo do Carmo às 18 horas e aceita a rendição de Marcello Caetano no seu gabinete do quartel militar. Momentos depois, os dirigentes destituídos do Estado Novo entram num veículo blindado sob enorme fúria popular e são exilados para o Brasil via Madeira, encerrando irreversivelmente o regime ditador instituído em 1926.',
    importance: 'critical'
  },
  {
    id: 'event-2000',
    time: '25 Abr - 20:00',
    hour: 20.0,
    title: 'Os Últimos Disparos da PIDE',
    location: 'Rua António Maria Cardoso, Lisboa',
    description: 'Agentes da polícia política (PIDE/DGS) fecham-se na sua sede e disparam contra a multidão.',
    detailedText: 'Apesar de a guarnição estar sitiada por forças do exército, os agentes da temida polícia política disparam diretamente das janelas da sua sede contra civis indefesos no final do dia. Quatro jovens portugueses perdem a vida - Fernando Reis, João Arruda, José Barneto e Fernando Gesteira - sendo as únicas mortes registadas num golpe pacífico.',
    importance: 'alert'
  },
  {
    id: 'event-2400',
    time: '25 Abr - 24:00',
    hour: 24.0,
    title: 'A Libertação dos Presos Políticos',
    location: 'Fortaleza de Peniche e Caxias',
    description: 'Milhares de civis vigiam as prisões secretas de Peniche e Caxias até à libertação dos detidos antifascistas.',
    detailedText: 'Nas primeiras horas após a rendição, as massas populares e soldados dão início ao desmantelamento das terríveis prisões políticas. Os opositores do regime, intelectuais, operários e ativistas que resistiram nas sombras da ditadura cruzam as portas das celas em direção aos braços calcorreados de liberdade de amigos e familiares de lágrimas nos olhos.',
    importance: 'normal'
  }
];

export const captainsData: Captain[] = [
  {
    id: 'salgueiro-maia',
    name: 'Fernando Salgueiro Maia',
    nickname: 'O Herói do Carmo',
    role: 'Comandante da Coluna da Escola Prática de Cavalaria de Santarém',
    birthDeath: '1944 — 1992',
    biography: 'Salgueiro Maia foi o operacional mais admirado do 25 de Abril de 1974. Como Capitão de Cavalaria, comandou a mítica coluna blindada que ocupou estrategicamente o Terreiro do Paço e sitiou o Quartel do Carmo. Recusou cargos políticos, promoções e benesses após a revolução, voltando humildemente para as suas normais funções profissionais. Representa o desinteresse pessoal em prol do dever patriótico e cívico, sendo eternizado pelo seu estoicismo pacífico e determinação tática num momento crucial.',
    accomplishments: [
      'Liderança exemplar da coluna militar de Santarém a Lisboa sem agressões.',
      'Enorme serenidade no Terreiro do Paço ao enfrentar generais do regime.',
      'Sítio do Quartel do Carmo culminando com a destituição pacífica de Marcello Caetano.',
      'Humilde recusa em integrar o conselho militar supremo para continuar a sua carreira regular como militar sem privilégios.'
    ],
    quote: 'Há diversas modalidades de Estado: os estados socialistas, os estados corporativos, os estados capitalistas e o estado a que isto chegou! Ora bem, nesta noite, nós vamos pôr fim ao estado a que isto chegou!',
    imageUrl: IMAGES.salgueiroMaia
  },
  {
    id: 'otelo-saraiva',
    name: 'Otelo Saraiva de Carvalho',
    nickname: 'O Cérebro Militar do MFA',
    role: 'Estratega e Diretor Operacional do Posto de Comando do MFA',
    birthDeath: '1936 — 2021',
    biography: 'Otelo foi o grande estratega da rebelião de 25 de Abril, esboçando com elevado rigor tático todo o plano militar de ocupações coordenadas do MFA. Atuou no Posto de Comando clandestino instalado no Regimento de Engenharia n.º 1 na Pontinha durante as 24 horas críticas do dia da Revolução de Abril. Uma figura vibrante e polarizadora da história portuguesa recente, de enorme energia organizativa, foi mentor e articulador operacional do golpe militar libertador.',
    accomplishments: [
      'Criação do plano de ataque furtivo e simultâneo que paralisou o exército fiel à ditadura.',
      'Controlo operativo total a partir do Posto da Pontinha durante os momentos fulcrais da tomada de pontos estratégicos.',
      'Desenho de redes secretas de comunicação rápida entre capitães das divisões nacionais.'
    ],
    quote: 'No posto de comando militar da Pontinha, a nossa ansiedade era ouvir se a "Grândola" seria transmitida. Quando fomos confirmados, soubemos que a liberdade já não recuaria.',
    imageUrl: 'https://picsum.photos/seed/otelo/600/800'
  },
  {
    id: 'vasco-lourenco',
    name: 'Vasco Lourenço',
    nickname: 'O Porta-Voz da Liberdade',
    role: 'Membro Fundador do Comité Coordenador do MFA',
    birthDeath: '1938 — Presente',
    biography: 'Vasco Lourenço jogou um papel preponderante na génese corporativa e política do Movimento das Forças Armadas desde 1973. Apesar de ter sido transferido disciplinarmente pelo regime ditatorial para os Açores meses antes do 25 de Abril de forma a ser calado, manteve articulação plena com Otelo e os restantes capitães. Retornando imediatamente para o continente no dia 26, manteve as rédeas da transição democrática, vindo a ser o eterno dinamizador de defesa da memória oficial da revolução dos capitães.',
    accomplishments: [
      'Organizador das primeiras reuniões secretas do MFA (Évora e Óbidos) sob alta vigilância da PIDE.',
      'Consolidação do manifesto de redemocratização (Descolonizar, Democratizar, Desenvolver).',
      'Presidente histórico da Associação 25 de Abril.'
    ],
    quote: 'A revolução foi iniciada por militares, mas o seu destino imediato foi abraçado pelo povo português que estava sedento de vozes livres.',
    imageUrl: 'https://picsum.photos/seed/vasco/600/800'
  },
  {
    id: 'melo-antunes',
    name: 'Ernesto Melo Antunes',
    nickname: 'O Teórico Político do MFA',
    role: 'Redator do Programa do Movimento das Forças Armadas',
    birthDeath: '1933 — 1999',
    biography: 'Melo Antunes foi a "alma intelectual" do movimento, redigindo o crucial programa do MFA - o documento fundador que ditava que o intuito das forças armadas não era governar mas sim devolver de imediato o poder aos partidos políticos com liberdade de expressão e concluir as guerras coloniais. Foi o garante ideológico que impediu que a transição pós-revolução degenerasse num novo regime ditatorial de pendor militar, primando sempre pelo equilíbrio democrático multipartidário.',
    accomplishments: [
      'Redação do célebre "Programa dos Três D" (Democratizar, Descolonizar, Desenvolver).',
      'Atuação crítica na mediação das relações diplomáticas externas luso-comunitárias após 1974.',
      'Garante civilista de rejeição do militarismo político permanente na nova constituição.'
    ],
    quote: 'Tínhamos a convicção profunda de que um exército não se devia arrogar o direito de se impor de forma tirânica e permanente ao próprio povo que diz defender.',
    imageUrl: 'https://picsum.photos/seed/melo/600/800'
  }
];

export const testimoniesData: Testimony[] = [
  {
    id: 'celeste-caeiro',
    name: 'Celeste Caeiro',
    ageIn1974: 41,
    occupation: 'Florista e Empregada de Self-Service',
    location: 'Lisboa (Chiado)',
    narrative: 'Eu trabalhava no restaurante "Sir" na Rua Braancamp que fazia o seu primeiro ano. Os gerentes tinham comprado muitos cravos de diversas cores para oferecer aos clientes. O restaurante não abriu por causa da revolução nacional e o patrão deu-me os cravos. Peguei neles e decidi ir de metropolitano até ao Rossio. Ao chegar perto dos tanques, perguntei a um militar o que se passava e ele disse-me: "Nós vamos para o Carmo meter o Marcello Caetano na rua. Tem um cigarro?". Respondi que não tinha nenhum vício, mas dei-lhe um cravo vermelho e enfiei-lho no cano da espingarda. Ele aceitou a rir! Comecei a distribuir cravos pelos outros blindados. Foi um momento de milagre espontâneo.',
    vibe: 'liberated',
    audioClipText: 'Nunca pensei que aquele cravo vermelho, a flor mais barata da época, desse o nome à derradeira libertação da minha pátria. Que orgulho imenso.'
  },
  {
    id: 'maria-alzira',
    name: 'Maria Alzira Seixas',
    ageIn1974: 19,
    occupation: 'Estudante Universitária de Letras',
    location: 'Lisboa (Chiado/Largo do Carmo)',
    narrative: 'Tanto tempo passado a ter medo, a sussurrar nos corredores da faculdade com pavor de que o colega do lado fosse um bufo da PIDE. Quando ouvi de manhã nas notícias e abri a janela, parecia um sonho. Desci a correr com duas colegas em direção ao Baixa Chiado. Sentia-se eletricidade no ar. O medo evaporou-se em segundos quando vimos os tanques rodeados por gente de todas as idades que oferecia laranjas, água e abraços aos soldados. Gritei tanto pela Liberdade que fiquei sem voz durante três dias.',
    vibe: 'hopeful',
    audioClipText: 'Era a sensação inexplicável de poder, pela primeira vez na minha vida inteira, cantar na rua e gritar "Liberdade" sem olhar por trás das costas.'
  },
  {
    id: 'carlos-silva',
    name: 'Carlos Silva',
    ageIn1974: 21,
    occupation: 'Soldado Conscrito (Infantaria)',
    location: 'Santarém e Terreiro do Paço',
    narrative: 'Fomos acordados às nove da noite de dia 24 pelo capitão Salgueiro Maia que nos juntou no pátio e fez um discurso de que quem quisesse podia ficar no quartel, mas que o país precisava de nós para acabar com aquela estúpida guerra em Angola e Moçambique onde perdíamos amigos todos os meses. Seguimos em cima dos blindados sem saber muito bem o que ia passar. Quando entrámos no Terreiro do Paço e vimos a multidão a cercar-nos de sorrisos luso-fraternos, soube que estávamos no caminho certo da nossa história comum.',
    vibe: 'tense',
    audioClipText: 'A tensão era imensa, as nossas mãos tremiam nos fuzis G3. Mas quando fomos abraçados pela população, toda a nossa angústia de rapazes das aldeias partindo para terras distantes se dissipou.'
  },
  {
    id: 'antonio-lopes',
    name: 'António Lopes Rebelo',
    ageIn1974: 32,
    occupation: 'Operário Metalúrgico e Ativista Político',
    location: 'Celas da Fortaleza de Peniche',
    narrative: 'Eu cumpria uma pena de 4 anos de prisão política por apoiar greves e distribuir folhetos clandestinos contra o regime. Estava em Peniche isolado numa cela sem luz natural. A meio da noite sentimos ruídos estranhos e os guardas normais começaram a cochichar nervosamente nos corredores de betão. Ao início da manhã soubemos, através de uma rádio caseira que introduzimos em contrabando, que o MFA tinha controlo da capital. O rugido de cânticos lá fora de milhares de populares das vilas vizinhas exigia a nossa libertação imediata. Chorámos todos de cotovelos colados ao peito abraçados às grades.',
    vibe: 'reflective',
    audioClipText: 'O momento em que os portões da Fortaleza de Peniche se abriram e eu comtempluei o mar livre foi o nascimento real de uma nova era de dignidade nacional.'
  },
  {
    id: 'dr-eduardo',
    name: 'Eduardo Sousa Pinto',
    ageIn1974: 29,
    occupation: 'Médico de Família Hospitalar',
    location: 'Lisboa (Hospital S. José)',
    narrative: 'Estava de plantão na madrugada do dia 25. Ouvimos barulho de lagartas metálicas no asfalto e sabíamos que estava por perto uma ação relevante. O hospital recebeu apenas algumas pessoas feridas por escaramuças, e de final de tarde os pobres jovens alvejados pelos criminosos da PIDE. No entanto, o sentimento que reinava nos corredores de S. José não era pânico, mas sim uma ansiedade redentora. Foram horas de uma esperança infatigável como nunca se sentiu num recinto médico de rotinas habituais.',
    vibe: 'hopeful',
    audioClipText: 'Assistimos a um milagre cívico de libertação comunitária. Sabíamos que, acontecesse o que acontecesse nas próximas horas, as algemas eternas de Portugal tinham caído para todo o sempre.'
  }
];

export const photoGalleryData: PhotoItem[] = [
  {
    id: 'photo-1',
    imageUrl: IMAGES.povoCelebracao,
    title: 'A Celebração Popular do Cravos',
    category: 'celebracoes',
    description: 'Populares e militares confraternizam em cima de veículos blindados nas ruas de Lisboa no dia 25 de Abril, ostentando orgulhosamente os cravos vermelhos.',
    year: '1974',
    location: 'Avenida da Liberdade, Lisboa'
  },
  {
    id: 'photo-2',
    imageUrl: IMAGES.heroBanner,
    title: 'O Símbolo da Paz Democrática',
    category: 'simbolos',
    description: 'A ilustrativa união poética entre a arma militar da ditadura e a flor vermelha primaveril que simboliza a vitoriosa paz e o fim da opressão colonial em Portugal.',
    year: '1974',
    location: 'Largo do Carmo'
  },
  {
    id: 'photo-3',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800&h=600',
    title: 'A Esperança das Mulheres de Abril',
    category: 'ruas',
    description: 'Mulheres e estudantes descem à baixa lisboeta para apoiar as Forças Armadas na concretização do Estado de Direito.',
    year: '1974',
    location: 'Chiado'
  },
  {
    id: 'photo-4',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800&h=600',
    title: 'As Comunicações Rápidas dos Forças do MFA',
    category: 'militar',
    description: 'Oficiais leem comunicados governamentais alternativos nos emissores ocupados do Rádio Clube Português.',
    year: '1974',
    location: 'Rua de Sampaio e Pina, Lisboa'
  },
  {
    id: 'photo-5',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800&h=600',
    title: 'Os Rostos da Juventude Militarizada',
    category: 'militar',
    description: 'Mancebos portugueses celebrando na retaguarda dos tanques no interior do Chiado à espera do ultimato de exílio do regime.',
    year: '1974',
    location: 'Largo do Carmo'
  },
  {
    id: 'photo-6',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=600',
    title: 'O Retorno de Familiares de África',
    category: 'celebracoes',
    description: 'A descolonização acarreta a cessação de hostilidades no Ultramar das colónias portuguesas, permitindo o regresso a salvo de dezenas de milhares de soldados conscritos.',
    year: '1974',
    location: 'Cais de Alcântara, Lisboa'
  }
];
