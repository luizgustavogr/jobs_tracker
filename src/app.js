if (!window.APP_CONFIG?.supabaseUrl || !window.APP_CONFIG?.supabaseKey) {
      document.body.innerHTML = '<main class="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center text-white"><div><h1 class="text-xl font-bold">Configuração ausente</h1><p class="mt-2 max-w-md text-sm text-slate-300">Copie config.example.js para config.js e informe as credenciais publicáveis do Supabase.</p></div></main>';
      throw new Error('Configuração do Supabase ausente. Crie config.js a partir de config.example.js.');
    }
    const SUPABASE_URL = window.APP_CONFIG.supabaseUrl;
    const SUPABASE_KEY = window.APP_CONFIG.supabaseKey;
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const statuses = ['Todas', 'Aplicado', 'Em análise', 'Entrevista', 'Entrevista RH', 'Entrevista Técnica', 'Entrevista Diretoria', 'Entrevista Cliente', 'Oferta'];
    const statusStyles = {
      'Aplicado': ['bg-blue-50 text-blue-700', 'bg-blue-500'],
      'Em análise': ['bg-amber-50 text-amber-700', 'bg-amber-500'],
      'Entrevista': ['bg-violet-50 text-violet-700', 'bg-violet-500'],
      'Entrevista RH': ['bg-violet-50 text-violet-700', 'bg-violet-500'],
      'Entrevista Técnica': ['bg-indigo-50 text-indigo-700', 'bg-indigo-500'],
      'Entrevista Diretoria': ['bg-fuchsia-50 text-fuchsia-700', 'bg-fuchsia-500'],
      'Entrevista Cliente': ['bg-pink-50 text-pink-700', 'bg-pink-500'],
      'Oferta': ['bg-emerald-50 text-emerald-700', 'bg-emerald-500']
    };
    let activeStatus = 'Todas';
    let jobs = [];
    let pendingDeleteId = null;
    let draggedJobId = null;
    let editingJobId = null;
    async function loadJobs() {
      const { data, error } = await supabaseClient.from('applications').select('*').order('applied_date', { ascending: false });
      if (error) { alert(`Não foi possível carregar as candidaturas: ${error.message}`); return; }
      jobs = data.map(job => ({ ...job, id: job.id, title: job.title, company: job.company, location: job.location, description: job.description, link: job.link, status: job.status, origin: job.origin || 'Brasileira', date: job.applied_date, logo: job.company.charAt(0).toUpperCase(), color: 'bg-indigo-100 text-indigo-700' }));
      render();
    }
    function formatDate(date) { return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', ''); }
    function updateCurrentDate() {
      document.getElementById('currentDate').textContent = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).toUpperCase();
    }
    function relativeDate(date) {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const days = Math.round((today - new Date(date + 'T12:00:00')) / 86400000);
      return days <= 0 ? 'Hoje' : days === 1 ? 'Ontem' : `há ${days} dias`;
    }
    function renderStats() {
      const total = jobs.length, interviews = jobs.filter(j => j.status.startsWith('Entrevista')).length, offers = jobs.filter(j => j.status === 'Oferta').length;
      const stats = [
        ['Total de candidaturas', total, 'kanban', 'text-indigo-600', 'bg-indigo-50', '+ 3 este mês'],
        ['Em processo', jobs.filter(j => j.status === 'Em análise' || j.status.startsWith('Entrevista')).length, 'loader-circle', 'text-amber-600', 'bg-amber-50', 'candidaturas ativas'],
        ['Entrevistas', interviews, 'calendar-check-2', 'text-violet-600', 'bg-violet-50', interviews ? 'Próxima: amanhã' : 'Nenhuma agendada']
      ];
      document.getElementById('stats').innerHTML = stats.map(s => `<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div class="flex items-start justify-between"><div><p class="text-xs font-medium text-slate-400">${s[0]}</p><p class="mt-2 text-2xl font-bold text-slate-900">${s[1]}</p></div><div class="flex h-9 w-9 items-center justify-center rounded-lg ${s[4]} ${s[3]}"><i data-lucide="${s[2]}" class="h-4 w-4"></i></div></div><p class="mt-3 text-[11px] font-medium text-slate-400">${s[5]}</p></div>`).join('');
    }
    function renderFilters() {
      document.getElementById('filters').innerHTML = statuses.map(status => `<button onclick="setStatus('${status}')" class="relative whitespace-nowrap py-4 text-xs font-semibold transition ${activeStatus === status ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'}">${status}${status === 'Todas' ? ` <span class="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">${jobs.length}</span>` : ''}${activeStatus === status ? '<span class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600"></span>' : ''}</button>`).join('');
    }
    function renderJobs() {
      const query = document.getElementById('searchInput').value.toLowerCase();
      const sort = document.getElementById('sortSelect').value;
      let filtered = jobs.filter(j => (activeStatus === 'Todas' || j.status === activeStatus) && `${j.title} ${j.company}`.toLowerCase().includes(query));
      filtered.sort((a, b) => sort === 'company' ? a.company.localeCompare(b.company) : sort === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
      document.getElementById('resultsLabel').textContent = `${filtered.length} de ${jobs.length} candidaturas`;
      const columns = statuses.filter(status => status !== 'Todas').filter(status => activeStatus === 'Todas' || status === activeStatus);
      document.getElementById('jobList').innerHTML = columns.map(status => {
        const columnJobs = filtered.filter(job => job.status === status);
        return `<section class="flex w-72 shrink-0 flex-col rounded-2xl bg-slate-50 p-3" ondragover="allowDrop(event)" ondrop="dropJob(event, '${status}')"><div class="mb-3 flex items-center justify-between px-1"><h4 class="text-xs font-bold uppercase tracking-wide text-slate-500">${status}</h4><span class="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-400">${columnJobs.length}</span></div><div class="min-h-32 space-y-3">${columnJobs.length ? columnJobs.map(job => renderJobCard(job)).join('') : '<p class="rounded-xl border border-dashed border-slate-200 px-3 py-8 text-center text-xs text-slate-400">Arraste uma candidatura para cá</p>'}</div></section>`;
      }).join('');
      lucide.createIcons();
    }
    function renderJobCard(job) {
      const style = statusStyles[job.status] || statusStyles['Aplicado'];
      const originStyle = job.origin === 'Gringa' ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-600';
      return `<article draggable="true" ondragstart="dragJob(event, ${Number(job.id)})" onclick="openDetails(${Number(job.id)})" class="group cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md active:cursor-grabbing"><div class="flex items-start justify-between gap-2"><div class="flex min-w-0 items-center gap-2"><div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${job.color}">${escapeHtml(job.logo)}</div><h4 class="truncate text-sm font-bold text-slate-900">${escapeHtml(job.title)}</h4></div><button onclick="event.stopPropagation(); requestDelete(${Number(job.id)})" aria-label="Excluir candidatura" class="rounded-lg p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"><i data-lucide="trash-2" class="h-3.5 w-3.5"></i></button></div><p class="mt-2 truncate text-xs font-medium text-slate-500">${escapeHtml(job.company)}</p><div class="mt-3 flex flex-wrap gap-1.5"><span class="rounded-md px-1.5 py-1 text-[10px] font-bold ${style[0]}">${escapeHtml(job.status)}</span><span class="rounded-md px-1.5 py-1 text-[10px] font-bold ${originStyle}">${escapeHtml(job.origin || 'Brasileira')}</span></div><p class="mt-3 truncate text-[11px] text-slate-400"><i data-lucide="map-pin" class="mr-1 inline h-3 w-3"></i>${escapeHtml(job.location || 'Local não informado')}</p></article>`;
    }
    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
      }[character]));
    }
    function setStatus(status) { activeStatus = status; renderFilters(); renderJobs(); }
    function goToApplications() {
      document.getElementById('jobList').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function openDetails(id) {
      const job = jobs.find(item => item.id === id);
      if (!job) return;
      const style = statusStyles[job.status] || statusStyles['Aplicado'];
      const originClass = job.origin === 'Gringa' ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-600';
      document.getElementById('detailsCompany').textContent = `${job.company} · ${job.location || 'Local não informado'}`;
      document.getElementById('detailsTitle').textContent = job.title;
      document.getElementById('detailsMeta').innerHTML = `<span class="rounded-md px-2 py-1 text-xs font-bold ${style[0]}">${escapeHtml(job.status)}</span><span class="rounded-md px-2 py-1 text-xs font-bold ${originClass}">${escapeHtml(job.origin || 'Brasileira')}</span><span class="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">Candidatura em ${formatDate(job.date)}</span>`;
      document.getElementById('detailsDescription').textContent = job.description || 'Nenhuma descrição foi adicionada para esta vaga.';
      const detailsLink = document.getElementById('detailsLink');
      const safeLink = getSafeUrl(job.link);
      detailsLink.classList.toggle('hidden', !safeLink);
      detailsLink.classList.toggle('flex', Boolean(safeLink));
      if (safeLink) detailsLink.href = safeLink;
      const modal = document.getElementById('detailsModal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.getElementById('editJobButton').onclick = () => {
        closeDetails();
        openModal(job.id);
      };
      lucide.createIcons();
    }
    function closeDetails() {
      const modal = document.getElementById('detailsModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    function getSafeUrl(value) {
      try {
        const url = new URL(String(value || ''));
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
      } catch {
        return '';
      }
    }
    function requestDelete(id) {
      pendingDeleteId = id;
      const modal = document.getElementById('confirmModal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      lucide.createIcons();
    }
    function closeConfirm() {
      pendingDeleteId = null;
      const modal = document.getElementById('confirmModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    async function confirmDelete() {
      if (pendingDeleteId === null) return;
      const id = pendingDeleteId;
      closeConfirm();
      const { error } = await supabaseClient.from('applications').delete().eq('id', id);
      if (error) { alert(`Não foi possível excluir a candidatura: ${error.message}`); return; }
      await loadJobs();
    }
    function dragJob(event, id) {
      draggedJobId = id;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(id));
    }
    function allowDrop(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }
    async function dropJob(event, status) {
      event.preventDefault();
      const id = draggedJobId || Number(event.dataTransfer.getData('text/plain'));
      draggedJobId = null;
      const job = jobs.find(item => item.id === id);
      if (!job || job.status === status) return;
      const previousStatus = job.status;
      job.status = status;
      render();
      const { error } = await supabaseClient.from('applications').update({ status }).eq('id', id);
      if (error) {
        job.status = previousStatus;
        render();
        alert(`Não foi possível atualizar a etapa: ${error.message}`);
      }
    }
    function openModal(id = null) {
      const modal = document.getElementById('modal');
      const job = id === null ? null : jobs.find(item => item.id === id);
      if (id !== null && !job) return;
      editingJobId = job ? job.id : null;
      document.getElementById('modalTitle').textContent = job ? 'Editar candidatura' : 'Adicionar candidatura';
      document.getElementById('modalDescription').textContent = job ? 'Atualize os dados desta oportunidade.' : 'Registre uma nova oportunidade para acompanhar.';
      document.getElementById('modalSubmit').textContent = job ? 'Salvar alterações' : 'Salvar candidatura';
      document.getElementById('jobTitle').value = job ? job.title : '';
      document.getElementById('jobCompany').value = job ? job.company : '';
      document.getElementById('jobLocation').value = job ? job.location || '' : '';
      document.getElementById('jobStatus').value = job ? job.status : 'Aplicado';
      document.getElementById('jobOrigin').value = job ? job.origin || 'Brasileira' : 'Brasileira';
      document.getElementById('jobDate').value = job ? job.date : new Date().toISOString().slice(0, 10);
      document.getElementById('jobLink').value = job ? job.link || '' : '';
      document.getElementById('jobDescription').value = job ? job.description || '' : '';
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.getElementById('jobTitle').focus();
    }
    function closeModal() {
      const modal = document.getElementById('modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      editingJobId = null;
    }
    async function saveJob(event) {
      event.preventDefault();
      const company = document.getElementById('jobCompany').value.trim();
      const payload = {
        title: document.getElementById('jobTitle').value.trim(),
        company,
        location: document.getElementById('jobLocation').value.trim() || 'Local não informado',
        link: getSafeUrl(document.getElementById('jobLink').value.trim()) || null,
        description: document.getElementById('jobDescription').value.trim(),
        status: document.getElementById('jobStatus').value,
        origin: document.getElementById('jobOrigin').value,
        applied_date: document.getElementById('jobDate').value
      };
      const request = editingJobId === null
        ? supabaseClient.from('applications').insert(payload)
        : supabaseClient.from('applications').update(payload).eq('id', editingJobId);
      const { error } = await request;
      if (error) {
        alert(`Não foi possível ${editingJobId === null ? 'salvar' : 'editar'} a candidatura: ${error.message}`);
        return;
      }
      event.target.reset();
      closeModal();
      await loadJobs();
    }
    function render() { updateCurrentDate(); renderStats(); renderFilters(); renderJobs(); lucide.createIcons(); }
    document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
    document.getElementById('detailsModal').addEventListener('click', e => { if (e.target.id === 'detailsModal') closeDetails(); });
    document.getElementById('confirmModal').addEventListener('click', e => { if (e.target.id === 'confirmModal') closeConfirm(); });
    loadJobs();
    setInterval(updateCurrentDate, 60000);
    lucide.createIcons();
