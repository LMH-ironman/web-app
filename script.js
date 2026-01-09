(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");

  function setNavOpen(isOpen) {
    if (!nav || !toggle) return;
    nav.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("open"));
    });

    // Close on click (mobile)
    nav.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement) setNavOpen(false);
    });

    // Close on Escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  // Active link highlight
  const sectionIds = ["about", "services", "contact"];
  const links = new Map();
  document.querySelectorAll('.site-nav a[href^="#"]').forEach((a) => {
    const href = a.getAttribute("href") || "";
    const id = href.replace("#", "");
    if (sectionIds.includes(id)) links.set(id, a);
  });

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el) => el);

  if (sections.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((x) => x.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (!visible || !visible.target || !(visible.target instanceof HTMLElement)) return;
        const id = visible.target.id;
        links.forEach((a) => a.classList.remove("active"));
        const active = links.get(id);
        if (active) active.classList.add("active");
      },
      { root: null, threshold: [0.15, 0.3, 0.6] }
    );

    sections.forEach((s) => obs.observe(s));
  }

  // Contact form -> mailto
  const form = document.getElementById("contact-form");
  if (form instanceof HTMLFormElement) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const contact = String(data.get("contact") || "").trim();
      const message = String(data.get("message") || "").trim();

      const subject = encodeURIComponent(`官网留言｜${name || "未填写称呼"}`);
      const body = encodeURIComponent(
        [
          `称呼：${name || "未填写"}`,
          `联系方式：${contact || "未填写"}`,
          "",
          "需求简介：",
          message || "未填写",
          "",
          "（此邮件由官网页面自动生成）",
        ].join("\n")
      );

      // 邮箱配置：在 index.html 的 <html data-contact-email="..."> 中填写真实邮箱即可
      const to = String(document.documentElement.dataset.contactEmail || "").trim();
      const href = `mailto:${to}?subject=${subject}&body=${body}`;
      window.location.href = href;
    });
  }
})();
