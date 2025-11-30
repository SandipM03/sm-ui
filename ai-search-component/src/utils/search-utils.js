// Topic validation utility
export const validateTopicRelevance = (query, config) => {
  const lowerQuery = query.toLowerCase();
  
  // Check blocked keywords first
  if (config.blockedKeywords && config.blockedKeywords.length > 0) {
    const hasBlockedKeyword = config.blockedKeywords.some(keyword => 
      lowerQuery.includes(keyword.toLowerCase())
    );
    if (hasBlockedKeyword) {
      return {
        isValid: false,
        reason: 'off-topic',
        message: `This query appears to be off-topic. Please search for topics related to ${config.productName}.`
      };
    }
  }
  
  // In strict mode, query must contain at least one allowed topic keyword
  if (config.strictMode && config.allowedTopics && config.allowedTopics.length > 0) {
    const hasAllowedTopic = config.allowedTopics.some(topic => 
      lowerQuery.includes(topic.toLowerCase())
    );
    
    if (!hasAllowedTopic) {
      return {
        isValid: false,
        reason: 'not-found',
        message: `No results found. Try searching for: ${config.allowedTopics.slice(0, 5).join(', ')}`,
        suggestedTopics: config.allowedTopics.slice(0, 10)
      };
    }
  }
  
  return {
    isValid: true,
    message: 'Query is valid'
  };
};

// AI Query validator
export const validateAIQuery = (query, config) => {
  if (query.trim().length < config.minQueryLength) {
    return {
      isValid: false,
      message: `Query too short. Please enter at least ${config.minQueryLength} characters.`
    };
  }
  
  const validation = validateTopicRelevance(query, config);
  
  if (!validation.isValid && config.strictMode) {
    return {
      isValid: false,
      message: validation.message,
      suggestedTopics: validation.suggestedTopics
    };
  }
  
  return {
    isValid: true,
    message: 'Query is valid for AI processing'
  };
};

// Search through documentation data
export const searchDocumentation = (query, documentation, dataKey = 'title', maxResults = 10) => {
  if (!documentation || documentation.length === 0) {
    return [];
  }
  
  const lowerQuery = query.toLowerCase();
  
  const scoredResults = documentation
    .map(doc => {
      const searchText = typeof doc === 'string' ? doc : (doc[dataKey] || '');
      const lowerText = searchText.toLowerCase();
      
      let score = 0;
      
      if (lowerText === lowerQuery) score += 100;
      if (lowerText.startsWith(lowerQuery)) score += 50;
      if (lowerText.includes(lowerQuery)) score += 25;
      
      const words = lowerQuery.split(' ');
      words.forEach(word => {
        if (lowerText.includes(word)) score += 10;
      });
      
      return { doc, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(result => result.doc);
  
  return scoredResults;
};

// Format AI prompt with context
export const buildAIPrompt = (query, config, documentationContext = []) => {
  const contextText = documentationContext.length > 0
    ? `\n\nRelevant documentation sections:\n${documentationContext.map((doc, i) => 
        `${i + 1}. ${typeof doc === 'string' ? doc : doc.title || doc.name || JSON.stringify(doc)}`
      ).join('\n')}`
    : '';
  
  return {
    systemPrompt: config.systemPrompt,
    userPrompt: `User question: "${query}"${contextText}\n\nPlease provide a helpful answer based on the ${config.productName} documentation. If the question is off-topic, politely redirect the user.`
  };
};
