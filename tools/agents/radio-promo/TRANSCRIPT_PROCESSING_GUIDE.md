# Transcript Processing Guide - Liberty Music PR

## **Quick Start**

### 1. **Scan Your Downloads Folder**

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/radio-promo
node test-otter-downloads.js
```

This will:

- Scan your Downloads folder for Otter.ai files
- Process all found files for training data
- Save results to `./training-data/`

### 2. **Process Individual Files**

```bash
# Process a specific Otter.ai file from Downloads
node radio-promo-agent.js process-transcript downloads:your-file-name.txt

# Process with complete workflow
node radio-promo-agent.js personal-workflow downloads:your-file-name.txt
```

## **Supported Transcript Sources**

### **Otter.ai Downloads** (Your Current Files)

```bash
downloads:filename.txt
```

- Looks in your Downloads folder
- Automatically adds .txt extension if needed
- Perfect for your existing Otter.ai files

### **Google Gemini** (Future Use)

```bash
gemini:transcript-id
```

- For future Google Meet transcripts
- Will integrate with Gemini API
- Currently placeholder implementation

### **Otter.ai API** (If You Have Access)

```bash
otter:transcript-id
```

- Direct API access to Otter.ai
- Requires API key setup

### **Typeform Responses**

```bash
typeform:form-id:response-id
```

- Client intake forms
- Campaign brief submissions

### **Local Files**

```bash
/path/to/your/file.txt
```

- Any local transcript file
- Google Meet exports
- Other transcript sources

## **Usage Examples**

### **Process Single File**

```bash
# Process an Otter.ai download
node radio-promo-agent.js process-transcript downloads:meeting-with-sarah-jones.txt

# Process a local file
node radio-promo-agent.js process-transcript /path/to/transcript.txt
```

### **Complete Workflow**

```bash
# Full campaign creation from transcript
node radio-promo-agent.js personal-workflow downloads:artist-meeting.txt
```

### **Scan All Downloads**

```bash
# Process all Otter.ai files in Downloads
node radio-promo-agent.js scan-downloads
```

## **What Gets Extracted**

The agent looks for:

- **Artist Name**: "The artist is..." or "Artist: ..."
- **Track Title**: "Track title is..." or "Title: ..."
- **Genre**: "It's a pop track" or "Genre: ..."
- **Release Date**: "Release date is..." or "Looking at..."
- **Budget**: "Budget is..." or "Around £..."
- **Targets**: "Want to target..." or "Focus on..."
- **Priority**: "This is high priority" or "Urgent"
- **Deadline**: "Deadline is..." or "Need by..."

## **Training Data**

When you run `scan-downloads`, it creates:

- `./training-data/otter_training_TIMESTAMP.json`
- Contains all processed campaign briefs
- Shows extraction confidence scores
- Lists any processing errors

## **Next Steps**

1. **Run the scan**: `node test-otter-downloads.js`
2. **Review results**: Check the training data file
3. **Test individual files**: Use specific filenames
4. **Set up Gemini**: For future Google Meet transcripts
5. **Create campaigns**: Use `personal-workflow` command

## **Troubleshooting**

### **File Not Found**

- Check filename spelling
- Ensure file is in Downloads folder
- Try with/without .txt extension

### **Low Confidence Scores**

- Transcript might not contain clear campaign info
- Check extraction patterns in the code
- Manual review of transcript content

### **Processing Errors**

- Check file format (should be .txt)
- Verify file permissions
- Check for special characters in filename

## **File Naming Tips**

For best results, name your Otter.ai files:

- `meeting-with-sarah-jones.txt`
- `artist-campaign-brief.txt`
- `radio-promo-discussion.txt`

The agent will find files containing:

- "otter"
- "transcript"
- Any .txt files

## **Ready to Go!**

Your Otter.ai files are ready to be processed for training. The agent will learn from your existing transcripts and help create better campaigns in the future.

Run `node test-otter-downloads.js` to get started!
