
import './App.css'
import AISearchBar from './components/ai-search-bar';
import Autocomplete from './components/autocomplete'
import { createSearchConfig } from './config/search-config';
function App() {
  // const staticData = [
  //   "Apple Pie",
  //   "Banana Bread",
  //   "Carrot Cake",
  //   "Doughnut",
  //   "Eclair",
  //   "Fruit Tart",
  //   "Gingerbread",
  //   "Honeycomb",
  //   "Ice Cream",
  //   "Jelly Roll"
  // ];
  const myProductDocs = [
  { id: 1, title: 'Getting Started', url: '/docs/start' },
  { id: 2, title: 'API Reference', url: '/docs/api' },
  // ... your documentation
];
  // const fetchSuggestions= async (query)=>{
  //   const response= await fetch(
  //     ` https://dummyjson.com/recipes/search?q=${query}`
  //   );
  //   if(!response.ok){
  //     throw new Error("Network response was not ok");
  //   }
  //   const result= await response.json();
  //   return result.recipes;
  // };
  const config = createSearchConfig({
  productName: 'Your Product Name',
  productDescription: 'What your product does',
  topicKeywords: ['your', 'product', 'keywords'],
  documentationData: myProductDocs,
  dataKey: 'title',
  blockedKeywords: ['off-topic', 'words'],
  strictMode: true,
  aiEnabled: true,
  placeholder: 'Search your docs...',
  onSelect: (item) => {
    // Navigate to the doc
    window.location.href = item.url;
  }
});
  return (
    <>
    <h1>Auto Suggestion Component</h1>
    {/* <Autocomplete 
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
    /> */}
    <AISearchBar
    config={config}
    />
    </>
  )
}

export default App
