"use client";

import { useState } from "react";

const App = () => {
  // Estado para controlar a visibilidade do modal que exibe os resultados da pesquisa ou mensagens.
  const [modal, setModal] = useState(false);
  // Estado para armazenar o valor digitado pelo usuário no campo de busca.
  const [isValue, setIsValue] = useState(``);
  // Estado para armazenar os dados obtidos da API do GitHub. Pode ser de qualquer tipo.
  const [isData, setIsData] = useState<any>(null);
  // Estado para indicar se os dados estão sendo carregados da API.
  const [loading, setLoading] = useState(false);

  /**
   * Lida com a funcionalidade de busca de perfil.
   * Previne o envio padrão do formulário, define o estado de carregamento, busca dados da API do GitHub,
   * e atualiza o estado com base na resposta.
   * @param e O evento do formulário.
   */
  const SearchProfile = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário
    console.log(isValue); // Registra o valor atual do input para depuração
    setModal(true); // Exibe o modal
    setLoading(true); // Define loading como true enquanto busca os dados
    setIsData(null); // Limpa os dados anteriores

    try {
      // Busca dados do usuário na API do GitHub, removendo quaisquer espaços do valor de entrada
      const response = await fetch(`https://api.github.com/users/${isValue.replace(/\s+/g, "")}`);
      if (!response.ok) {
        // Se a resposta não for OK (ex: 404 Não Encontrado), lança um erro
        throw new Error("Não foi possível buscar essa API");
      }
      const data = await response.json(); // Analisa a resposta JSON
      setIsData(data); // Armazena os dados obtidos
    } catch (err) {
      // Captura e registra quaisquer erros durante a operação de busca
      console.error(`Error: ${err}`);
      setIsData(null); // Garante que os dados sejam nulos em caso de erro
    } finally {
      setLoading(false); // Sempre define loading como false após a operação de busca
    }
  };

  return (
    <>
      {/* Contêiner principal para toda a aplicação, centralizando seu conteúdo */}
      <main className="relative w-full h-screen flex flex-col justify-center bg-[#1f1f1f] items-center overflow-hidden">
        {/* Seção para o conteúdo principal: título, barra de busca e exibição de resultados */}
        <section className="relative bg-black flex flex-col justify-center items-center gap-6 w-full lg:w-[80vw] h-screen sm:h-[60vh] p-4 sm:p-0 z-10">
          {/* Título da aplicação */}
          <h1 className="flex justify-center items-center gap-4 text-4xl sm:text-6xl">
            <img
              className="w-[58px] h-[58px] cover object-contain"
              src="./image 1.png"
              alt="Logo do GitHub"
            />
            Perfil <span className="font-bold">GitHub</span>
          </h1>

          {/* Contêiner do input de busca e botão */}
          <div className="relative w-full sm:w-[503px] h-[62px]">
            <form
              className="relative w-full sm:w-[503px] h-[62px]"
              onSubmit={SearchProfile}
            >
              {/* Campo de input para o nome de usuário do GitHub */}
              <input
                className="w-full h-full bg-white px-4 placeholder:text-black placeholder:text-[20px] rounded-[10px] outline-none text-black"
                type="text"
                required
                placeholder="Digite um usuário do Github"
                value={isValue}
                onChange={(e) => setIsValue(e.target.value)}
              />
              {/* Botão de busca com estilo dinâmico baseado no valor do input */}
              <button
                type="submit"
                className={`bg-[#005cff] absolute right-0.5 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[60px] h-[60px] rounded-[10px] focus:outline-none ${
                  isValue.trim().length < 2
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                aria-label="Buscar usuário"
                onClick={SearchProfile}
                disabled={isValue.trim().length < 2}
              >
                {/* Ícone de lupa SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[35px] text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <line
                    x1="21"
                    y1="21"
                    x2="16.65"
                    y2="16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Renderização condicional para resultados da busca ou mensagens */}
          {modal &&
            (loading ? (
              // Exibe mensagem de carregamento enquanto busca os dados
              <div className="flex justify-center items-center rounded-[10px] w-full max-w-[804px] bg-[#D9D9D9] px-6 py-8">
                <p className="text-blue-500 text-[20px] text-center">
                  Carregando...
                </p>
              </div>
            ) : isData && isData.login ? (
              // Exibe o perfil do usuário se os dados forem buscados com sucesso
              <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center w-full max-w-[804px] min-h-[257px] rounded-[25px] bg-[#D9D9D9] px-6 py-8 sm:py-0 gap-6">
                {/* Avatar do usuário */}
                <div className="shrink-0 grow-0 w-[220px] h-[220px] rounded-full border-4 border-[#005CFF] flex items-center justify-center overflow-hidden">
                  <img
                    className="w-sfull h-full object-contain"
                    src={isData.avatar_url}
                    alt={`Avatar de ${isData.login}`}
                  />
                </div>
                {/* Nome e biografia do usuário */}
                <div className="flex flex-col gap-4">
                  <h1 className="text-[20px] font-bold text-[#005CFF]">
                    {isData.name && isData.name.trim().length > 0
                      ? isData.name
                      : "Este usuário não possui informações públicas disponíveis."}
                  </h1>
                  {isData.name && isData.name.trim().length > 0 && (
                    <p className="text-[15px] text-black flex-wrap">
                      {isData.bio && isData.bio.length > 1
                        ? isData.bio
                        : "Este usuário não adicionou uma biografia pública."}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              // Exibe mensagem de erro se nenhum perfil for encontrado
              <div className="flex justify-center items-center rounded-[10px] w-full max-w-[804px] bg-[#D9D9D9] px-6 py-8">
                <p className="text-red-500 text-[20px] text-center">
                  Nenhum perfil foi encontrado com esse nome de usuário. <br /> Tente
                  novamente
                </p>
              </div>
            ))}
        </section>

        {/* Imagens de fundo decorativas */}
        <img
          className="w-[239px] h-[225px] absolute top-[5rem] left-[7vw] cover object-contain z-0"
          src="./Camada_1.png"
          alt=""
        />
        <img
          className="blur-2xl w-[888px] h-[888px] absolute top-[0rem] right-0 cover object-contain z-0"
          src="./Ellipse 1.png"
          alt=""
        />
        <img
          className="blur-3xl w-[674px] h-[674px] absolute -left-[20%] bottom-0 cover object-contain z-0"
          src="./Ellipse 1.png"
          alt=""
        />
      </main>
    </>
  );
};

export default App;
