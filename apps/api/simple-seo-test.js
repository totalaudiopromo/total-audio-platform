const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Free SEO Tools API is running!', timestamp: new Date().toISOString() });
});

// Google Suggest API - Working!
app.get('/api/keywords/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const response = await axios.get('https://suggestqueries.google.com/complete/search', {
      params: {
        client: 'firefox',
        q: query
      }
    });

    const suggestions = response.data[1] || [];
    
    res.json({
      success: true,
      query,
      suggestions,
      count: suggestions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Question-based keywords - Working!
app.get('/api/questions/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'which', 'who'];
    const questions = [];
    
    for (const questionWord of questionWords) {
      try {
        const response = await axios.get('https://suggestqueries.google.com/complete/search', {
          params: {
            client: 'firefox',
            q: `${questionWord} ${keyword}`
          }
        });
        
        const suggestions = response.data[1] || [];
        questions.push(...suggestions.slice(0, 2));
      } catch (error) {
        console.error(`Failed to get suggestions for "${questionWord} ${keyword}"`);
      }
    }
    
    res.json({
      success: true,
      keyword,
      questions: questions.slice(0, 10),
      count: questions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Long-tail variations - Working!
app.get('/api/longtail/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const modifiers = ['best', 'top', 'guide', 'review', '2024', 'free', 'online', 'services', 'companies'];
    const variations = [];
    
    for (const modifier of modifiers) {
      variations.push(`${keyword} ${modifier}`);
      variations.push(`${modifier} ${keyword}`);
    }
    
    res.json({
      success: true,
      keyword,
      variations,
      count: variations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Comprehensive keyword research
app.get('/api/research/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    
    // Get basic suggestions
    const suggestionsResponse = await axios.get('https://suggestqueries.google.com/complete/search', {
      params: {
        client: 'firefox',
        q: keyword
      }
    });
    
    const suggestions = suggestionsResponse.data[1] || [];
    
    // Get question-based keywords
    const questionWords = ['what', 'how', 'why'];
    const questions = [];
    
    for (const questionWord of questionWords) {
      try {
        const response = await axios.get('https://suggestqueries.google.com/complete/search', {
          params: {
            client: 'firefox',
            q: `${questionWord} ${keyword}`
          }
        });
        
        const questionSuggestions = response.data[1] || [];
        questions.push(...questionSuggestions.slice(0, 2));
      } catch (error) {
        // Continue with other questions
      }
    }
    
    // Generate long-tail variations
    const modifiers = ['best', 'top', 'guide', 'review', '2024', 'free', 'online'];
    const longTailVariations = [];
    
    for (const modifier of modifiers) {
      longTailVariations.push(`${keyword} ${modifier}`);
      longTailVariations.push(`${modifier} ${keyword}`);
    }
    
    // Combine all results
    const allKeywords = [keyword, ...suggestions, ...questions, ...longTailVariations];
    const uniqueKeywords = [...new Set(allKeywords)];
    
    res.json({
      success: true,
      seedKeyword: keyword,
      data: {
        suggestions: suggestions.slice(0, 10),
        questions: questions.slice(0, 10),
        longTailVariations: longTailVariations.slice(0, 10),
        allKeywords: uniqueKeywords.slice(0, 20)
      },
      summary: {
        totalSuggestions: suggestions.length,
        totalQuestions: questions.length,
        totalLongTail: longTailVariations.length,
        totalUnique: uniqueKeywords.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Free SEO Tools API is healthy',
    timestamp: new Date().toISOString(),
    features: [
      'Google Suggest Integration',
      'Question-based Keywords',
      'Long-tail Variations',
      'Comprehensive Keyword Research'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Free SEO Tools API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Test keywords: http://localhost:${PORT}/api/keywords/music%20promotion`);
  console.log(`❓ Test questions: http://localhost:${PORT}/api/questions/music%20promotion`);
  console.log(`📈 Test research: http://localhost:${PORT}/api/research/music%20promotion`);
}); 