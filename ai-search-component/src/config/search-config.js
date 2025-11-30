// Configuration schema for AI-powered doc search
export const createSearchConfig = ({
  // Product/Topic Information
  productName,
  productDescription,
  topicKeywords = [],
  
  // Data Source Configuration
  documentationData = null,
  searchAPI = null,
  dataKey = 'title',
  
  // AI Configuration
  aiEnabled = true,
  aiProvider = 'openai',
  aiAPIKey = null,
  aiEndpoint = null,
  aiModel = 'gpt-3.5-turbo',
  systemPrompt = null,
  
  // Topic Validation
  strictMode = true,
  allowedTopics = [],
  blockedKeywords = [],
  
  // UI Configuration
  placeholder = 'Search documentation...',
  noResultsMessage = 'No results found',
  aiButtonText = 'Find answer with AI',
  maxSuggestions = 10,
  minQueryLength = 2,
  
  // Callbacks
  onSearch = () => {},
  onAISearch = () => {},
  onSelect = () => {},
  
  // Styling
  customStyles = {},
  theme = 'dark',
}) => {
  return {
    productName,
    productDescription,
    topicKeywords,
    documentationData,
    searchAPI,
    dataKey,
    aiEnabled,
    aiProvider,
    aiAPIKey,
    aiEndpoint,
    aiModel,
    systemPrompt: systemPrompt || `You are a helpful assistant for ${productName}. ${productDescription}. Only answer questions related to ${productName}. If a question is off-topic, politely redirect the user to relevant documentation topics.`,
    strictMode,
    allowedTopics: [...topicKeywords, ...allowedTopics],
    blockedKeywords,
    placeholder,
    noResultsMessage,
    aiButtonText,
    maxSuggestions,
    minQueryLength,
    onSearch,
    onAISearch,
    onSelect,
    customStyles,
    theme,
  };
};
