
import './App.css'
import Autocomplete from './components/autocomplete'

function App() {
  const staticData = [
    "Apple Pie",
    "Banana Bread",
    "Carrot Cake",
    "Doughnut",
    "Eclair",
    "Fruit Tart",
    "Gingerbread",
    "Honeycomb",
    "Ice Cream",
    "Jelly Roll"
  ];
  const fetchSuggestions= async (query)=>{
    const response= await fetch(
      ` https://dummyjson.com/recipes/search?q=${query}`
    );
    if(!response.ok){
      throw new Error("Network response was not ok");
    }
    const result= await response.json();
    return result.recipes;
  };

  return (
    <>
    <h1>Auto Suggestion Component</h1>
    <Autocomplete 
    placeholder={"Enter Recipe Name"}
    //staticData={staticData}
    fetchSuggestions={fetchSuggestions}
    dataKey={"name"}
    customLoading={<div>Loading...</div>}
    onSelect={(res) => console.log(res)}
    onChange={(input)=>{}}
    onBlur={(e)=>{}}
    onFocus={(e)=>{}}
    customStyles={{}}
    />
    </>
  )
}

export default App
