// Menu mobile
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("menu");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menu.classList.toggle("is-open", open);
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

// Sombra na navegação ao rolar
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Link ativo conforme a seção visível
const links = [...menu.querySelectorAll('a[href^="#"]')];
const sections = links
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  // Animação de entrada
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        reveal.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => {
    // pequeno atraso em cascata entre irmãos
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--d", `${Math.min(siblings.indexOf(el), 5) * 80}ms`);
    // o hero aparece direto no carregamento, sem depender da rolagem
    if (el.closest(".hero")) {
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-visible")));
    } else {
      reveal.observe(el);
    }
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}

// Formulário de contato -> WhatsApp
const form = document.getElementById("form-contato");
const errorMsg = form.querySelector(".form__error");
const WHATSAPP = "5511963596715";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;
  form.querySelectorAll("input, textarea").forEach((field) => {
    const ok = field.value.trim() !== "" && field.checkValidity();
    field.closest(".field").classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });
  errorMsg.hidden = valid;
  if (!valid) {
    form.querySelector(".is-invalid input, .is-invalid textarea").focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  const text = [
    "*Formulário de Contato*",
    "",
    `*Nome*: ${data.nome.trim()}`,
    `*E-mail*: ${data.email.trim()}`,
    `*Assunto*: ${data.assunto.trim()}`,
    `*Mensagem*: ${data.mensagem.trim()}`,
  ].join("\n");

  window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

form.addEventListener("input", (e) => {
  const field = e.target.closest(".field");
  if (field && field.classList.contains("is-invalid") && e.target.checkValidity() && e.target.value.trim()) {
    field.classList.remove("is-invalid");
  }
});

// Tema claro / escuro
const root = document.documentElement;
const themeBtn = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');

function applyTheme(tema, salvar) {
  root.setAttribute("data-theme", tema);
  const escuro = tema === "dark";
  const label = escuro ? "Ativar tema claro" : "Ativar tema escuro";
  themeBtn.setAttribute("aria-pressed", String(escuro));
  themeBtn.setAttribute("aria-label", label);
  themeBtn.title = label;
  themeColor.setAttribute("content", escuro ? "#0b0816" : "#1E5FBF");
  if (salvar) {
    try { localStorage.setItem("tema", tema); } catch (e) {}
  }
}

applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light", false);
themeBtn.addEventListener("click", () => {
  applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
});

// Ano no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();
