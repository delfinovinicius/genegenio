# Guia docente do GeneGênio

## O que é

O GeneGênio é um chatbot investigativo para o ensino de Genética no 9º ano. Em vez de dar respostas prontas, ele conduz o estudante por perguntas orientadoras, analogias e pistas graduais, com emblemas que valorizam o raciocínio científico. Adota uma perspectiva antirracista, problematizando o determinismo biológico, o racismo científico e a eugenia.

Alinhamento à BNCC: unidade temática Vida e Evolução, habilidades EF09CI08 e EF09CI09.

## Como usar

Acesse o GeneGênio pelo site GeneGênio Lab: https://delfinovinicius.github.io/genegenio/#conversar

O agente foi concebido no GPT Builder (ChatGPT) e está incorporado ao site em uma versão na plataforma Dify, o que permite conversar diretamente pelo navegador.

## Como recriar e adaptar o agente

### No GPT Builder (ChatGPT)

1. Acesse chatgpt.com, vá em "Explorar GPTs" e clique em "Criar".
2. Na aba "Configurar", preencha nome, descrição e imagem (o mascote está na pasta `imagens`).
3. Cole no campo "Instruções" o conteúdo de `instrucoes-do-agente.md`, a partir da seção IDENTIDADE.
4. Em "Conhecimento", envie os materiais da sua base (veja `base-de-conhecimento.md`).
5. Cadastre os iniciadores de conversa listados no final das instruções.
6. Em "Recursos", mantenha a navegação na web desativada, para que o agente priorize os materiais curados.
7. Salve com a opção de compartilhamento "Qualquer pessoa com o link".

### Em outras plataformas

As instruções funcionam em qualquer plataforma que aceite prompt de sistema e base de conhecimento (por exemplo, Dify, Gemini Gems ou Claude Projects). Ajuste apenas o que for específico de cada ferramenta.

### O que adaptar

- **Conteúdo:** troque os materiais da base para outro tema ou série; ajuste a seção IDENTIDADE e os iniciadores.
- **Emblemas:** renomeie ou crie emblemas, mantendo o princípio de recompensar raciocínio, não acertos.
- **Tamanho das respostas:** altere os limites conforme a idade e a fluência leitora da turma.

## Sugestões para a sala de aula

- Apresente o GeneGênio como parceiro de investigação, não como fonte de respostas.
- Proponha uma situação-problema (um heredograma, uma característica familiar) antes da conversa.
- Peça que os estudantes registrem hipóteses e emblemas conquistados, e socialize os percursos ao final.
- Use as respostas do próprio agente para discutir vieses e limites da IA generativa.

## Cuidados

- Verifique os termos de uso da plataforma quanto à idade mínima e ao consentimento dos responsáveis.
- Oriente os estudantes a não compartilhar dados pessoais nas conversas.
- Teste o agente antes de usar com a turma: modelos de IA podem errar ou mudar de comportamento após atualizações.

## Licença e citação

Materiais disponibilizados sob a licença Creative Commons Atribuição 4.0 Internacional (CC BY 4.0).

DELFINO, V.; SANTOS, H. A.; OLIVEIRA, I. S.; BERGER, M.; PASSOS, M. L. S.; BATTESTIN, V.; DUTRA, D. S. A. **GeneGênio: chatbot investigativo para o ensino de Genética no 9º ano**. Vila Velha: Ifes/Educimat, 2026. Disponível em: https://github.com/delfinovinicius/genegenio. DOI: [COMPLETAR após o Zenodo].
