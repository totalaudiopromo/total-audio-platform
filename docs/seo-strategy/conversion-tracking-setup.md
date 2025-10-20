# Audio Intel Conversion Tracking Implementation

## Google Tag Manager Configuration

### Current Status
 GTM Container: GTM-WZNJWDKH already implemented

### Required Custom Events (Add to GTM)

#### 1. Email Signup Conversion
```javascript
// Trigger: Form submission
gtag('event', 'conversion', {
  'send_to': 'AW-CONVERSION_ID/EMAIL_SIGNUP',
  'value': 1.0,
  'currency': 'GBP',
  'event_category': 'Lead Generation',
  'event_label': 'Email Signup'
});
```

#### 2. Demo Request (High Value)
```javascript
// Trigger: Demo booking confirmation
gtag('event', 'conversion', {
  'send_to': 'AW-CONVERSION_ID/DEMO_REQUEST',
  'value': 50.0,  // Estimated lead value
  'currency': 'GBP',
  'event_category': 'High Intent Lead',
  'event_label': 'Demo Request'
});
```

#### 3. Pricing Page Visit
```javascript
// Trigger: Pricing page view
gtag('event', 'page_view', {
  'page_title': 'Audio Intel Pricing',
  'page_location': window.location.href,
  'event_category': 'High Intent',
  'event_label': 'Pricing Interest'
});
```

#### 4. Contact Sample Download
```javascript
// Trigger: Sample download
gtag('event', 'conversion', {
  'send_to': 'AW-CONVERSION_ID/SAMPLE_DOWNLOAD',
  'value': 10.0,
  'currency': 'GBP',
  'event_category': 'Product Interest',
  'event_label': 'Contact Sample'
});
```

## Meta Pixel Integration
Add Facebook Pixel alongside GTM for retargeting:

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

## Implementation Steps

### Step 1: Google Ads Account Setup
1. Create Google Ads account
2. Link to Google Analytics (if not already)
3. Import conversion actions from GTM
4. Set up enhanced conversions

### Step 2: GTM Event Setup
1. Create custom HTML tags for each conversion
2. Set up triggers based on user actions
3. Test in GTM preview mode
4. Publish container updates

### Step 3: Value Assignment
- Email Signup: £1 (volume metric)
- Demo Request: £50 (high intent)
- Pricing View: £5 (interest signal)
- Sample Download: £10 (product trial)