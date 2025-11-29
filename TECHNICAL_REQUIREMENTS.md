# Technical Requirements Documentation
## NJ Lottery Tool - Hudson Mart

**Last Updated:** Based on analysis of `index.html`  
**Application Type:** Single-Page Application (SPA)  
**Architecture:** Client-side only, no backend required

---

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Core Functionality](#core-functionality)
3. [Data Management](#data-management)
4. [User Interface Components](#user-interface-components)
5. [Business Logic](#business-logic)
6. [Validation & Error Handling](#validation--error-handling)
7. [Export/Import Features](#exportimport-features)
8. [Browser Requirements](#browser-requirements)
9. [Dependencies](#dependencies)
10. [Data Structures](#data-structures)
11. [Key Algorithms](#key-algorithms)
12. [UI/UX Features](#uiux-features)

---

## Technology Stack

### Frontend Framework
- **Framework:** Vanilla JavaScript (ES6+)
- **No Framework Dependencies:** Pure JavaScript implementation
- **DOM Manipulation:** Native JavaScript DOM APIs

### CSS Framework
- **Primary Framework:** Tailwind CSS v3.x (via CDN)
- **Custom Styles:** Inline `<style>` block for modal animations and custom classes
- **Responsive Design:** Mobile-first approach using Tailwind breakpoints

### External Libraries (CDN)
1. **Tailwind CSS**
   - CDN: `https://cdn.tailwindcss.com`
   - Purpose: Utility-first CSS framework for styling
   - Version: Latest (CDN)

2. **jsPDF**
   - CDN: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
   - Version: 2.5.1
   - Purpose: PDF document generation

3. **jsPDF AutoTable Plugin**
   - CDN: `https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js`
   - Version: 3.5.23
   - Purpose: Table generation within PDF documents

### HTML Standards
- **HTML Version:** HTML5
- **Character Encoding:** UTF-8
- **Viewport:** Responsive meta tag configured
- **Language:** English (en)

---

## Core Functionality

### 1. Two-Shift System
- **Shift A (Morning):** Morning shift data entry and calculations
- **Shift B (Evening):** Evening shift data entry and calculations
- Each shift tracks:
  - Employee name
  - Online sales
  - Online cashes (negative values)
  - Instant cashes (negative values)
  - Actual cash collected
  - Scratch-off ticket sales and calculations

### 2. Ticket Management
- **Ticket Configuration:**
  - Ticket name
  - Price per ticket
  - Book size (total tickets per book)
  - Initial/previous number tracking
  
- **Default Ticket Set:** 28 pre-configured tickets (IDs 0-27)
  - Price range: $1 to $30
  - Book sizes: 20 to 200 tickets

### 3. Daily Report Generation
- Calculates totals for each shift
- Generates consolidated PDF reports
- Tracks pending reports for batch PDF generation
- Supports editing existing reports

### 4. Employee Management
- Add/remove employees
- Autocomplete functionality for employee names
- Persistent storage in localStorage

---

## Data Management

### Storage Mechanism
- **Primary Storage:** Browser localStorage
- **Storage Keys:**
  - `lotteryTicketConfig`: Ticket configuration data
  - `lotteryTicketState`: Current state of ticket numbers
  - `lotteryDailyReports`: Array of saved daily reports
  - `lotteryEmployees`: Array of employee names

### Data Persistence
- All data persists in browser localStorage
- No server-side storage required
- Data survives page refreshes
- Data cleared only via explicit "Clear All Data" action

### Export/Import Functionality
- **Export Format:** JSON file
- **Export Filename:** `lottery_session_YYYY-MM-DD.json`
- **Import:** Validates JSON structure before importing
- **Import Behavior:** Overwrites all existing data (with confirmation)

### Data Integrity
- Automatic validation when ticket configuration changes
- State reset if configuration length doesn't match state length
- Data validation on import

---

## User Interface Components

### 1. Header Section
- **Components:**
  - NJ Lottery logo (external image)
  - Store name: "Hudson Mart"
  - Store address: "104 Washington Street, Hoboken NJ"
  - Settings button

### 2. Date Input
- HTML5 date picker
- Defaults to current date
- Auto-increments after saving a day

### 3. Shift Input Sections
- **Shift A Panel:**
  - Person name input (with autocomplete)
  - Machine report inputs (Online Sales, Online Cashes, Instant Cashes)
  - Reckoning summary (calculated values)
  - Actual cash input
  - Difference display (color-coded)

- **Shift B Panel:**
  - Same structure as Shift A
  - Independent calculations

### 4. Reports & Sessions Panel
- **Features:**
  - Pending reports list (scrollable)
  - Load report for editing
  - Remove report functionality
  - Generate consolidated PDF button
  - Clear list button
  - Export/Import session data

### 5. Main Action Buttons
- **Calculate Day:** Performs calculations without saving
- **Save Day & Start Next:** Saves report and prepares for next day

### 6. Scratch-Off Tickets Table
- **Columns:**
  - # (Row number)
  - Ticket Name
  - Price
  - Previous # (P)
  - Shift A: End # (A), Sold (C), Total (T)
  - Shift B: End # (B), Sold (C), Total (T)
  - Actions (NIL P, NIL A, NIL B, Reload buttons)

### 7. Settings Modal
- **Employee Management:**
  - Add new employee
  - Remove existing employees
  - Employee list display

- **Ticket Configuration:**
  - Editable table with:
    - Ticket number
    - Name
    - Price
    - Book size
    - Initial number
  - Scrollable table (max-height: 45vh)

- **Actions:**
  - Clear All Data button
  - Save Configuration button

---

## Business Logic

### Calculation Engine

#### 1. Sold Count Calculation
**Function:** `calculateSoldCount(prevNum, currentNum, bookSize)`

**Logic:**
- If `prevNum === -1`: Return 0 (book already sold)
- If `currentNum === -1`: Return `prevNum + 1` (entire book sold)
- If `currentNum === prevNum`: Return 0 (no sales)
- If `currentNum < prevNum`: Return `prevNum - currentNum` (backward movement)
- If `currentNum > prevNum`: Return `(prevNum + 1) + ((bookSize - 1) - currentNum)` (new book started)

**Special Values:**
- `-1` represents a "SOLD" book (NIL - Not In Location)
- Empty values treated as no change from previous number

#### 2. Shift Calculations
**Shift A:**
- Calculates from Previous # to Shift A End #
- Updates sold count and total amount
- Accumulates total scratch-off sales

**Shift B:**
- Calculates from Shift A End # to Shift B End #
- Uses Shift A End # as starting point
- Independent calculation from Shift A

#### 3. Reckoning Summary
**For each shift:**
- **Total Scratch-Off Sales:** Sum of all ticket sales
- **Expected Scratch-Off Cash:** Same as total scratch-off sales
- **Total Expected Cash:** `Online Sales - Online Cashes - Instant Cashes + Total Scratch-Off Sales`
- **Difference:** `Actual Cash - Total Expected Cash`

**Difference Color Coding:**
- Negative (red): Shortage
- Positive (green): Surplus
- Zero (blue): Exact match

### State Management
- **Ticket State:** Tracks last number for each ticket
- **State Update:** After saving a day, updates state from Shift B's final numbers
- **State Persistence:** Saved to localStorage after each update

---

## Validation & Error Handling

### Live Validation
- **Input Validation:** Real-time validation on number inputs
- **Visual Feedback:**
  - `.input-sold`: Red border for `-1` (SOLD) values
  - `.input-error`: Red background for invalid values (< -1)
  - `.row-warning`: Yellow background for new book detection

### New Book Detection
- **Shift A:** Detects if `currentNum > prevNum` (both >= 0)
- **Shift B:** Detects if `currentNum > shiftAEndNum` (both >= 0)
- **Visual Indicator:** Entire row highlighted in light yellow

### Data Validation
- **Empty Input Handling:**
  - Previous #: Treated as `-1` (SOLD)
  - Shift A End #: Defaults to Previous #
  - Shift B End #: Defaults to Shift A End #

- **Invalid Number Handling:**
  - Non-numeric values treated as empty
  - Negative numbers < -1 flagged as errors
  - NaN values handled gracefully

### Error Messages
- Confirmation dialogs for destructive actions
- Alert messages for invalid operations
- Console error logging for PDF generation failures

---

## Export/Import Features

### Export Session
- **Format:** JSON
- **Contents:**
  - `ticketConfig`: Array of ticket configurations
  - `ticketState`: Array of current ticket states
  - `dailyReports`: Array of saved daily reports
  - `employees`: Array of employee names

- **File Naming:** `lottery_session_YYYY-MM-DD.json`
- **Download:** Automatic browser download

### Import Session
- **File Type:** JSON files only (`.json` extension)
- **Validation:**
  - Checks for required keys: `ticketConfig`, `ticketState`, `dailyReports`, `employees`
  - JSON parsing error handling
  - User confirmation before overwriting data

- **Post-Import:** Page reload to apply changes

---

## Browser Requirements

### Required Features
- **localStorage API:** For data persistence
- **FileReader API:** For importing JSON files
- **Blob API:** For file downloads
- **URL.createObjectURL:** For download links
- **ES6+ JavaScript:** Arrow functions, template literals, etc.

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No Internet Explorer support (uses modern APIs)
- Mobile browser support (responsive design)

### Network Requirements
- **CDN Access Required:**
  - Tailwind CSS CDN
  - jsPDF CDN
  - jsPDF-autotable CDN
  - External images (NJ Lottery logo, favicon)

- **Offline Capability:** Limited (requires CDN for initial load)

---

## Dependencies

### External Dependencies (CDN)
1. **Tailwind CSS**
   - URL: `https://cdn.tailwindcss.com`
   - Required: Yes
   - Fallback: None (application won't style properly)

2. **jsPDF**
   - URL: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
   - Required: Yes (for PDF generation)
   - Fallback: PDF generation will fail

3. **jsPDF AutoTable**
   - URL: `https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js`
   - Required: Yes (for PDF table generation)
   - Fallback: PDF generation will fail

### External Resources
- **Favicon:** `https://i.imgur.com/8pP6mRj.png`
- **NJ Lottery Logo:** `https://www.njlottery.com/content/dam/portal/images/NewJerseyLottery_Logo_Full%20Color.png`

---

## Data Structures

### Ticket Configuration Object
```javascript
{
  id: number,           // Unique identifier (0-27)
  name: string,         // Ticket name
  price: number,        // Price per ticket
  bookSize: number      // Total tickets in a book
}
```

### Ticket State Object
```javascript
{
  id: number,           // Matches ticket config id
  lastNumber: number    // Last ticket number (or -1 for SOLD)
}
```

### Ticket Detail Object (in reports)
```javascript
{
  id: number,
  name: string,
  price: number,
  bookSize: number,
  prevNum: number,      // Previous/starting number
  currentNum: number,   // Ending number
  soldCount: number,    // Number of tickets sold
  totalAmount: number   // soldCount * price
}
```

### Shift Object
```javascript
{
  date: string,                    // ISO date string
  personName: string,               // Employee name
  onlineSales: number,             // Positive value
  onlineCashes: number,            // Negative value (subtracted)
  instantCashes: number,           // Negative value (subtracted)
  actualCash: number,              // Actual cash collected
  totalScratchSales: number,       // Calculated total
  difference: string,              // Formatted difference (e.g., "$5.00")
  dataEntered: boolean,            // Whether shift data was entered
  ticketDetails: [TicketDetail]    // Array of ticket details
}
```

### Daily Report Object
```javascript
{
  date: string,        // ISO date string
  shiftA: Shift,       // Shift A data
  shiftB: Shift        // Shift B data
}
```

### Session Export Object
```javascript
{
  ticketConfig: [TicketConfig],
  ticketState: [TicketState],
  dailyReports: [DailyReport],
  employees: [string]
}
```

---

## Key Algorithms

### 1. Sold Count Algorithm
```javascript
function calculateSoldCount(prevNum, currentNum, bookSize) {
  if (prevNum === -1) return 0;              // Book already sold
  if (currentNum === -1) return prevNum + 1;  // Entire book sold
  if (currentNum === prevNum) return 0;       // No sales
  if (currentNum < prevNum) return prevNum - currentNum;  // Backward
  // Forward movement (new book)
  return (prevNum + 1) + ((bookSize - 1) - currentNum);
}
```

### 2. Expected Cash Calculation
```javascript
Expected Cash = Online Sales - Online Cashes - Instant Cashes + Total Scratch-Off Sales
```

### 3. Difference Calculation
```javascript
Difference = Actual Cash - Expected Cash
```

### 4. State Update Algorithm
After saving a day:
1. Extract final numbers from Shift B ticket details
2. Match ticket names to current configuration
3. Update ticketState with new lastNumber values
4. Persist to localStorage

---

## UI/UX Features

### Keyboard Navigation
- **Enter Key:**
  - In table inputs: Moves to same column in next row
  - In form inputs: Cycles through data-entry fields
  
- **Tab Key:**
  - Standard tab navigation
  - At end of row: Moves to first input of next row

### Visual Feedback
- **Hover Effects:**
  - Button scale transforms
  - Color transitions
  - Cursor pointer on interactive elements

- **Color Coding:**
  - Difference display: Red (negative), Green (positive), Blue (zero)
  - Input validation: Red borders/backgrounds for errors
  - Row warnings: Yellow background for new books

### Animations
- **Modal:**
  - Fade-in background (0.4s)
  - Slide-in content (0.4s)
  
- **CSS Keyframes:**
  - `fadeIn`: Opacity 0 to 1
  - `slideIn`: Bottom -300px to 0 with opacity

### Responsive Design
- **Breakpoints:**
  - Mobile: Single column layout
  - Tablet (md): Multi-column grids
  - Desktop (lg): 12-column grid system
  
- **Grid Layouts:**
  - Shift panels: `lg:col-span-5` (5/12 width)
  - Reports panel: `lg:col-span-2` (2/12 width)
  - Responsive table with horizontal scroll

### Accessibility
- Semantic HTML elements
- Form labels associated with inputs
- Button elements for interactive actions
- Focus states for keyboard navigation

---

## PDF Generation

### PDF Specifications
- **Format:** Letter size (8.5" x 11")
- **Orientation:** Portrait
- **Unit:** Points (pt)

### PDF Content Structure
1. **Header:**
   - Store name and address (centered)
   - Date (formatted: "Weekday, Month Day, Year")

2. **Ticket Table:**
   - Columns: #, Name, P, A, C, $, T, B, C, T
   - Row for each ticket
   - Total row at bottom
   - Custom styling for price column (green, bold)

3. **Summary Sections:**
   - **Shift A Summary:**
     - Employee name
     - Online Sales
     - Expected Scratch-Off Cash
     - Difference (color-coded: red/green)
     - Online Cashes
     - Actual Cash (bold)
     - Instant Cashes
   
   - **Shift B Summary:**
     - Same structure as Shift A

### PDF Features
- Multiple pages (one per day report)
- Color-coded differences
- Italic text for missing data
- Grid theme for tables
- Custom cell styling

### PDF Filename
- Format: `Consolidated_Lottery_Report.pdf`
- Contains all pending reports in chronological order

---

## Special Features

### NIL (Not In Location) Functionality
- **NIL P Button:** Sets Previous # to -1 (book sold)
- **NIL A Button:** Sets Shift A End # to -1 (book sold in Shift A)
- **NIL B Button:** Sets Shift B End # to -1 (book sold in Shift B)
- **Visual Indicator:** Red border on inputs with -1 value

### Reload Functionality
- Resets ticket row to start of new book
- Sets Previous # to `bookSize - 1`
- Clears Shift A and Shift B inputs
- Updates placeholders

### Report Editing
- Load existing report for editing
- Visual indicator (blue background) for editing state
- Update button changes to orange when editing
- Updates existing report instead of creating new one

### Auto-increment Date
- After saving a day, date automatically increments to next day
- Uses UTC date calculation
- Preserves date format (YYYY-MM-DD)

---

## Configuration Management

### Default Ticket Configuration
- 28 pre-configured tickets
- Covers price range $1-$30
- Book sizes range from 20-200 tickets
- Can be modified in Settings

### Settings Persistence
- Ticket configuration saved to localStorage
- Employee list saved to localStorage
- Settings modal auto-opens on first load if no config exists

### Data Reset
- "Clear All Data" button clears all localStorage
- Requires user confirmation
- Triggers page reload after clearing

---

## Performance Considerations

### DOM Manipulation
- Efficient DOM caching (single query per element)
- Batch updates where possible
- Event delegation for dynamic content

### Storage Operations
- localStorage writes on every save operation
- JSON serialization/deserialization
- No pagination (all reports in memory)

### Rendering
- Table re-rendering on configuration changes
- Selective updates for calculations
- Minimal reflows with efficient selectors

---

## Security Considerations

### Client-Side Only
- No server-side validation
- All data stored in browser
- No authentication/authorization
- No data encryption

### Data Privacy
- Data stored locally in browser
- Export files contain all data
- Import requires explicit user action
- No external data transmission (except CDN resources)

---

## Future Enhancement Opportunities

### Potential Improvements
1. **Backend Integration:** Server-side storage and sync
2. **User Authentication:** Multi-user support
3. **Data Backup:** Cloud backup integration
4. **Advanced Reporting:** Charts, graphs, trends
5. **Mobile App:** Native mobile application
6. **Offline Support:** Service worker for offline functionality
7. **Data Validation:** Enhanced input validation
8. **Print Functionality:** Direct printing without PDF
9. **Multi-Store Support:** Support for multiple store locations
10. **Audit Trail:** Track changes and modifications

---

## Maintenance Notes

### Code Organization
- Single-file application (all code in index.html)
- Inline JavaScript (no external JS files)
- Inline CSS (minimal custom styles)
- CDN dependencies (no local node_modules)

### Update Considerations
- CDN versions may change (consider version pinning)
- localStorage structure changes require migration
- Browser API changes may affect compatibility

### Testing Requirements
- Test across different browsers
- Test localStorage limits (typically 5-10MB)
- Test PDF generation with various data sizes
- Test import/export functionality
- Test keyboard navigation
- Test responsive layouts

---

## Version Information

**Current Implementation:**
- Single HTML file
- Vanilla JavaScript
- Tailwind CSS v3 (CDN)
- jsPDF v2.5.1
- jsPDF-autotable v3.5.23

**No Version Control:**
- No package.json
- No build process
- No version numbering system
- Direct HTML deployment

---

## Conclusion

This application is a fully client-side lottery management tool designed for daily shift tracking, ticket sales calculation, and report generation. It requires no backend infrastructure and operates entirely within the browser using localStorage for persistence. The application is self-contained in a single HTML file with external CDN dependencies for styling and PDF generation.

**Key Strengths:**
- No server required
- Simple deployment (single file)
- Offline-capable (after initial CDN load)
- Fast and responsive
- Easy to backup (export functionality)

**Key Limitations:**
- Browser-dependent (localStorage limits)
- No multi-device sync
- No user authentication
- CDN dependency for core functionality
- Single-file complexity (maintenance challenge)

---

*Document generated from analysis of index.html*
*For questions or updates, refer to the source code comments and implementation*

