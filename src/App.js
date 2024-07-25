import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import YouTube from 'react-youtube';


function App() {
  const API_URL = 'https://api.themoviedb.org/3';
  const API_KEY = '2e39013dd72cd3fda4e1990e4ba24cbb';
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original';
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original';

  //VARIABLES DE ESTADO
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState( { title: "Loading Movies" } );
  const [playing, setPlaying] = useState(false);

  //FUNCION PARA REALIZAR PETICION POR GET A LA API
  const fetchMovies= async(searchKey)=>{
    const type = searchKey ? "search" : "discover"
    const {data: { results },
  } = await axios.get(`${API_URL}/${type}/movie`, {
    params: {
      api_key: API_KEY,
      query: searchKey,
    },
  });

  setMovies(results);
  setMovie(results[0]);

  if(results.length){
    await fetchMovie(results[0].id);
  }

  }

  

  //FUNCION PARA LA PETICION DE UN SOLO OBJETO O PELICULA Y MOSTRAR EN REPRODUCTOR DE VIDEO
  const fetchMovie = async(id)=>{
    const {data} = await axios.get(`${API_URL}/movie/${id}`, {
      params:{
        api_key: API_KEY,
        append_to_response: "videos"
      }
    })

    if(data.videos && data.videos.results){
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0])
    }
    setMovie(data)
  }

  const selectMovie = async(movie)=>{
    fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0,0);
  }

  //FUNCION PARA BUSCAR PELICULAS
  const searchMovies=(e)=>{
    e.preventDefault();
    fetchMovies(searchKey);
  }

  useEffect(() => {
    fetchMovies()
  }, [])
  
  
   return (
    <div className="App">
      <h2 className='text-center mt-5 mb-5 text-light'>Trailer Movies</h2>
      {/* buscador de peliculas */}
      <form className='container mb-4 search' onSubmit={searchMovies}>
        <input type='text' placeholder='search' onChange={(e)=>setSearchKey(e.target.value)}></input>
        <button className=''>Search</button>
      </form>

      {/*aqui va todo el contenedor del banner y del reproductor de video*/}

      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url("${IMAGE_PATH}${movie.backdrop_path}")`,
                
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton mt-4"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.release_date}</p>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>


      <div className='container my-5'>
        <div className='grid-movies'>
          {movies.map((movie)=>(
            <div key={movie.id} className='card-movie' onClick={()=> selectMovie(movie)}>
              <div className=''>
                <img className='img-movie' src={`${URL_IMAGE + movie.poster_path}`} height={500} width="100%"></img>
                <h4 className='text-center mt-2 text-light'>{movie.title}</h4>
                <h6 className='text-center mt-2 text-light'>Release Date {movie.release_date}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
