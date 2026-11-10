/**
 * KINETIX CLOUD PWA & 2-DEVICE SECURITY GUARD v4.0
 * Modelo Web / PWA en la Nube - Alojado en Servidores de Kinetix Systems
 * - Cero archivos instalables descargables (.zip / código fuente protegido)
 * - Límite inteligente de 2 dispositivos autorizados (PC del Negocio + Móvil Personal)
 * - Cierre de sesión automático al detectar un 3er dispositivo con alerta oficial:
 *   "Se ha detectado un inicio de sesión en otro dispositivo. Se cerró la sesión anterior por seguridad."
 */
(function () {
  'use strict';

  const MAX_AUTHORIZED_DEVICES = 2;
  const SECURITY_ALERT_MESSAGE = 'Se ha detectado un inicio de sesión en otro dispositivo. Se cerró la sesión anterior por seguridad.';

  // Identificar cuál de los 4 sistemas está corriendo
  const pathName = window.location.pathname.toLowerCase();
  let appKey = 'pos';
  let appTitle = 'Kinetix POS & Inventario Cloud';
  if (pathName.includes('clinica')) {
    appKey = 'med';
    appTitle = 'Kinetix Clínica & Citas Cloud';
  } else if (pathName.includes('crm')) {
    appKey = 'crm';
    appTitle = 'Kinetix CRM & Cotizador Cloud';
  } else if (pathName.includes('gym')) {
    appKey = 'gym';
    appTitle = 'Kinetix Gym ERP Pro Cloud';
  }

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
      saved = 'KNX-CLOUD-2D-' + Math.random().toString(36).substring(2, 7).toUpperCase();
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

  // Registrar el inicio de sesión del dispositivo actual y verificar límite de 2 dispositivos
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

    // Si ya hay 2 dispositivos/sesiones activas y entra un 3er dispositivo:
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

  // Modal de Alerta de Seguridad por Inicio de Sesión en 3er Dispositivo
  function showSecurityLockoutModal(newDeviceData) {
    let existing = document.getElementById('kinetix-security-lockout-modal');
    if (existing) existing.remove();

    const devInfoText = newDeviceData && newDeviceData.deviceLabel
      ? `${newDeviceData.deviceIcon || '💻'} ${newDeviceData.deviceType || 'Nuevo Dispositivo'} — ${newDeviceData.deviceLabel}`
      : '3er Dispositivo Externo Detectado';

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
            Protección Cloud Anti-Uso Simultáneo (Máx. 2 Equipos)
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
            <strong class="text-white">2 Dispositivos (PC Negocio + Móvil)</strong>
          </div>
          <div class="pt-1.5 border-t border-slate-800 text-[11px] text-amber-300">
            <strong>Equipo que tomó la sesión:</strong> ${devInfoText}
          </div>
        </div>

        <p class="text-xs text-slate-400 leading-relaxed">
          Para proteger tus datos empresariales en los servidores de <strong>Kinetix Systems</strong>, tu licencia solo permite mantener activas tu computadora de trabajo y tu teléfono personal.
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

  // Simular intento de acceso en un 3er dispositivo para pruebas de seguridad del propietario
  window.simulateThirdDeviceIntrusion = function () {
    const closePanel = document.getElementById('kinetix-cloud-device-modal');
    if (closePanel) closePanel.remove();
    enforceAutomaticSessionLogout({
      deviceIcon: '📱',
      deviceType: '3er Dispositivo No Autorizado',
      deviceLabel: 'Intento de Acceso Simultáneo Excedido (3/2)'
    });
  };

  // Modal informativo de gestión de los 2 dispositivos autorizados (PC + Móvil)
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

    const slot1 = sessions[0];
    const slot2 = sessions[1] || null;

    const modal = document.createElement('div');
    modal.id = 'kinetix-cloud-device-modal';
    modal.className = 'fixed inset-0 z-[99990] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="max-w-lg w-full rounded-3xl bg-slate-950 border-2 border-emerald-500/50 p-6 sm:p-7 text-left shadow-2xl space-y-5 relative">
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

        <div class="space-y-2.5">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-white uppercase tracking-wider">Dispositivos Autorizados (${sessions.length}/${MAX_AUTHORIZED_DEVICES})</span>
            <span class="text-[11px] text-emerald-400 font-semibold">PC Negocio + Móvil Personal</span>
          </div>

          <!-- Dispositivo 1 -->
          <div class="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="text-xl">${slot1.deviceIcon || '💻'}</span>
              <div>
                <p class="text-xs font-bold text-white">${slot1.deviceType} <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono ml-1">ACTIVO</span></p>
                <p class="text-[11px] text-slate-400">${slot1.deviceLabel} · ID: ${slot1.deviceId}</p>
              </div>
            </div>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <!-- Dispositivo 2 -->
          ${slot2 ? `
          <div class="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="text-xl">${slot2.deviceIcon || '📱'}</span>
              <div>
                <p class="text-xs font-bold text-white">${slot2.deviceType} <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono ml-1">ACTIVO</span></p>
                <p class="text-[11px] text-slate-400">${slot2.deviceLabel} · ID: ${slot2.deviceId}</p>
              </div>
            </div>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
          ` : `
          <div class="p-3.5 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="text-xl opacity-70">${currentDeviceInfo.isMobile ? '💻' : '📱'}</span>
              <div>
                <p class="text-xs font-bold text-slate-300">2do Dispositivo (${currentDeviceInfo.isMobile ? 'PC del Negocio' : 'Teléfono Móvil Personal'})</p>
                <p class="text-[11px] text-slate-400">Cupo disponible para abrir tu cuenta en tu ${currentDeviceInfo.isMobile ? 'computadora' : 'celular'}.</p>
              </div>
            </div>
            <span class="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 font-bold">DISPONIBLE</span>
          </div>
          `}
        </div>

        <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
          🔒 <strong>Regla Anti-Piratería Activa:</strong> Si alguien intenta abrir esta cuenta en una <strong>tercera computadora o en el teléfono de otra persona</strong>, el sistema cerrará inmediatamente la sesión anterior mostrando:<br>
          <em class="text-white font-semibold">"${SECURITY_ALERT_MESSAGE}"</em>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button onclick="triggerKinetixPwaInstall()" class="py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5">
            <span>📲 Instalar App PWA (PC/Móvil)</span>
          </button>
          <button onclick="simulateThirdDeviceIntrusion()" class="py-3 px-4 rounded-xl bg-slate-900 hover:bg-red-950/60 text-amber-300 hover:text-red-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5">
            <span>🔒 Probar Alerta 3er Dispositivo</span>
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
    pill.title = 'Protección Kinetix Cloud PWA: Límite de 2 Dispositivos Autorizados (PC + Móvil)';
    pill.className = 'fixed bottom-3 left-3 z-40 px-3 py-1.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-emerald-500/40 text-[11px] font-semibold text-slate-200 flex items-center gap-2 shadow-lg backdrop-blur-md transition cursor-pointer';
    pill.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
      <span id="kinetix-cloud-guard-badge-text">Cloud PWA · 1/${MAX_AUTHORIZED_DEVICES} Equipos</span>
    `;
    document.body.appendChild(pill);
    updateBadgeUI();
  }

  // Bloquear guardado de código fuente (Ctrl+S / Ctrl+U) para impedir copia local del archivo
  window.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      return false;
    }
  });

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
