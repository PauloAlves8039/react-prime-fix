import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./filme-info.css";
import api from "../../services/api";

function Filme(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [filme, setFilme] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function loadFilme(){
      await api.get(`/movie/${id}`, {
        params:{
          api_key: "82b920a74292e4c71563b32812179f5a",
          language: "pt-BR",
        }
      })
      .then((response)=>{
        setFilme(response.data);
        setLoading(false);
      })
      .catch(()=>{
        toast.warn("FILME NÃO ENCONTRADO!");
        navigate("/", { replace: true });
        return;
      })
    }

    loadFilme();

    return () => {}
  }, [navigate, id]);

  function salvarFilme() {
    const minhaLista = localStorage.getItem("@primeflix");

    let filmeSalvos = JSON.parse(minhaLista) || [];

    const hasFilme = filmeSalvos.some((filmeSalvos) => filmeSalvos.id === filme.id);

    if (hasFilme) {
      toast.warn("Esse filme já esta na lista!");
      return;
    }

    filmeSalvos.push(filme);
    localStorage.setItem("@primeflix", JSON.stringify(filmeSalvos));
    toast.success("Filme salvo com sucesso!");

  }

  if(loading){
    return(
      <div className="filme-info">
        <h1>Carregando detalhes...</h1>
      </div>
    )
  }
  
  return(
    <div className="filme-info">
      <h1>{filme.title}</h1>
      <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title} />

      <h3>Sinopse</h3>
      <span>{filme.overview}</span>

      <strong>Avalição: {filme.vote_average} / 10</strong>

      <div className="area-buttons">
      <button onClick={salvarFilme}>Salvar</button>
      <button>
        <a href={`https://youtube.com/results?search_query=${filme.title} Trailer`} rel="external" target="blank">
          Trailer
        </a>
      </button>
      
      </div>

    </div>
  )
}

export default Filme;