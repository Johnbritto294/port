/**
 * recruiter-dashboard.js
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.requireAuth('recruiter')) return;

  const name = localStorage.getItem('userName') || 'Recruiter';
  const company = localStorage.getItem('userCompany') || 'Your Company';
  const email = localStorage.getItem('userEmail') || '';

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setText('user-name', email || 'recruiter@stackly.com');
  setText('user-company', company);

  const profileCompany = document.getElementById('profile-company');
  const profileName = document.getElementById('profile-recruiter-name');
  const profileEmail = document.getElementById('profile-email');
  if (profileCompany) profileCompany.value = company;
  if (profileName) profileName.value = name;
  if (profileEmail) profileEmail.value = email;

  initDashboardNav();
  initDashboardCharts();
  initLogout();
});

function initDashboardNav() {
  const links = document.querySelectorAll('.nav-item[data-panel], .dropdown-menu-links a[data-panel]');
  const panels = document.querySelectorAll('.dashboard-panel');
  const title = document.getElementById('panel-title');
  const titles = {
    overview: 'Recruiter Overview',
    jobs: 'Posted Jobs',
    applicants: 'Applicants',
    company: 'Company Profile',
  };

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const panel = link.dataset.panel;
      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      panels.forEach((p) => p.classList.remove('active'));
      document.getElementById(`panel-${panel}`)?.classList.add('active');
      if (title) title.textContent = titles[panel] || 'Dashboard';
      const navItems = document.querySelectorAll('.dashboard-nav-horizontal .nav-item');
      navItems.forEach((item) => {
        if (item.dataset.panel === panel) {
          navItems.forEach((i) => i.classList.remove('active'));
          item.classList.add('active');
        }
      });
    });
  });

  document.getElementById('save-profile')?.addEventListener('click', (e) => {
    e.preventDefault();
    const company = document.getElementById('profile-company')?.value;
    const name = document.getElementById('profile-recruiter-name')?.value;
    if (company) localStorage.setItem('userCompany', company);
    if (name) localStorage.setItem('userName', name);
    const compEl = document.getElementById('user-company');
    if (compEl) compEl.textContent = company || 'Company';
    window.showToast?.('Company profile saved');
  });
}

function initDashboardCharts() {
  const bars = document.querySelectorAll('#chart-bars .chart-bar');
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      bars.forEach((bar) => {
        bar.style.height = (bar.dataset.height || 50) + '%';
      });
      observer.disconnect();
    },
    { threshold: 0.3 }
  );
  const chart = document.getElementById('chart-bars');
  if (chart) observer.observe(chart);
}

function initLogout() {
  document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCompany');
    window.location.href = 'login.html?role=recruiter';
  });
}
