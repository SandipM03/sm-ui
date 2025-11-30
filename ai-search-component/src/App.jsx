
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
  const TOPIC = "Advanced Documentation System (ADS) features and configurations";
  const myProductDocs = [
  { id: 1, category: "GET STARTED", title: "Getting Started with ADS v3.0", content: "Installation steps are simple. Run 'npm install ads-cli' and configure the 'entrypoint.json' file for initial setup.", url: "/docs/getting-started" },
  { id: 2, category: "GET STARTED", title: "Configuring the API Gateway", content: "The gateway handles all inbound traffic. To configure rate limiting, set the 'rateLimit' property to a positive integer in the 'gateway-config.yaml'.", url: "/docs/api-gateway" },
  { id: 3, category: "TROUBLESHOOTING", title: "Troubleshooting Authentication Errors", content: "If you receive a 401 Unauthorized error, check the 'auth_service_log' for missing token details or expired credentials. Ensure your system clock is synchronized.", url: "/docs/troubleshooting-auth" },
  { id: 4, category: "BASICS", title: "Data Backup and Recovery Procedures", content: "Daily backups are stored in the 'ads-storage-bucket'. Recovery is initiated using the 'ads-restore --latest' command.", url: "/docs/backup-recovery" },
  { id: 5, category: "BASICS", title: "Using the Command Line Interface (CLI)", content: "The CLI provides access to all core features. Use 'ads help' to see a list of available commands and parameters.", url: "/docs/cli" },
  { id: 6, category: "ADVANCED", title: "ADS Configuration Best Practices", content: "Learn how to optimize your ADS configuration for performance and security. Set proper timeouts, enable caching, and configure load balancing.", url: "/docs/config-best-practices" },
  { id: 7, category: "ADVANCED", title: "ADS Performance Tuning", content: "Optimize ADS performance by adjusting thread pools, connection limits, and memory allocation. Monitor metrics using the built-in dashboard.", url: "/docs/performance" },
  { id: 8, category: "API REFERENCE", title: "ADS REST API Documentation", content: "Complete REST API reference for ADS including all endpoints, request/response formats, authentication, and rate limiting details.", url: "/docs/api-reference" },
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
  productName: 'Advanced Documentation System (ADS)',
  productDescription: 'Enterprise documentation platform with advanced features and configurations',
  topicKeywords: [
    'ADS', 'Advanced Documentation System', 'documentation',
    'configuration', 'API gateway', 'CLI', 'command line',
    'authentication', 'backup', 'recovery', 'installation',
    'setup', 'troubleshooting', 'performance', 'tuning',
    'REST API', 'endpoint', 'rate limiting'
  ],
  allowedTopics: [
    'installation', 'setup', 'configuration', 'API', 'gateway',
    'authentication', 'backup', 'recovery', 'CLI', 'command',
    'troubleshooting', 'error', 'performance', 'tuning',
    'REST', 'endpoint', 'rate limit', 'ADS'
  ],
  blockedKeywords: [
    'recipe', 'cooking', 'food', 'weather', 'sports',
    'movie', 'music', 'game', 'shopping', 'travel'
  ],
  documentationData: myProductDocs,
  dataKey: 'title',
  strictMode: true,
  aiEnabled: true,
  aiProvider: 'Google Gemini',
  aiModel: 'gemini-1.5-flash',
  placeholder: 'Search ADS documentation...',
  noResultsMessage: 'No documentation found',
  aiButtonText: 'Ask AI about ADS',
  onSelect: (item) => {
    console.log('Selected documentation:', item);
    // Navigate to the doc page
    // window.location.href = item.url;
  },
  onAISearch: (query) => {
    console.log('AI Search triggered for:', query);
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
