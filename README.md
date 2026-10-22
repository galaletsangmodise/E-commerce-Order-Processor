# E-Commerce Order Processor
A browser-based order processor for a small business. It cleans messy customer data, calculates prices and VAT, works with dates, searches and filters orders, validates data with patterns, and imports/exports orders as JSON. The statistics dashboard updates automatically whenever the data changes.

## Technologies
HTML, Tailwind CSS (CDN, used for all styling), JavaScript. .

## Built-In Objects Used

| Built-In | Where it was used |
|----------|-------------------|
| String | `cleanName()`, `cleanEmail()`, `firstName()`, `emailDomain()` using `trim`, `replace`, `toLowerCase`, `toUpperCase`, `split`, `slice`, `includes` |
| Number | `money()` with `toFixed()`, `parseFloat()` in `normalize()`, `Number.isFinite()` in `validPrice()` |
| Math | `Math.round()` in `withVat()`, `Math.max()` / `Math.min()` in `renderStats()`, `Math.floor()` in `daysAgo()` |
| Date | `orderDate()`, `formatDate()`, `daysAgo()`, `isRecent()`, newest-first sorting |
| Array methods | `find` (search), `filter` (category, price range), `map` (VAT list), `some`, `every`, `reduce` (totals) |
| Set | `categories()` drives the Categories section and the filter dropdown |
| Map | `buildProducts()` with `set()`, Product Lookup with `has()`, `get()`, `size` |
| JSON | `JSON.stringify()` for export, `JSON.parse()` in try/catch for import |
| RegExp | `PATTERNS.email` and `PATTERNS.orderId` with `test()` |

## How to Run
1. Clone the repo: `git clone <your-repo-url>`
2. Open `index.html` in a browser (internet needed for the Tailwind CDN).


## Reflection

**1. Which built-in JavaScript object did you find most useful?**
The Array methods. `filter`, `map`, `find` and `reduce` did most of the work, from the search and price filters to the totals and statistics, with no hand-written loops.

**2. Which challenge was the most difficult?**
Challenge 3 (Date). Dates arrive as strings, so I had to handle invalid dates, which become `NaN`, and work out "days ago" without off-by-one mistakes. Keeping "recent" correct as time passes was also tricky.

**3. What did you learn about choosing the right JavaScript method for a problem?**
Start from what the result should look like. A new list of the same size calls for `map`, a smaller list for `filter`, one value for `reduce` or `find`, and a yes/no answer for `some` or `every`. A `Set` removes duplicates, a `Map` gives fast lookups by key, and `RegExp` checks formats.

**4. If you had more time, what would you improve about the application?**
I would save orders in `localStorage` so they survive a refresh, and add forms to add, edit and delete single orders. I would also add column sorting, a phone number validator, a discount feature, and tests for the cleaning and validation functions.