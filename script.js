
const VAT_RATE = 0.15;
const RECENT_DAYS = 30;
const BIG_ORDER = 1000;
const DAY_MS = 1000 * 60 * 60 * 24;

// Challenge 8
const PATTERNS = {
  email: /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i,
  orderId: /^ORD-\d{4}$/,
};
const REQUIRED_FIELDS = ["orderId", "customerName", "email", "product", "category", "price", "orderDate"];

const TONES = {
  good: "bg-green-100 text-green-800",
  bad: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  neutral: "bg-gray-100 text-gray-600",
};

// Challenge 0
const ago = (days) => new Date(Date.now() - days * DAY_MS).toISOString().slice(0, 10);
const SAMPLE_ORDERS = [
  { orderId: "ORD-0001", customerName: "  thabo   MOKOENA ", email: " Thabo.Mokoena@Example.com ", product: "Laptop", category: "Electronics", price: 12999.5, orderDate: ago(3) },
  { orderId: "ORD-0002", customerName: "SARAH jones", email: "SARAH@Example.COM ", product: "Wireless Mouse", category: "Electronics", price: 349.9, orderDate: ago(6) },
  { orderId: "ORD-0003", customerName: "  lerato   dlamini", email: "lerato.d@mail.co.za", product: "Running Shoes", category: "Sportswear", price: 899, orderDate: ago(19) },
  { orderId: "ORD-0004", customerName: "JOHN smith", email: "john@@mail", product: "Coffee Maker", category: "Home & Kitchen", price: 1249.75, orderDate: ago(23) },
  { orderId: "ORD-0005", customerName: "naledi  Khumalo ", email: "naledi@store.org", product: "Novel Collection", category: "Books", price: 450.25, orderDate: ago(41) },
  { orderId: "ORD-0006", customerName: " peter   VAN der merwe", email: "peter.vdm@mail.com", product: "Desk Lamp", category: "Home & Kitchen", price: 279.99, orderDate: ago(52) },
  { orderId: "ORD-0007", customerName: "ayesha PATEL", email: "ayesha.patel@example.com", product: "Yoga Mat", category: "Sportswear", price: 320, orderDate: ago(1) },
  { orderId: "ORD-0008", customerName: "  sipho  NKOSI  ", email: " SIPHO.NKOSI@Mail.com", product: "Headphones", category: "Electronics", price: 1599.99, orderDate: ago(46) },
  { orderId: "ORD-0009", customerName: "mary ann  BOTHA", email: "maryann@botha.co.za", product: "Cookbook", category: "Books", price: 189.5, orderDate: ago(11) },
  { orderId: "ORD-0010", customerName: "Kabelo MOLEFE", email: "kabelo.molefe@example.com", product: "Backpack", category: "Accessories", price: 599, orderDate: ago(92) },
  { orderId: "ORD-12", customerName: "DAVID lee ", email: "david.lee@mail.com", product: "Smart Watch", category: "Electronics", price: 2499, orderDate: ago(29) },
];

// Helpers
const $ = (id) => document.getElementById(id);
const esc = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const badge = (text, tone) => `<span class="rounded px-2 py-0.5 text-xs ${TONES[tone]}">${esc(text)}</span>`;
const flag = (ok, label) => badge(`${ok ? "Valid" : "Invalid"} ${label}`, ok ? "good" : "bad");
const notice = (el, text, ok) => {
  el.innerHTML = `<p class="rounded px-3 py-2 text-sm ${TONES[ok ? "good" : "bad"]}">${esc(text)}</p>`;
};


const normalize = (o) => ({
  ...o,
  orderId: String(o.orderId).trim(),
  customerName: String(o.customerName),
  email: String(o.email),
  product: String(o.product).trim(),
  category: String(o.category).trim(),
  orderDate: String(o.orderDate).trim(),
  price: parseFloat(o.price),
});

let orders = SAMPLE_ORDERS.map(normalize);
let products = new Map();

