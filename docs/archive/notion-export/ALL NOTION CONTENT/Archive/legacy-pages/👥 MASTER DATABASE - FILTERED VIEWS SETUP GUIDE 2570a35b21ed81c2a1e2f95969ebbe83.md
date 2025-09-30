# 👥 MASTER DATABASE - FILTERED VIEWS SETUP GUIDE

*How to create smart filtered views for different contexts*

## 📊 DATABASE LOCATION

[📊 Total Audio Master Database](%F0%9F%93%8A%20TOTAL%20AUDIO%20MASTER%20DATABASE%20a6062ff781624533bc91ebcd1435481c.md)

---

## 🎨 RECOMMENDED FILTERED VIEWS

### **1. 🚀 Sprint Week View**

**Purpose:** Only current sprint priorities

**Filter:** Sprint Week = Checked ✓

**Sort:** Priority (High to Low), then Last Updated

**Properties to Show:** Name, Tool, Status, Priority, Original Page

### **2. 🔵 Audio Intel View**

**Purpose:** Everything related to main product

**Filter:** Tool = Audio Intel

**Sort:** Status (Active first), then Priority

**Properties to Show:** Name, Type, Status, Priority, Last Updated, Original Page

### **3. 🔴 High Priority View**

**Purpose:** Critical tasks across all tools

**Filter:** Priority = High AND Status ≠ Archived

**Sort:** Last Updated (newest first)

**Properties to Show:** Name, Tool, Type, Status, Sprint Week, Original Page

### **4. 🟡 In Progress View**

**Purpose:** Active development items

**Filter:** Status = In Progress OR Status = Active

**Sort:** Priority, then Tool

**Properties to Show:** Name, Tool, Type, Priority, Last Updated, Original Page

### **5. 🟣 Product Development View**

**Purpose:** All development-related content

**Filter:** Type = Product Development OR Type = Technical/Development

**Sort:** Tool, then Priority

**Properties to Show:** Name, Tool, Status, Priority, Sprint Week, Original Page

### **6. 🟡 Content & Marketing View**

**Purpose:** Content strategy and marketing materials

**Filter:** Type = Content & Marketing

**Sort:** Status, then Last Updated

**Properties to Show:** Name, Tool, Status, Priority, Original Page

### **7. 🔴 Archive View**

**Purpose:** Completed and historical content

**Filter:** Status = Archived OR Type = Archive

**Sort:** Last Updated (oldest first)

**Properties to Show:** Name, Tool, Type, Last Updated, Original Page

---

## 🔧 HOW TO CREATE VIEWS

### **Step 1:** Open the Master Database

Click on [📊 Total Audio Master Database](%F0%9F%93%8A%20TOTAL%20AUDIO%20MASTER%20DATABASE%20a6062ff781624533bc91ebcd1435481c.md)

### **Step 2:** Create New View

1. Click the "+ Add a view" button at the top
2. Choose "Table" view type
3. Name it according to the recommendations above

### **Step 3:** Set Up Filters

1. Click "Filter" in the view options
2. Add the filter conditions specified for each view
3. Use "AND" for multiple conditions

### **Step 4:** Configure Sort Order

1. Click "Sort" in the view options
2. Add sort criteria as specified
3. Primary sort first, secondary sort second

### **Step 5:** Choose Properties

1. Click "Properties" in the view options
2. Show/hide columns according to the recommendations
3. Reorder columns for best mobile experience

---

## 📱 MOBILE OPTIMIZATION TIPS

### **Best Properties for Mobile:**

- **Always show:** Name, Original Page
- **Priority views:** Tool, Status, Priority
- **Hide on mobile:** Type, Last Updated (unless specifically needed)

### **Column Order for Mobile:**

1. Name (most important)
2. Tool (colour coding helps scanning)
3. Status (quick status check)
4. Priority (urgency indicator)
5. Original Page (direct access)

---

## 🎯 USAGE RECOMMENDATIONS

### **Daily Workflow:**

1. **Morning:** Check Sprint Week View for today's priorities
2. **Development:** Use Audio Intel View for focused work
3. **Planning:** Use High Priority View for next actions
4. **Review:** Use In Progress View to track active items

### **Weekly Workflow:**

1. **Monday:** Sprint Week View setup
2. **Mid-week:** Product Development View for technical progress
3. **Friday:** Archive View cleanup and Content View planning

### **Mobile Usage:**

- **Quick checks:** Sprint Week View
- **Deep work:** Audio Intel View
- **Planning:** High Priority View

---

## ✅ BENEFITS OF THIS SYSTEM

### **Single Source of Truth:**

✓ All content accessible from one location

✓ Consistent colour coding across views

✓ Direct links to original pages preserved

### **Context Switching:**

✓ Sprint Week focus when needed

✓ Tool-specific views for deep work

✓ Priority-based views for planning

### **Command Centre Safety:**

✓ Original page URLs unchanged

✓ Integrations continue working

✓ Database provides navigation layer only

---

*Once views are set up, bookmark the most used ones for quick mobile access*