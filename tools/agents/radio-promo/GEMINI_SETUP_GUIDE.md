# Google Gemini API Setup Guide - Liberty Music PR

## 🎯 **What This Does**

Google Gemini integration processes your Google Meet transcripts to extract campaign information automatically. It uses AI to understand your conversations and pull out:

- Artist names
- Track titles
- Genres
- Release dates
- Budgets
- Target radio stations
- Priority levels
- Deadlines

## 🔧 **Setup Steps**

### 1. **Get Google Gemini API Key**

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Click "Create API Key"
5. Copy the API key (starts with `AIza...`)

### 2. **Add to Environment Variables**

Add this to your `.env` file:

```bash
# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. **Test the Integration**

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/radio-promo
node test-gemini.js
```

## 🚀 **Usage**

### **Process Gemini Transcript**
```bash
# Process a specific Gemini transcript
node radio-promo-agent.js process-transcript gemini:transcript-id-123

# Complete workflow with Gemini transcript
node radio-promo-agent.js personal-workflow gemini:transcript-id-123
```

### **What Happens**
1. **Transcript Processing**: Gemini analyzes the transcript content
2. **Data Extraction**: Pulls out campaign information using AI
3. **Campaign Creation**: Creates Monday.com campaign
4. **Press Release**: Generates Liberty-style press release
5. **Team Intelligence**: Gathers insights from Google Chat

## 📊 **How It Works**

### **Transcript Analysis**
Gemini uses natural language processing to understand:
- "The artist is Sarah Jones" → `artistName: "Sarah Jones"`
- "Track title is 'Electric Dreams'" → `trackTitle: "Electric Dreams"`
- "It's a pop track" → `genre: "pop"`
- "Release date is February 1st" → `releaseDate: "2025-02-01"`

### **AI-Powered Extraction**
- Understands context and conversation flow
- Handles different ways of expressing the same information
- Learns from your conversation patterns
- Improves accuracy over time

## 🔍 **Testing**

### **Test API Connection**
```bash
node test-gemini.js
```

### **Test Transcript Processing**
```bash
# Test with a sample transcript ID
node radio-promo-agent.js process-transcript gemini:test-transcript-123
```

## 📝 **Example Workflow**

1. **Record Google Meet** with artist
2. **Get transcript** from Google Meet
3. **Process with Gemini**:
   ```bash
   node radio-promo-agent.js personal-workflow gemini:meeting-transcript-456
   ```
4. **Review extracted data** in the campaign brief
5. **Approve Monday.com campaign** creation
6. **Generate press release** automatically

## 🎯 **Benefits**

- **Faster Processing**: No manual data entry
- **Better Accuracy**: AI understands context
- **Consistent Format**: Standardized campaign briefs
- **Time Saving**: Automates the boring stuff
- **Learning**: Gets better with each transcript

## 🔧 **Troubleshooting**

### **API Key Issues**
- Check the key is correct in `.env`
- Ensure it starts with `AIza...`
- Verify it's active in Google AI Studio

### **Transcript Not Found**
- Check the transcript ID is correct
- Ensure the transcript exists in your Google account
- Verify you have access to the transcript

### **Low Extraction Quality**
- Check transcript quality (clear audio, good transcription)
- Review the conversation content
- Ensure campaign details are mentioned clearly

## 📚 **API Limits**

- **Free Tier**: 15 requests per minute
- **Paid Tier**: Higher limits available
- **Rate Limiting**: Built into the integration

## 🎉 **Ready to Go!**

Once you have your Gemini API key set up:

1. **Test the connection**: `node test-gemini.js`
2. **Process a transcript**: `node radio-promo-agent.js process-transcript gemini:your-transcript-id`
3. **Run complete workflow**: `node radio-promo-agent.js personal-workflow gemini:your-transcript-id`

Your Google Meet transcripts will now be automatically processed into campaign briefs!
