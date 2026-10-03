const timetable = window.MUMBAI_TRAIN_TIMETABLE;
const PAGE_SIZE = 250;
const state = { query: "", selected: null, visibleCount: PAGE_SIZE };
const $ = query => document.querySelector(query);
const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[c]);
const asMinutes = time => { const [hour, minute] = time.split(":").map(Number); return hour * 60 + minute; };
const searchableText = new Map(timetable.services.map(service => [service.id, [service.code, service.label, service.from, service.to, ...service.stops.map(stop => stop.station)].join(" ").toLowerCase()]));
const routeLabel = service => `${service.from} → ${service.to}`;
function matches(service, query) { return searchableText.get(service.id).includes(query); }
function matchingServices() { const query = state.query.trim().toLowerCase(); return query ? timetable.services.filter(service => matches(service, query)) : timetable.services; }
function renderList() {
  const matching = matchingServices(); const services = matching.slice(0, state.visibleCount); const container = $("#lineList"); container.replaceChildren();
  $("#resultText").textContent = `${services.length.toLocaleString("en-IN")} of ${matching.length.toLocaleString("en-IN")} services shown`;
  let previousRoute = "";
  for (const service of services) {
    const currentRoute = routeLabel(service);
    if (currentRoute !== previousRoute) {
      const heading = document.createElement("p"); heading.className = "route-group"; heading.textContent = currentRoute; container.append(heading); previousRoute = currentRoute;
    }
    const node = $("#lineTemplate").content.cloneNode(true); const button = node.querySelector("button"); button.classList.toggle("selected", service.id === state.selected);
    node.querySelector(".line-mark").style.background = "#2f7fa8"; node.querySelector("b").textContent = `${service.departure}  ·  ${service.code}`;
    node.querySelector("small").textContent = `${service.stops.length} stops · ${service.label}`;
    button.onclick = () => { state.selected = service.id; renderList(); renderDetail(); }; container.append(node);
  }
  if (!services.length) container.innerHTML = '<p class="none">No scheduled service matched.</p>';
  if (services.length < matching.length) {
    const loadMore = document.createElement("button"); loadMore.className = "load-more"; loadMore.type = "button"; loadMore.textContent = `Load 250 more (${(matching.length - services.length).toLocaleString("en-IN")} remaining)`;
    loadMore.onclick = () => { state.visibleCount += PAGE_SIZE; renderList(); }; container.append(loadMore);
  }
}
function renderDetail() {
  const service = timetable.services.find(item => item.id === state.selected); if (!service) return;
  const travel = asMinutes(service.arrival) - asMinutes(service.departure); const duration = travel >= 0 ? `${Math.floor(travel / 60)}h ${travel % 60}m` : "Overnight";
  $("#detail").innerHTML = `<div class="detail-top schedule-top"><div class="line-badge">TRAIN ${escapeHtml(service.code)}</div><p class="operator">SCHEDULED SERVICE</p><h2>${escapeHtml(service.from)} <span>→</span> ${escapeHtml(service.to)}</h2><p class="termini">${escapeHtml(service.label)}</p><div class="facts"><span><b>${escapeHtml(service.departure)}</b> departs</span><span><b>${escapeHtml(service.arrival)}</b> arrives</span><span><b>${duration}</b> scheduled trip</span></div></div><div class="station-head"><div><p>STOP-BY-STOP TIMETABLE</p><h3>Scheduled timestamps</h3></div><span>${service.stops.length} STOPS</span></div><ol class="stations timetable-stops">${service.stops.map((stop, index) => `<li class="${index === 0 || index === service.stops.length - 1 ? "terminus" : ""}"><i>${String(index + 1).padStart(2, "0")}</i><span class="dot"></span><div><b>${escapeHtml(stop.station)}</b>${index === 0 ? '<small>ORIGIN</small>' : index === service.stops.length - 1 ? '<small>DESTINATION</small>' : ""}</div><time>${escapeHtml(stop.time)}</time></li>`).join("")}</ol><p class="source-note">Source: ${escapeHtml(timetable.source)}. Times are scheduled, not live running times.</p>`;
}
function init() {
  $("#serviceCount").textContent = timetable.stats.services.toLocaleString("en-IN"); $("#stationCount").textContent = timetable.stats.stations.toLocaleString("en-IN"); $("#tableCount").textContent = timetable.stats.tables; $("#statusText").textContent = "scheduled times loaded";
  $("#search").addEventListener("input", event => { state.query = event.target.value; state.visibleCount = PAGE_SIZE; renderList(); }); renderList();
}
init();
