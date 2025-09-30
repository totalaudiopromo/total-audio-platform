# Social Media Posting Schedule & Automation

# Social Media Content Automation System

## **UK Platform-Specific Timing Strategy**

### **LinkedIn (B2B Professional)**

- **Best Times**: Tuesday-Thursday, 8-10am and 12-2pm GMT
- **Peak UK Engagement**: 9am and 1pm GMT
- **Content Focus**: Professional insights, industry analysis, personal journey
- **Frequency**: 3 posts per week maximum

### **Twitter/X (Real-time Engagement)**

- **Best Times**: Monday-Friday, 9am-3pm GMT
- **Peak UK Engagement**: 12pm and 6pm GMT
- **Content Focus**: Quick tips, industry observations, threads
- **Frequency**: Daily posting, 1-3 tweets

### **Blue Sky (Tech-Early Adopters)**

- **Best Times**: Tuesday-Thursday, 10am-2pm GMT
- **Peak UK Engagement**: 11am and 7pm GMT
- **Content Focus**: Technical insights, product development
- **Frequency**: 4-5 posts per week

### **Threads (Meta Ecosystem)**

- **Best Times**: Wednesday-Friday, 7-9am and 1-3pm GMT
- **Peak UK Engagement**: 8am and 2pm GMT
- **Content Focus**: Cross-posted Twitter content, visual stories
- **Frequency**: 3-4 posts per week

---

# Weekly Posting Schedule

## **Monday - Industry Insight Day**

- **9:00am GMT**: LinkedIn professional post
- **12:00pm GMT**: Twitter industry tip
- **7:00pm GMT**: Blue Sky technical insight

## **Tuesday - Educational Content**

- **9:00am GMT**: Twitter thread (if scheduled)
- **11:00am GMT**: Blue Sky development update
- **1:00pm GMT**: LinkedIn article share

## **Wednesday - Personal Story Day**

- **8:00am GMT**: Threads personal update
- **9:00am GMT**: LinkedIn behind-scenes story
- **6:00pm GMT**: Twitter quick personal insight

## **Thursday - Product Demonstration**

- **10:00am GMT**: Blue Sky product feature
- **12:00pm GMT**: Twitter demo thread
- **2:00pm GMT**: Threads cross-post

## **Friday - Competitive Analysis**

- **9:00am GMT**: LinkedIn competitive positioning
- **11:00am GMT**: Blue Sky industry comparison
- **1:00pm GMT**: Twitter market insight

---

# Automation Requirements for Cursor

## **Database Integration**

- **Source**: Notion Social Media Content database
- **Trigger**: Status = "Scheduled" + Scheduled Date = Today
- **Action**: Auto-post to specified platforms
- **Update**: Status = "Posted" + Actual Engagement tracking

## **Platform API Requirements**

- **Twitter/X**: API v2 with Bearer Token
- **LinkedIn**: LinkedIn API with OAuth
- **Blue Sky**: AT Protocol API
- **Threads**: Meta Graph API

## **Content Formatting Rules**

- **UK Spelling**: Automated conversion (realise, colour, organisation)
- **No Emojis**: Strip all emoji characters before posting
- **Platform Optimisation**: Character limits, hashtag strategies
- **URL Tracking**: Append UTM parameters for analytics

## **Scheduling Logic**

```
IF Status = "Scheduled" AND Scheduled Date = Today AND Time = Platform Optimal
THEN Post to Platform(s)
AND Update Status = "Posted"
AND Log timestamp
```

## **Error Handling**

- **API Failures**: Retry 3 times, then mark "Failed"
- **Content Issues**: Log error, notify for manual review
- **Rate Limits**: Queue posts, respect platform limits

## **Analytics Integration**

- **Engagement Tracking**: Likes, comments, shares, clicks
- **Conversion Tracking**: UTM codes to [intel.totalaudiopromo.com](http://intel.totalaudiopromo.com)
- **Performance Analysis**: Update Notion with actual metrics
- **Beta Signup Attribution**: Track signups from social traffic

---

# Content Pipeline Automation

## **Weekly Content Generation**

- **Sunday**: Batch create week's content in Notion
- **Schedule Distribution**: Assign optimal times per platform
- **Quality Check**: UK spelling, no emojis, appropriate tone
- **CTA Integration**: Consistent "[intel.totalaudiopromo.com](http://intel.totalaudiopromo.com)" mentions

## **Performance Optimisation**

- **A/B Testing**: Different posting times for same content
- **Engagement Analysis**: Track best-performing content types
- **Platform Comparison**: Identify highest-converting platforms
- **Content Iteration**: Refine messaging based on results

**Goal**: Fully automated social media presence driving consistent beta signups with minimal manual intervention.