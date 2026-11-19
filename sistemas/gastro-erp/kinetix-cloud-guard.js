/**
 * KINETIX CLOUD PWA & MULTI-DEVICE SECURITY GUARD v4.5
 * Modelo Web / PWA en la Nube - Alojado en Servidores de Kinetix Systems
 * - Cero archivos instalables descargables (.zip / código fuente protegido)
 * - Límite inteligente de dispositivos acorde a la cantidad de usuarios del sistema:
 *   · Gastro ERP + POS + KDS: 5 Usuarios = Máx. 5 Dispositivos Simultáneos
 *   · POS / Gimnasios / Clínicas / CRM: 4 Usuarios = Máx. 4 Dispositivos Simultáneos
 * - Cierre de sesión automático al exceder el límite de dispositivos con alerta oficial:
 *   "Se ha detectado un inicio de sesión en otro dispositivo. Se cerró la sesión anterior por seguridad."
 */
(function () {
  'use strict';

  const SECURITY_ALERT_MESSAGE = 'Se ha detectado un inicio de sesión en otro dispositivo. Se cerró la sesión anterior por seguridad.';

  // Identificar cuál de los 5 sistemas está corriendo
  const pathName = window.location.pathname.toLowerCase();
  let appKey = 'pos';
  let appTitle = 'Kinetix POS & Inventario Cloud';
  if (pathName.includes('gastro') || pathName.includes('restaurante')) {
    appKey = 'gastro';
    appTitle = 'Kinetix Gastro ERP + POS + KDS Pro Cloud';
  } else if (pathName.includes('clinica')) {
    appKey = 'med';
    appTitle = 'Kinetix Clínica & Citas Cloud';
  } else if (pathName.includes('crm')) {
    appKey = 'crm';
    appTitle = 'Kinetix CRM & Cotizador Cloud';
  } else if (pathName.includes('gym')) {
    appKey = 'gym';
    appTitle = 'Kinetix Gym ERP Pro Cloud';
  }

  const MAX_DEVICES_BY_APP = {
    gastro: 5,
    pos: 4,
    gym: 4,
    med: 4,
    crm: 4
  };
  const MAX_AUTHORIZED_DEVICES = MAX_DEVICES_BY_APP[appKey] || 4;

  const OFFICIAL_CHECKOUT_URLS = {
    gastro: 'https://www.paypal.com/ncp/payment/U6STW4GVVER82',
    pos: 'https://www.paypal.com/ncp/payment/6N33BA6V5CXM4',
    gym: 'https://www.paypal.com/ncp/payment/F9BEG5X5AJWR8',
    med: 'https://www.paypal.com/ncp/payment/D7L3CB8AWY75Y',
    crm: 'https://www.paypal.com/ncp/payment/5LX3ZS2TR4A22'
  };

  const MAIN_STORAGE_KEYS = {
    gastro: 'kinetix_gastro_erp_pro_v5_state',
    pos: 'KINETIX_POS_SUITE_V3',
    gym: 'kinetix_gym_erp_pro_v1',
    med: 'KINETIX_MED_SUITE_V3',
    crm: 'KINETIX_CRM_SUITE_V3'
  };

  const STORAGE_SESSIONS_KEY = 'KINETIX_CLOUD_SESSIONS_' + appKey.toUpperCase();
  const STORAGE_LICENSE_KEY = 'KINETIX_CLOUD_LICENSE_' + appKey.toUpperCase();
  const STORAGE_DEVICE_ID_KEY = 'KINETIX_DEVICE_FINGERPRINT_ID';

  // Detectar tipo de dispositivo actual (PC vs Móvil)
  function detectDeviceInfo() {
    const ua = navigator.userAgent || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    let os = 'Windows PC';
    if (/iPhone|iPad|iPod/i.test(ua)) os = 'iPhone / iOS';
    else if (/Android/i.test(ua)) os = 'Android Móvil';
    else if (/Mac/i.test(ua)) os = 'MacOS';
    else if (/Linux/i.test(ua)) os = 'Linux PC';

    let browser = 'Chrome';
    if (/Edg/i.test(ua)) browser = 'Edge';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';

    return {
      type: isMobile ? 'Móvil Personal' : 'PC del Negocio',
      icon: isMobile ? '📱' : '💻',
      label: `${os} (${browser})`,
      isMobile: isMobile
    };
  }

  // Obtener o generar huella única del dispositivo
  function getOrCreateDeviceId() {
    let devId = localStorage.getItem(STORAGE_DEVICE_ID_KEY);
    if (!devId) {
      const info = detectDeviceInfo();
      const prefix = info.isMobile ? 'MOV' : 'PC';
      devId = prefix + '-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString(36).slice(-4).toUpperCase();
      localStorage.setItem(STORAGE_DEVICE_ID_KEY, devId);
    }
    return devId;
  }

  // Token único por pestaña/instancia abierta para control estricto de sesiones simultáneas
  function getOrCreateInstanceToken() {
    let token = sessionStorage.getItem('KINETIX_INSTANCE_SESSION_TOKEN');
    if (!token) {
      token = 'SES-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now();
      sessionStorage.setItem('KINETIX_INSTANCE_SESSION_TOKEN', token);
    }
    return token;
  }

  // Obtener o activar Licencia Cloud desde URL (?licencia=...) o localStorage
  function getOrCreateLicense() {
    const params = new URLSearchParams(window.location.search);
    const urlLic = params.get('licencia');
    if (urlLic) {
      localStorage.setItem(STORAGE_LICENSE_KEY, urlLic.trim().toUpperCase());
      return urlLic.trim().toUpperCase();
    }
    let saved = localStorage.getItem(STORAGE_LICENSE_KEY);
    if (!saved) {
      saved = `KNX-CLOUD-${MAX_AUTHORIZED_DEVICES}U-` + Math.random().toString(36).substring(2, 7).toUpperCase();
      localStorage.setItem(STORAGE_LICENSE_KEY, saved);
    }
    return saved;
  }

  const currentDeviceId = getOrCreateDeviceId();
  const currentInstanceToken = getOrCreateInstanceToken();
  const currentDeviceInfo = detectDeviceInfo();
  const currentLicense = getOrCreateLicense();

  // Canal de comunicación en tiempo real entre pestañas/sesiones
  let guardChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      guardChannel = new BroadcastChannel('kinetix_cloud_guard_' + appKey);
    }
  } catch (e) {}

  function getActiveSessions() {
    try {
      const raw = localStorage.getItem(STORAGE_SESSIONS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveActiveSessions(list) {
    try {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  // Registrar el inicio de sesión del dispositivo actual y verificar límite acorde a los usuarios de la licencia
  function registerDeviceSessionOnLogin() {
    let sessions = getActiveSessions();
    const now = Date.now();

    // Limpiar sesiones inactivas de más de 24 horas
    sessions = sessions.filter(s => (now - (s.lastSeen || 0)) < 24 * 60 * 60 * 1000);

    // Verificar si esta misma instancia ya está registrada
    const existingIdx = sessions.findIndex(s => s.instanceToken === currentInstanceToken);
    if (existingIdx !== -1) {
      sessions[existingIdx].lastSeen = now;
      saveActiveSessions(sessions);
      updateBadgeUI();
      return;
    }

    // Si ya se alcanzó el máximo de dispositivos/usuarios activos y entra uno nuevo:
    // Cerrar automáticamente la sesión anterior más antigua
    const revokedTokens = [];
    while (sessions.length >= MAX_AUTHORIZED_DEVICES) {
      const oldest = sessions.shift();
      if (oldest && oldest.instanceToken) {
        revokedTokens.push(oldest.instanceToken);
      }
    }

    const newSession = {
      instanceToken: currentInstanceToken,
      deviceId: currentDeviceId,
      deviceType: currentDeviceInfo.type,
      deviceIcon: currentDeviceInfo.icon,
      deviceLabel: currentDeviceInfo.label,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastSeen: now
    };

    sessions.push(newSession);
    saveActiveSessions(sessions);
    updateBadgeUI();

    if (revokedTokens.length > 0) {
      const payload = {
        type: 'SESSION_REVOKED',
        revokedTokens: revokedTokens,
        newDevice: newSession,
        reason: SECURITY_ALERT_MESSAGE,
        timestamp: now
      };
      try {
        localStorage.setItem('KINETIX_LAST_REVOKED_EVENT_' + appKey.toUpperCase(), JSON.stringify(payload));
      } catch (e) {}
      if (guardChannel) {
        try { guardChannel.postMessage(payload); } catch (e) {}
      }
    }
  }

  // Ejecutar cierre forzoso de sesión en el dispositivo desplazado y mostrar alerta oficial
  function enforceAutomaticSessionLogout(newDeviceData) {
    // Si el sistema tiene función logout(), invocarla inmediatamente
    try {
      if (typeof window.logout === 'function') {
        window.logout();
      } else {
        const appContainer = document.getElementById('app-container');
        const loginScreen = document.getElementById('login-screen');
        if (appContainer && loginScreen) {
          appContainer.classList.add('hidden');
          loginScreen.classList.remove('hidden');
        }
      }
    } catch (e) {}

    showSecurityLockoutModal(newDeviceData);
  }

  // Modal de Alerta de Seguridad por Exceder el Límite de Dispositivos de la Licencia
  function showSecurityLockoutModal(newDeviceData) {
    let existing = document.getElementById('kinetix-security-lockout-modal');
    if (existing) existing.remove();

    const devInfoText = newDeviceData && newDeviceData.deviceLabel
      ? `${newDeviceData.deviceIcon || '💻'} ${newDeviceData.deviceType || 'Nuevo Dispositivo'} — ${newDeviceData.deviceLabel}`
      : `Dispositivo Externo #${MAX_AUTHORIZED_DEVICES + 1} Detectado`;

    const modal = document.createElement('div');
    modal.id = 'kinetix-security-lockout-modal';
    modal.className = 'fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="max-w-md w-full rounded-3xl bg-slate-950 border-2 border-red-500/80 p-6 sm:p-8 text-center shadow-2xl space-y-5 animate-fade-in" style="box-shadow: 0 0 60px -10px rgba(239, 68, 68, 0.45);">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400">
          <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>

        <div class="space-y-2">
          <span class="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            Protección Cloud Anti-Uso Simultáneo (Máx. ${MAX_AUTHORIZED_DEVICES} Equipos)
          </span>
          <h3 class="text-xl font-black text-white leading-snug pt-1">
            ${SECURITY_ALERT_MESSAGE}
          </h3>
        </div>

        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2">
          <div class="flex items-center justify-between text-slate-400">
            <span>Licencia Cloud:</span>
            <strong class="font-mono text-emerald-400">${currentLicense}</strong>
          </div>
          <div class="flex items-center justify-between text-slate-400">
            <span>Límite Autorizado:</span>
            <strong class="text-white">${MAX_AUTHORIZED_DEVICES} Dispositivos (${MAX_AUTHORIZED_DEVICES} Usuarios)</strong>
          </div>
          <div class="pt-1.5 border-t border-slate-800 text-[11px] text-amber-300">
            <strong>Equipo que tomó la sesión:</strong> ${devInfoText}
          </div>
        </div>

        <p class="text-xs text-slate-400 leading-relaxed">
          Para proteger tus datos empresariales en los servidores de <strong>Kinetix Systems</strong>, tu licencia permite mantener hasta <strong>${MAX_AUTHORIZED_DEVICES} dispositivos activos simultáneos</strong> (1 por cada usuario autorizado).
        </p>

        <button id="kinetix-lockout-ack-btn" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 hover:opacity-95 text-slate-950 font-black text-sm transition cursor-pointer shadow-lg">
          Entendido · Volver a Iniciar Sesión Aquí
        </button>
      </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('kinetix-lockout-ack-btn').onclick = function () {
      modal.remove();
    };
  }

  // Escuchar eventos de revocación desde otras pestañas/dispositivos
  if (guardChannel) {
    guardChannel.onmessage = function (ev) {
      const data = ev.data;
      if (data && data.type === 'SESSION_REVOKED' && Array.isArray(data.revokedTokens)) {
        if (data.revokedTokens.includes(currentInstanceToken)) {
          enforceAutomaticSessionLogout(data.newDevice);
        } else {
          updateBadgeUI();
        }
      }
    };
  }

  window.addEventListener('storage', function (ev) {
    if (ev.key === 'KINETIX_LAST_REVOKED_EVENT_' + appKey.toUpperCase() && ev.newValue) {
      try {
        const data = JSON.parse(ev.newValue);
        if (data && Array.isArray(data.revokedTokens) && data.revokedTokens.includes(currentInstanceToken)) {
          enforceAutomaticSessionLogout(data.newDevice);
        } else {
          updateBadgeUI();
        }
      } catch (e) {}
    }
  });

  // Interceptar handleLogin y logout de forma transparente sin tocar el código original
  function hookAuthFunctions() {
    if (typeof window.handleLogin === 'function' && !window.handleLogin._kinetixHooked) {
      const origLogin = window.handleLogin;
      window.handleLogin = function () {
        const result = origLogin.apply(this, arguments);
        const appContainer = document.getElementById('app-container');
        if (appContainer && !appContainer.classList.contains('hidden')) {
          registerDeviceSessionOnLogin();
        }
        return result;
      };
      window.handleLogin._kinetixHooked = true;
    }

    if (typeof window.logout === 'function' && !window.logout._kinetixHooked) {
      const origLogout = window.logout;
      window.logout = function () {
        let sessions = getActiveSessions().filter(s => s.instanceToken !== currentInstanceToken);
        saveActiveSessions(sessions);
        updateBadgeUI();
        return origLogout.apply(this, arguments);
      };
      window.logout._kinetixHooked = true;
    }
  }

  // Capturar evento nativo de instalación PWA en Chrome/Edge/Android
  let deferredPwaPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPwaPrompt = e;
    updateBadgeUI();
  });

  window.triggerKinetixPwaInstall = async function () {
    if (deferredPwaPrompt) {
      deferredPwaPrompt.prompt();
      await deferredPwaPrompt.userChoice;
      deferredPwaPrompt = null;
      return;
    }
    alert(
      '📲 INSTALAR APLICACIÓN WEB EN LA NUBE (PWA):\n\n' +
      '• En Android (Chrome): Toca los 3 puntos arriba a la derecha y selecciona "Instalar aplicación" o "Agregar a la pantalla principal".\n' +
      '• En iPhone / iPad (Safari): Toca el botón Compartir (cuadro con flecha) y selecciona "Agregar a inicio".\n' +
      '• En PC (Chrome / Edge): Haz clic en el icono de pantalla/instalar en el lado derecho de la barra de direcciones.\n\n' +
      '🔒 Tu sistema corre 100% seguro desde los servidores de Kinetix con actualizaciones automáticas.'
    );
  };

  // Simular intento de acceso excediendo el límite de dispositivos autorizados para pruebas de seguridad
  window.simulateThirdDeviceIntrusion = function () {
    const closePanel = document.getElementById('kinetix-cloud-device-modal');
    if (closePanel) closePanel.remove();
    enforceAutomaticSessionLogout({
      deviceIcon: '📱',
      deviceType: `Dispositivo #${MAX_AUTHORIZED_DEVICES + 1} No Autorizado`,
      deviceLabel: `Intento de Acceso Simultáneo Excedido (${MAX_AUTHORIZED_DEVICES + 1}/${MAX_AUTHORIZED_DEVICES})`
    });
  };

  // Modal informativo de gestión de los dispositivos autorizados acorde al número de usuarios
  window.openKinetixDeviceGuardModal = function () {
    let existing = document.getElementById('kinetix-cloud-device-modal');
    if (existing) {
      existing.remove();
      return;
    }

    let sessions = getActiveSessions();
    if (sessions.length === 0) {
      sessions = [{
        instanceToken: currentInstanceToken,
        deviceId: currentDeviceId,
        deviceType: currentDeviceInfo.type,
        deviceIcon: currentDeviceInfo.icon,
        deviceLabel: currentDeviceInfo.label,
        loginTime: 'Activo ahora'
      }];
    }

    let slotsHtml = '';
    for (let i = 0; i < MAX_AUTHORIZED_DEVICES; i++) {
      const s = sessions[i];
      if (s) {
        slotsHtml += `
          <div class="p-3 rounded-2xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="text-xl">${s.deviceIcon || '💻'}</span>
              <div>
                <p class="text-xs font-bold text-white">${s.deviceType} · Equipo #${i + 1} <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono ml-1">ACTIVO</span></p>
                <p class="text-[11px] text-slate-400">${s.deviceLabel} · ID: ${s.deviceId}</p>
              </div>
            </div>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 ${i === 0 ? 'animate-ping' : ''}"></span>
          </div>
        `;
      } else {
        slotsHtml += `
          <div class="p-3 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="text-xl opacity-70">🖥️</span>
              <div>
                <p class="text-xs font-bold text-slate-300">Dispositivo #${i + 1} (Usuario / Estación #${i + 1})</p>
                <p class="text-[11px] text-slate-400">Cupo disponible para abrir tu sistema en otra PC, tablet o móvil de tu equipo.</p>
              </div>
            </div>
            <span class="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 font-bold">DISPONIBLE</span>
          </div>
        `;
      }
    }

    const modal = document.createElement('div');
    modal.id = 'kinetix-cloud-device-modal';
    modal.className = 'fixed inset-0 z-[99990] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto';
    modal.innerHTML = `
      <div class="max-w-lg w-full rounded-3xl bg-slate-950 border-2 border-emerald-500/50 p-6 sm:p-7 text-left shadow-2xl space-y-4 relative my-auto">
        <button onclick="document.getElementById('kinetix-cloud-device-modal').remove()" class="absolute top-4 right-5 text-slate-400 hover:text-white text-2xl leading-none cursor-pointer">&times;</button>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl font-bold">
            🛡️
          </div>
          <div>
            <span class="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">Servidores Kinetix Cloud · PWA Activa</span>
            <h3 class="text-lg font-black text-white">${appTitle}</h3>
          </div>
        </div>

        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Licencia Asignada:</span>
            <span class="font-mono font-bold text-emerald-400">${currentLicense}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Arquitectura:</span>
            <span class="text-white font-semibold">Web / PWA en la Nube (Cero Instaladores Locales)</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Actualizaciones:</span>
            <span class="text-cyan-400 font-semibold">✓ Automáticas en Tiempo Real</span>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-white uppercase tracking-wider">Dispositivos Autorizados (${sessions.length}/${MAX_AUTHORIZED_DEVICES})</span>
            <span class="text-[11px] text-emerald-400 font-semibold">1 Equipo por cada Usuario (${MAX_AUTHORIZED_DEVICES} Usuarios)</span>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
            ${slotsHtml}
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
          🔒 <strong>Regla Anti-Piratería Activa:</strong> Si se intenta abrir esta cuenta en un <strong>dispositivo #${MAX_AUTHORIZED_DEVICES + 1} externo o no autorizado</strong>, el sistema cerrará inmediatamente la sesión anterior mostrando:<br>
          <em class="text-white font-semibold">"${SECURITY_ALERT_MESSAGE}"</em>
        </div>

        <div class="grid grid-cols-1 gap-2.5 pt-1">
          <button onclick="simulateThirdDeviceIntrusion()" class="py-3 px-4 rounded-xl bg-slate-900 hover:bg-red-950/60 text-amber-300 hover:text-red-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5">
            <span>🔒 Probar Alerta de Seguridad al Exceder ${MAX_AUTHORIZED_DEVICES} Equipos</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  function updateBadgeUI() {
    const badgeText = document.getElementById('kinetix-cloud-guard-badge-text');
    if (!badgeText) return;
    const count = Math.min(Math.max(getActiveSessions().length, 1), MAX_AUTHORIZED_DEVICES);
    badgeText.textContent = `Cloud PWA · ${count}/${MAX_AUTHORIZED_DEVICES} Equipos`;
  }

  function injectCloudSecurityBadge() {
    if (document.getElementById('kinetix-cloud-guard-pill')) return;

    // Agregar enlace al manifest PWA si no existe
    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '../manifest.json';
      document.head.appendChild(link);
    }

    const pill = document.createElement('button');
    pill.id = 'kinetix-cloud-guard-pill';
    pill.type = 'button';
    pill.onclick = window.openKinetixDeviceGuardModal;
    pill.title = `Protección Kinetix Cloud PWA: Límite de ${MAX_AUTHORIZED_DEVICES} Dispositivos Autorizados (1 por Usuario)`;
    pill.className = 'fixed bottom-3 left-3 z-40 px-3 py-1.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-emerald-500/40 text-[11px] font-semibold text-slate-200 flex items-center gap-2 shadow-lg backdrop-blur-md transition cursor-pointer';
    pill.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
      <span id="kinetix-cloud-guard-badge-text">Cloud PWA · 1/${MAX_AUTHORIZED_DEVICES} Equipos</span>
    `;
    document.body.appendChild(pill);
    updateBadgeUI();
  }

  // Bloquear guardado o extracción de código fuente (Ctrl+S / Ctrl+U / F12) para impedir copia local o reventa
  window.addEventListener('keydown', function (e) {
    if (
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
    ) {
      e.preventDefault();
      return false;
    }
  });

  window.addEventListener('contextmenu', function (e) {
    if (isDemo) {
      e.preventDefault();
      return false;
    }
  });


  // ========================================================
  // KINETIX DEMO SECURITY & EPHEMERAL GUARD v5.0
  // Límite estricto de 5 acciones / artículos en modo prueba
  // Restablecimiento automático a la información inicial al salir/entrar
  // ========================================================

  const DEMO_MAX_ACTIONS = 5;

  function isPaidLicenseActive() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('entrega') || params.has('licencia') || params.get('plan') === 'full') {
        localStorage.setItem(STORAGE_LICENSE_KEY, 'PAID_ACTIVE');
        return true;
      }
      const savedLic = localStorage.getItem(STORAGE_LICENSE_KEY);
      if (savedLic && (savedLic === 'PAID_ACTIVE' || savedLic.startsWith('KX-') || savedLic === 'VITALICIA')) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  const isDemo = !isPaidLicenseActive();

  // 1. Restablecimiento automático a la información inicial al salir y volver a entrar
  if (isDemo) {
    try {
      const sessionActive = sessionStorage.getItem('KINETIX_DEMO_ACTIVE_' + appKey);
      if (!sessionActive) {
        const mainStorageKey = MAIN_STORAGE_KEYS[appKey] || 'KINETIX_POS_SUITE_V3';
        localStorage.removeItem(mainStorageKey);
        sessionStorage.removeItem('KINETIX_DEMO_ACTIONS_' + appKey);
        sessionStorage.setItem('KINETIX_DEMO_ACTIVE_' + appKey, '1');
      }
    } catch (e) {}
  }

  window.triggerKinetixDemoBuy = function (e) {
    try {
      if (window.parent && window.parent !== window) {
        if (e) e.preventDefault();
        window.parent.postMessage({ type: 'KINETIX_OPEN_CHECKOUT', appKey: appKey }, '*');
        return false;
      }
    } catch (err) {}
    return true;
  };

  function getDemoActionCount() {
    try {
      return parseInt(sessionStorage.getItem('KINETIX_DEMO_ACTIONS_' + appKey) || '0', 10);
    } catch (e) { return 0; }
  }

  function canPerformDemoAction(actionName) {
    if (!isDemo) return true; // Licencia comprada: operaciones ilimitadas
    
    let count = getDemoActionCount();
    if (count >= DEMO_MAX_ACTIONS) {
      showDemoLockoutModal(actionName);
      return false;
    }
    
    count++;
    try {
      sessionStorage.setItem('KINETIX_DEMO_ACTIONS_' + appKey, count.toString());
    } catch (e) {}
    updateDemoFloatingBadge(count);
    return true;
  }

  function showDemoLockoutModal(actionName) {
    let existing = document.getElementById('kinetix-demo-limit-modal');
    if (existing) existing.remove();

    const checkoutUrl = OFFICIAL_CHECKOUT_URLS[appKey] || OFFICIAL_CHECKOUT_URLS.pos;

    const modal = document.createElement('div');
    modal.id = 'kinetix-demo-limit-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.92);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;';

    modal.innerHTML = `
      <div style="max-width:440px;width:100%;background:#0f172a;border:2px solid #10b981;border-radius:24px;padding:28px 24px;text-align:center;box-shadow:0 25px 50px -12px rgba(0,0,0,0.7);color:#ffffff;box-sizing:border-box;">
        <div style="width:64px;height:64px;border-radius:18px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:32px;">
          🔒
        </div>
        <div style="display:inline-block;padding:4px 12px;border-radius:999px;background:rgba(245,158,11,0.2);color:#fcd34d;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:10px;border:1px solid rgba(245,158,11,0.3);">
          Límite de Prueba Alcanzado (Modo Demo)
        </div>
        <h3 style="font-size:20px;font-weight:800;color:#ffffff;margin:0 0 8px;line-height:1.25;">
          Has alcanzado el límite de 5 operaciones permitidas
        </h3>
        <p style="font-size:12.5px;color:#cbd5e1;line-height:1.5;margin:0 0 16px;">
          Este demo es únicamente para probar las funciones en el momento. Para registrar ventas, inventario, clientes y reportes <strong>ilimitados de por vida</strong> sin restricciones, activa tu Licencia Oficial.
        </p>

        <div style="background:rgba(15,23,42,0.8);border:1px solid #334155;border-radius:12px;padding:12px 14px;margin-bottom:18px;text-align:left;font-size:12px;">
          <div style="color:#34d399;font-weight:600;margin-bottom:6px;">✓ Acceso vitalicio sin suscripciones ni mensualidades</div>
          <div style="color:#34d399;font-weight:600;margin-bottom:6px;">✓ Base de datos permanente protegida en la nube</div>
          <div style="color:#34d399;font-weight:600;">✓ Hasta ${MAX_AUTHORIZED_DEVICES} Dispositivos simultáneos (1 por Usuario)</div>
        </div>

        <a href="${checkoutUrl}" onclick="return window.triggerKinetixDemoBuy(event)" target="_blank" style="display:block;width:100%;padding:14px;background:linear-gradient(135deg,#10b981,#14b8a6);color:#022c22;font-size:14px;font-weight:800;border-radius:14px;text-decoration:none;box-shadow:0 10px 15px -3px rgba(16,185,129,0.3);box-sizing:border-box;">
          Comprar y Activar Licencia ($89 USD) &rarr;
        </a>

        <button id="kinetix-demo-close-lockout" style="margin-top:14px;background:transparent;border:none;color:#94a3b8;font-size:12px;cursor:pointer;text-decoration:underline;">
          Cerrar y continuar explorando en modo lectura
        </button>
      </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('kinetix-demo-close-lockout').onclick = function () {
      modal.remove();
    };
  }

  function updateDemoFloatingBadge(count) {
    if (!isDemo) return;
    let badge = document.getElementById('kinetix-demo-floating-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'kinetix-demo-floating-badge';
      badge.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:99990;background:#0f172a;border:1px solid #10b981;border-radius:999px;padding:6px 14px;display:flex;align-items:center;gap:8px;box-shadow:0 10px 25px rgba(0,0,0,0.5);font-family:system-ui,-apple-system,sans-serif;font-size:12px;';
      document.body.appendChild(badge);
    }
    const isFull = count >= DEMO_MAX_ACTIONS;
    const checkoutUrl = OFFICIAL_CHECKOUT_URLS[appKey] || OFFICIAL_CHECKOUT_URLS.pos;
    badge.innerHTML = `
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${isFull ? '#ef4444' : '#10b981'};"></span>
      <span style="color:#ffffff;font-weight:700;">Demo:</span>
      <span style="color:${isFull ? '#f87171' : '#34d399'};font-weight:800;">${count}/${DEMO_MAX_ACTIONS} acciones</span>
      <a href="${checkoutUrl}" onclick="return window.triggerKinetixDemoBuy(event)" target="_blank" style="margin-left:4px;padding:3px 10px;background:#10b981;color:#022c22;font-size:10.5px;font-weight:800;border-radius:999px;text-decoration:none;">
        Comprar ($89)
      </a>
    `;
  }

  // Exponer interfaz global KinetixDemoGuard
  window.KinetixDemoGuard = {
    isDemo: isDemo,
    maxActions: DEMO_MAX_ACTIONS,
    canPerformAction: canPerformDemoAction,
    getActionCount: getDemoActionCount,
    showLockoutModal: showDemoLockoutModal,
    resetDemoData: function () {
      const mainStorageKey = MAIN_STORAGE_KEYS[appKey] || 'KINETIX_POS_SUITE_V3';
      localStorage.removeItem(mainStorageKey);
      sessionStorage.removeItem('KINETIX_DEMO_ACTIONS_' + appKey);
      sessionStorage.removeItem('KINETIX_DEMO_ACTIVE_' + appKey);
    }
  };

  if (isDemo) {
    setTimeout(function () {
      updateDemoFloatingBadge(getDemoActionCount());
    }, 600);
  }

  function initGuard() {
    hookAuthFunctions();
    injectCloudSecurityBadge();

    // Si se pasa ?test_tercer_dispositivo=1 en la URL, mostrar demostración de bloqueo
    const params = new URLSearchParams(window.location.search);
    if (params.get('test_tercer_dispositivo') === '1') {
      setTimeout(function () {
        window.simulateThirdDeviceIntrusion();
      }, 600);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuard);
  } else {
    initGuard();
  }
})();