// Challenge 1
const cleanName = (name) => name.trim().replace(/\s+/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const cleanEmail = (email) => email.trim().toLowerCase();
const firstName = (name) => cleanName(name).split(" ")[0];
const emailDomain = (email) => {
  const clean = cleanEmail(email);
  return clean.includes("@") ? clean.slice(clean.lastIndexOf("@") + 1) : "n/a";
};

// Challenge 2
const validPrice = (o) => Number.isFinite(o.price) && o.price >= 0;
const amount = (o) => (validPrice(o) ? o.price : 0);
const money = (n) => `R ${n.toFixed(2)}`;
const withVat = (n) => Math.round(n * (1 + VAT_RATE) * 100) / 100;

// Challenge 3
const orderDate = (o) => new Date(o.orderDate);
const daysAgo = (o) => Math.floor((Date.now() - orderDate(o).getTime()) / DAY_MS);
const isRecent = (o) => daysAgo(o) >= 0 && daysAgo(o) <= RECENT_DAYS; // false for invalid dates (NaN)
const agoText = (o) => (Number.isNaN(daysAgo(o)) ? "" : `${daysAgo(o)} days ago`);
const formatDate = (o) =>
  Number.isNaN(orderDate(o).getTime())
    ? "Invalid date"
    : orderDate(o).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// Challenge 8
const emailOk = (o) => PATTERNS.email.test(cleanEmail(o.email));
const idOk = (o) => PATTERNS.orderId.test(o.orderId);

//  Challenge 4
function visibleOrders() {
  const category = $("category").value;
  const min = parseFloat($("min").value) || 0;
  const max = parseFloat($("max").value) || Infinity;
  return orders
    .filter((o) => !category || o.category === category)
    .filter((o) => amount(o) >= min && amount(o) <= max)
    .sort((a, b) => orderDate(b) - orderDate(a));
}

function renderOrders() {
  const list = visibleOrders();
  $("count").textContent = `Showing ${list.length} of ${orders.length} orders`;
  $("orders").innerHTML =
    list
      .map(
        (o) => `
    <tr class="${isRecent(o) ? "bg-green-50" : ""}">
      <td class="p-2">${esc(o.orderId)}<br>${flag(idOk(o), "ID")}</td>
      <td class="p-2">${esc(cleanName(o.customerName))}<br><span class="text-xs text-gray-500">First name: ${esc(firstName(o.customerName))}</span></td>
      <td class="p-2">${esc(cleanEmail(o.email))}<br><span class="text-xs text-gray-500">Domain: ${esc(emailDomain(o.email))}</span><br>${flag(emailOk(o), "email")}</td>
      <td class="p-2">${esc(o.product)}</td>
      <td class="p-2">${esc(o.category)}</td>
      <td class="p-2 whitespace-nowrap">${validPrice(o) ? money(o.price) : badge("Invalid price", "bad")}</td>
      <td class="p-2 whitespace-nowrap">${money(withVat(amount(o)))}</td>
      <td class="p-2 whitespace-nowrap">${esc(formatDate(o))}<br><span class="text-xs text-gray-500">${agoText(o)}</span><br>${badge(isRecent(o) ? "Recent" : "Older", isRecent(o) ? "good" : "neutral")}</td>
    </tr>`
      )
      .join("") || `<tr><td colspan="8" class="p-4 text-center text-gray-500">No orders match the filters.</td></tr>`;
}

//  Challenge 5
const categories = () => [...new Set(orders.map((o) => o.category))].filter(Boolean).sort();
const countIn = (category) => orders.filter((o) => o.category === category).length;

function renderCategories() {
  const list = categories();
  const select = $("category");
  const selected = select.value;
  $("categories").innerHTML = list.map((c) => badge(`${c} (${countIn(c)})`, "info")).join("");
  select.innerHTML =
    `<option value="">All categories</option>` + list.map((c) => `<option>${esc(c)}</option>`).join("");
  select.value = list.includes(selected) ? selected : "";
}

// Challenge 6
function buildProducts() {
  products = new Map();
  orders.forEach((o) =>
    products.set(o.product.toLowerCase(), { name: o.product, price: amount(o), category: o.category })
  );
  $("product-list").innerHTML = [...products.values()].map((p) => `<option value="${esc(p.name)}">`).join("");
}

function renderLookup() {
  const input = $("lookup").value.trim();
  const out = $("lookup-result");
  if (!input) {
    out.innerHTML = `<p class="text-gray-500">${products.size} products available.</p>`;
  } else if (!products.has(input.toLowerCase())) {
    notice(out, `No product named "${input}" was found. Try one from the suggestions.`, false);
  } else {
    const p = products.get(input.toLowerCase());
    out.innerHTML = `<div class="rounded border border-purple-200 bg-purple-50 p-3">
      <p class="font-semibold">${esc(p.name)}</p>
      <p>${esc(p.category)} · ${money(p.price)} (${money(withVat(p.price))} incl. VAT)</p></div>`;
  }
}

// Challenge 9
function renderStats() {
  if (!orders.length) {
    $("stats").innerHTML = `<p class="text-gray-500">No orders to analyse.</p>`;
    return;
  }
  const prices = orders.map(amount);
  const total = orders.reduce((sum, o) => sum + amount(o), 0);
  const top = orders.find((o) => amount(o) === Math.max(...prices));
  const low = orders.find((o) => amount(o) === Math.min(...prices));
  const validEmails = orders.filter(emailOk).length;

  const stats = {
    "Total orders": orders.length,
    "Total order value": money(total),
    "Average order value": money(total / orders.length),
    "Highest-priced order": `${top.orderId} (${money(amount(top))})`,
    "Lowest-priced order": `${low.orderId} (${money(amount(low))})`,
    "Most expensive product": top.product,
    "Unique categories": categories().length,
    "Orders per category": categories().map((c) => `${c}: ${countIn(c)}`).join(", "),
    "Valid / invalid emails": `${validEmails} / ${orders.length - validEmails}`,
    [`Recent orders (${RECENT_DAYS} days)`]: orders.filter(isRecent).length,
  };

  $("stats").innerHTML = Object.entries(stats)
    .map(
      ([label, value]) => `<div class="rounded border bg-gray-50 p-3">
        <p class="text-xs uppercase text-gray-500">${esc(label)}</p><p class="font-semibold">${esc(value)}</p></div>`
    )
    .join("");
}

// Challenge 7
const renderExport = () => ($("export").value = JSON.stringify(orders, null, 2));

function importOrders() {
  const out = $("import-message");
  let data;
  try {
    data = JSON.parse($("import").value);
  } catch (error) {
    return notice(out, `Invalid JSON: ${error.message}`, false);
  }
  const incoming = Array.isArray(data) ? data : [data];
  const hasProblem = incoming.some(
    (o) => typeof o !== "object" || o === null || REQUIRED_FIELDS.some((field) => !(field in o))
  );
  if (!incoming.length || hasProblem) {
    return notice(out, `Every order must be an object with: ${REQUIRED_FIELDS.join(", ")}.`, false);
  }
  orders = [...orders, ...incoming.map(normalize)];
  renderAll();
  notice(out, `Added ${incoming.length} order(s).`, true);
}

function runValidator() {
  const value = $("validator-input").value.trim();
  const ok = PATTERNS[$("validator-type").value].test(value);
  if (!value) $("validator-result").innerHTML = "";
  else notice($("validator-result"), `"${value}" ${ok ? "is valid" : "does not match the required format"}.`, ok);
}

// Challenge 4:
function findOrder() {
  const query = $("find").value.trim().toLowerCase();
  const found =
    query &&
    orders.find((o) => o.orderId.toLowerCase() === query || cleanName(o.customerName).toLowerCase().includes(query));
  if (!found) {
    return notice($("find-result"), query ? `No order found for "${query}".` : "Enter an order ID or name.", false);
  }
  notice($("find-result"), `${found.orderId}: ${cleanName(found.customerName)} ordered ${found.product} (${money(amount(found))}) on ${formatDate(found)}.`, true);
}

const ANALYSES = {
  some: () =>
    orders.some((o) => amount(o) > BIG_ORDER)
      ? `Yes, at least one order is over ${money(BIG_ORDER)}.`
      : `No orders are over ${money(BIG_ORDER)}.`,
  every: () => (orders.every(validPrice) ? "Yes, every order has a valid price." : "No, some orders have invalid prices."),
  map: () => visibleOrders().map((o) => `${o.product}: ${money(withVat(amount(o)))} incl. VAT`).join("\n"),
  reduce: () => {
    const list = visibleOrders();
    return `Total of ${list.length} shown order(s): ${money(list.reduce((sum, o) => sum + amount(o), 0))}`;
  },
};


function renderAll() {
  buildProducts();
  renderCategories(); 
  renderOrders();
  renderStats();
  renderLookup();
  renderExport();
}

$("find-btn").onclick = findOrder;
$("find").onkeydown = (event) => event.key === "Enter" && findOrder();
$("filters").addEventListener("input", renderOrders);
$("reset").onclick = () => {
  document.querySelectorAll("#filters input, #filters select").forEach((el) => (el.value = ""));
  renderOrders();
};
document.querySelectorAll("[data-analysis]").forEach((button) => {
  button.onclick = () => ($("analysis").textContent = ANALYSES[button.dataset.analysis]() || "No orders to show.");
});
$("lookup").oninput = renderLookup;
$("import-btn").onclick = importOrders;
$("validator-type").onchange = runValidator;
$("validator-input").oninput = runValidator;

renderAll();