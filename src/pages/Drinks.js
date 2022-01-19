import React, { useContext, useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import tw from 'twin.macro';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FetchDrinkAPI from '../helpers/FetchDrinkAPI';
import ContextAPI from '../context/ContextAPI';
import RecipeCard from '../components/RecipeCard';
import CategoryButtons from '../components/CategoryButtons';
import '../components/RecipeCard.css';

const MainContainer = tw.main`
  w-screen
  h-screen
  flex
  flex-col
  content-center
  sm:w-5/6
  sm:mx-auto
`;

const CategoriesContainer = tw.div`
  w-full  
  fixed
  top-14
  flex
  justify-center
  sm:w-5/6
`;
const CardsContainer = tw.div`
  w-full
  flex
  flex-col
  mt-32
`;

const CardsDrinksDiv = tw.div`
  w-full
  h-full
  flex
  flex-wrap
  justify-evenly
  text-left

`;

export default function Drinks() {
  const { setDrinks, drinks, exploreDrinks,
    historyString, setHistoryString } = useContext(ContextAPI);
  const text = 'Drinks Recipes';
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setFilter] = useState('All');
  const MAX_CARDS = 12;
  const MAX_CATEGORIES = 5;

  useEffect(() => { // Setando os estados do context ao montar o componente
    FetchDrinkAPI().then((r) => {
      setDrinks(r.drinks.filter((_m, i) => i < MAX_CARDS));
    });
    FetchDrinkAPI('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
      .then((obj) => setCategories(obj.drinks.filter((_c, i) => i < MAX_CATEGORIES)));
  }, [setDrinks]);

  const handleFilterChange = (filter) => {
    setHistoryString('');
    if (filter !== categoryFilter && filter !== 'All') {
      setDrinks([]);
      const URI = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${filter}`;
      setFilter(filter);
      FetchDrinkAPI(URI)
        .then((resp) => setDrinks(resp.drinks.filter((_r, i) => i < MAX_CARDS)));
    } else {
      setDrinks([]);
      setFilter('All');
      FetchDrinkAPI().then((r) => {
        setDrinks(r.drinks.filter((_m, i) => i < MAX_CARDS));
      });
    }
  };

  function whatToRender() {
    console.log(document.referrer);
    return historyString.includes('/explorar/bebidas/ingredientes')
      ? exploreDrinks.map((drink, index) => (
        <RecipeCard
          recipe={ drink }
          key={ `${drink.idDrink}${index}` }
          index={ index }
          place="main"
        />))
      : (
        drinks.map((drink, index) => (
          <RecipeCard
            recipe={ drink }
            key={ drink.idDrink }
            index={ index }
            place="main"
          />))
      );
  }

  return (
    <MainContainer>
      <Header text={ text } />
      <CategoriesContainer>
        {
          categories.length > 0
            ? ( // Cria um container para os botões de categoria, o botão "TODOS" e mapeia as categorias de acordo com o retorno da API
              <CategoryButtons
                handleFilterChange={ handleFilterChange }
                categories={ categories }
                filter={ categoryFilter }
              />
            )
            : (
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>)
        }
      </CategoriesContainer>
      <CardsContainer>
        <CardsDrinksDiv>
          {
            drinks.length > 0
              ? whatToRender() : (
                <ReactLoading
                  type="spinningBubbles"
                  color="cyan"
                  height={ 30 }
                  width={ 30 }
                />)
          }
        </CardsDrinksDiv>
        <div className="w-full h-16" />
      </CardsContainer>
      <Footer />
    </MainContainer>
  );
}
