/**
 * KINETIX CLOUD PWA, MULTI-DEVICE SECURITY GUARD & GLOBAL I18N ENGINE v5.5
 * Modelo Web / PWA en la Nube - Alojado en Servidores de Kinetix Systems
 * - Traducción integral en tiempo real (ES / EN / PT / FR) de encabezados,
 *   descripciones, subtítulos, botones, placeholders, tooltips y textos dinámicos
 * - Detección automática por región (USA/UK/CA -> EN, Brasil/Portugal -> PT, Francia -> FR, LATAM/España -> ES)
 * - Límite de dispositivos acorde a la cantidad de usuarios (5 en Gastro, 4 en POS/Gym/Med/CRM)
 * - Límite de 5 acciones en Modo Demo en Vivo con sincronización bidireccional Portal <-> Demo
 * - 100% Abierto a buscadores y crawlers internacionales (Cero bloqueo de bots)
 */
(function () {
  'use strict';

  // ============================================================================
  // 1. DETECCIÓN REGIONAL AUTOMÁTICA & MOTOR MULTI-IDIOMA (ES / EN / PT / FR)
  // ============================================================================
  const SUPPORTED_LANGS = ['es', 'en', 'pt', 'fr'];
  const LANG_STORAGE_KEY = 'KINETIX_GLOBAL_LANG';

  function detectVisitorLanguage() {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = (params.get('lang') || '').toLowerCase().slice(0, 2);
      if (SUPPORTED_LANGS.includes(urlLang)) {
        localStorage.setItem(LANG_STORAGE_KEY, urlLang);
        return urlLang;
      }

      const saved = (localStorage.getItem(LANG_STORAGE_KEY) || '').toLowerCase().slice(0, 2);
      if (SUPPORTED_LANGS.includes(saved)) {
        return saved;
      }

      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
      const navLangs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'es'])
        .map(l => String(l || '').toLowerCase());
      const primaryNav = (navLangs[0] || 'es').slice(0, 2);

      const ptZones = [
        'america/sao_paulo', 'america/fortaleza', 'america/manaus', 'america/recife',
        'america/belem', 'america/bahia', 'america/cuiaba', 'america/campo_grande',
        'america/porto_velho', 'america/boa_vista', 'america/maceio', 'america/araguaina',
        'america/noronha', 'america/rio_branco', 'america/santarem',
        'europe/lisbon', 'atlantic/madeira', 'atlantic/azores'
      ];
      if (ptZones.includes(tz) || primaryNav === 'pt') return 'pt';

      const frZones = [
        'europe/paris', 'america/montreal', 'indian/reunion', 'africa/abidjan',
        'africa/dakar', 'america/guadeloupe', 'america/martinique', 'america/cayenne'
      ];
      if (frZones.includes(tz) || primaryNav === 'fr') return 'fr';

      const esZones = [
        'america/managua', 'america/costa_rica', 'america/mexico_city', 'america/cancun',
        'america/tijuana', 'america/merida', 'america/monterrey', 'america/chihuahua',
        'america/mazatlan', 'america/hermosillo', 'america/guatemala', 'america/el_salvador',
        'america/tegucigalpa', 'america/panama', 'america/santo_domingo', 'america/puerto_rico',
        'america/havana', 'america/bogota', 'america/lima', 'america/guayaquil',
        'america/caracas', 'america/la_paz', 'america/santiago', 'america/asuncion',
        'america/montevideo', 'america/argentina', 'europe/madrid', 'atlantic/canary'
      ];
      if (esZones.some(z => tz.startsWith(z))) return 'es';

      const enZones = [
        'america/new_york', 'america/chicago', 'america/denver', 'america/los_angeles',
        'america/phoenix', 'america/anchorage', 'pacific/honolulu', 'america/detroit',
        'america/indiana', 'america/kentucky', 'america/boise', 'america/toronto',
        'america/vancouver', 'america/edmonton', 'america/winnipeg', 'america/halifax',
        'europe/london', 'europe/dublin', 'australia/', 'pacific/auckland'
      ];
      if (enZones.some(z => tz.startsWith(z)) || primaryNav === 'en') return 'en';

      if (SUPPORTED_LANGS.includes(primaryNav)) return primaryNav;
    } catch (e) {}
    return 'es';
  }

  let currentLang = detectVisitorLanguage();

  const GUARD_UI_TEXTS = {
    es: {
      securityAlert: 'Se ha detectado un inicio de sesión en otro dispositivo. Se cerró la sesión anterior por seguridad.',
      cloudPill: (c, m) => `Cloud PWA · ${c}/${m} Equipos`,
      cloudPillTitle: (m) => `Protección Kinetix Cloud PWA: Límite de ${m} Dispositivos Autorizados (1 por Usuario)`,
      demoWord: 'Demo:',
      actionsWord: 'acciones',
      buyBtnShort: 'Comprar ($89)',
      demoLimitBadge: 'Límite de Prueba Alcanzado (Modo Demo)',
      demoLimitTitle: 'Has alcanzado el límite de 5 operaciones permitidas',
      demoLimitDesc: 'Este demo es únicamente para probar las funciones en el momento. Para registrar ventas, inventario, clientes y reportes <strong>ilimitados de por vida</strong> sin restricciones, activa tu Licencia Oficial.',
      demoBullet1: '✓ Acceso vitalicio sin suscripciones ni mensualidades',
      demoBullet2: '✓ Base de datos permanente protegida en la nube',
      demoBullet3: (m) => `✓ Hasta ${m} Dispositivos simultáneos (1 por Usuario)`,
      demoBuyCta: 'Comprar y Activar Licencia ($89 USD) →',
      demoCloseReadonly: 'Cerrar y continuar explorando en modo lectura',
      deviceModalSub: 'Servidores Kinetix Cloud · PWA Activa',
      licenseAssigned: 'Licencia Asignada:',
      architectureLbl: 'Arquitectura:',
      architectureVal: 'Web / PWA en la Nube (Cero Instaladores Locales)',
      updatesLbl: 'Actualizaciones:',
      updatesVal: '✓ Automáticas en Tiempo Real',
      langLbl: 'Idioma Activo:',
      authDevicesTitle: (c, m) => `Dispositivos Autorizados (${c}/${m})`,
      onePerUser: (m) => `1 Equipo por cada Usuario (${m} Usuarios)`,
      activeTag: 'ACTIVO',
      availableTag: 'DISPONIBLE',
      deviceWord: 'Equipo',
      availSlotDesc: 'Cupo disponible para abrir tu sistema en otra PC, tablet o móvil de tu equipo.',
      antiPiracyTitle: 'Regla Anti-Piratería Activa:',
      antiPiracyDesc: (m) => `Si se intenta abrir esta cuenta en un <strong>dispositivo #${m + 1} externo o no autorizado</strong>, el sistema cerrará inmediatamente la sesión anterior mostrando:`,
      testAlertBtn: (m) => `🔒 Probar Alerta de Seguridad al Exceder ${m} Equipos`,
      lockoutBadge: (m) => `Protección Cloud Anti-Uso Simultáneo (Máx. ${m} Equipos)`,
      lockoutLimitVal: (m) => `${m} Dispositivos (${m} Usuarios)`,
      lockoutTakenBy: 'Equipo que tomó la sesión:',
      lockoutFooter: (m) => `Para proteger tus datos empresariales en los servidores de <strong>Kinetix Systems</strong>, tu licencia permite mantener hasta <strong>${m} dispositivos activos simultáneos</strong> (1 por cada usuario autorizado).`,
      lockoutAckBtn: 'Entendido · Volver a Iniciar Sesión Aquí',
      settingsLangCardTitle: '🌐 Idioma del Sistema / System Language (Multi-Idioma Global)',
      settingsLangCardDesc: 'Cambia el idioma completo de la interfaz en tiempo real (Español, English, Português, Français).'
    },
    en: {
      securityAlert: 'A login was detected on another device. The previous session was closed for security.',
      cloudPill: (c, m) => `Cloud PWA · ${c}/${m} Devices`,
      cloudPillTitle: (m) => `Kinetix Cloud PWA Protection: Limit of ${m} Authorized Devices (1 per User)`,
      demoWord: 'Demo:',
      actionsWord: 'actions',
      buyBtnShort: 'Buy Now ($89)',
      demoLimitBadge: 'Trial Limit Reached (Live Demo Mode)',
      demoLimitTitle: 'You have reached the limit of 5 allowed trial actions',
      demoLimitDesc: 'This live demo is for testing features immediately. To record <strong>unlimited lifetime</strong> sales, inventory, clients, and reports without restrictions, activate your Official License.',
      demoBullet1: '✓ Lifetime access with zero monthly fees or subscriptions',
      demoBullet2: '✓ Permanent business database protected in the cloud',
      demoBullet3: (m) => `✓ Up to ${m} Simultaneous Devices (1 per User)`,
      demoBuyCta: 'Buy & Activate Cloud License ($89 USD) →',
      demoCloseReadonly: 'Close and continue exploring in read-only mode',
      deviceModalSub: 'Kinetix Cloud Servers · Active PWA',
      licenseAssigned: 'Assigned License:',
      architectureLbl: 'Architecture:',
      architectureVal: 'Cloud Web / PWA (Zero Local Installers)',
      updatesLbl: 'Updates:',
      updatesVal: '✓ Automatic in Real Time',
      langLbl: 'Active Language:',
      authDevicesTitle: (c, m) => `Authorized Devices (${c}/${m})`,
      onePerUser: (m) => `1 Device per User (${m} Users)`,
      activeTag: 'ACTIVE',
      availableTag: 'AVAILABLE',
      deviceWord: 'Device',
      availSlotDesc: 'Available slot to open your system on another PC, tablet, or phone for your team.',
      antiPiracyTitle: 'Active Anti-Piracy Rule:',
      antiPiracyDesc: (m) => `If someone tries to open this account on an <strong>unauthorized device #${m + 1}</strong>, the system will immediately close the oldest session displaying:`,
      testAlertBtn: (m) => `🔒 Test Security Alert When Exceeding ${m} Devices`,
      lockoutBadge: (m) => `Anti-Concurrent Use Cloud Protection (Max ${m} Devices)`,
      lockoutLimitVal: (m) => `${m} Devices (${m} Users)`,
      lockoutTakenBy: 'Device that took the session:',
      lockoutFooter: (m) => `To protect your business data on <strong>Kinetix Systems</strong> servers, your license allows up to <strong>${m} simultaneous active devices</strong> (1 per authorized user).`,
      lockoutAckBtn: 'Understood · Log In Here Again',
      settingsLangCardTitle: '🌐 System Language / Idioma del Sistema (Global Multi-Language)',
      settingsLangCardDesc: 'Switch the entire interface language in real time (Español, English, Português, Français).'
    },
    pt: {
      securityAlert: 'Foi detectado um login em outro dispositivo. A sessão anterior foi encerrada por segurança.',
      cloudPill: (c, m) => `Cloud PWA · ${c}/${m} Dispositivos`,
      cloudPillTitle: (m) => `Proteção Kinetix Cloud PWA: Limite de ${m} Dispositivos Autorizados (1 por Usuário)`,
      demoWord: 'Demo:',
      actionsWord: 'ações',
      buyBtnShort: 'Comprar ($89)',
      demoLimitBadge: 'Limite de Teste Atingido (Modo Demo)',
      demoLimitTitle: 'Você atingiu o limite de 5 operações permitidas no teste',
      demoLimitDesc: 'Esta demonstração serve apenas para testar os recursos no momento. Para registrar vendas, estoque, clientes e relatórios <strong>ilimitados vitalícios</strong> sem restrições, ative sua Licença Oficial.',
      demoBullet1: '✓ Acesso vitalício sem assinaturas ou mensalidades',
      demoBullet2: '✓ Banco de dados permanente protegido na nuvem',
      demoBullet3: (m) => `✓ Até ${m} Dispositivos simultâneos (1 por Usuário)`,
      demoBuyCta: 'Comprar e Ativar Licença ($89 USD) →',
      demoCloseReadonly: 'Fechar e continuar explorando em modo leitura',
      deviceModalSub: 'Servidores Kinetix Cloud · PWA Ativo',
      licenseAssigned: 'Licença Atribuída:',
      architectureLbl: 'Arquitetura:',
      architectureVal: 'Web / PWA na Nuvem (Zero Instaladores Locais)',
      updatesLbl: 'Atualizações:',
      updatesVal: '✓ Automáticas em Tempo Real',
      langLbl: 'Idioma Ativo:',
      authDevicesTitle: (c, m) => `Dispositivos Autorizados (${c}/${m})`,
      onePerUser: (m) => `1 Dispositivo por Usuário (${m} Usuários)`,
      activeTag: 'ATIVO',
      availableTag: 'DISPONÍVEL',
      deviceWord: 'Dispositivo',
      availSlotDesc: 'Vaga disponível para abrir seu sistema em outro PC, tablet ou celular da sua equipe.',
      antiPiracyTitle: 'Regra Antipirataria Ativa:',
      antiPiracyDesc: (m) => `Se alguém tentar abrir esta conta em um <strong>dispositivo #${m + 1} externo ou não autorizado</strong>, o sistema encerrará imediatamente a sessão anterior exibindo:`,
      testAlertBtn: (m) => `🔒 Testar Alerta de Segurança ao Exceder ${m} Dispositivos`,
      lockoutBadge: (m) => `Proteção Cloud Contra Uso Simultâneo (Máx. ${m} Dispositivos)`,
      lockoutLimitVal: (m) => `${m} Dispositivos (${m} Usuários)`,
      lockoutTakenBy: 'Dispositivo que assumiu a sessão:',
      lockoutFooter: (m) => `Para proteger seus dados empresariais nos servidores da <strong>Kinetix Systems</strong>, sua licença permite manter até <strong>${m} dispositivos ativos simultâneos</strong> (1 por usuário autorizado).`,
      lockoutAckBtn: 'Entendido · Fazer Login Aqui Novamente',
      settingsLangCardTitle: '🌐 Idioma do Sistema / System Language (Multi-Idioma Global)',
      settingsLangCardDesc: 'Altere o idioma completo da interface em tempo real (Español, English, Português, Français).'
    },
    fr: {
      securityAlert: 'Une connexion a été détectée sur un autre appareil. La session précédente a été fermée par sécurité.',
      cloudPill: (c, m) => `Cloud PWA · ${c}/${m} Appareils`,
      cloudPillTitle: (m) => `Protection Kinetix Cloud PWA : Limite de ${m} Appareils Autorisés (1 par Utilisateur)`,
      demoWord: 'Démo :',
      actionsWord: 'actions',
      buyBtnShort: 'Acheter (89 $)',
      demoLimitBadge: 'Limite d’Essai Atteinte (Mode Démo)',
      demoLimitTitle: 'Vous avez atteint la limite de 5 opérations autorisées',
      demoLimitDesc: 'Cette démo permet de tester les fonctionnalités en direct. Pour enregistrer des ventes, stocks, clients et rapports <strong>illimités à vie</strong> sans restriction, activez votre Licence Officielle.',
      demoBullet1: '✓ Accès à vie sans abonnement ni frais mensuels',
      demoBullet2: '✓ Base de données permanente protégée dans le cloud',
      demoBullet3: (m) => `✓ Jusqu’à ${m} Appareils simultanés (1 par Utilisateur)`,
      demoBuyCta: 'Acheter et Activer la Licence (89 $ USD) →',
      demoCloseReadonly: 'Fermer et continuer en mode lecture seule',
      deviceModalSub: 'Serveurs Kinetix Cloud · PWA Active',
      licenseAssigned: 'Licence Attribuée :',
      architectureLbl: 'Architecture :',
      architectureVal: 'Web / PWA dans le Cloud (Zéro Installateur Local)',
      updatesLbl: 'Mises à jour :',
      updatesVal: '✓ Automatiques en Temps Réel',
      langLbl: 'Langue Active :',
      authDevicesTitle: (c, m) => `Appareils Autorisés (${c}/${m})`,
      onePerUser: (m) => `1 Appareil par Utilisateur (${m} Utilisateurs)`,
      activeTag: 'ACTIF',
      availableTag: 'DISPONIBLE',
      deviceWord: 'Appareil',
      availSlotDesc: 'Emplacement disponible pour ouvrir votre système sur un autre PC, tablette ou mobile.',
      antiPiracyTitle: 'Règle Anti-Piratage Active :',
      antiPiracyDesc: (m) => `Si quelqu’un tente d’ouvrir ce compte sur un <strong>appareil #${m + 1} non autorisé</strong>, le système fermera immédiatement la session précédente en affichant :`,
      testAlertBtn: (m) => `🔒 Tester l’Alerte de Sécurité au-delà de ${m} Appareils`,
      lockoutBadge: (m) => `Protection Cloud Anti-Usage Simultané (Max. ${m} Appareils)`,
      lockoutLimitVal: (m) => `${m} Appareils (${m} Utilisateurs)`,
      lockoutTakenBy: 'Appareil ayant pris la session :',
      lockoutFooter: (m) => `Pour protéger vos données sur les serveurs <strong>Kinetix Systems</strong>, votre licence autorise jusqu’à <strong>${m} appareils actifs simultanés</strong> (1 par utilisateur autorisé).`,
      lockoutAckBtn: 'Compris · Se Reconnecter Ici',
      settingsLangCardTitle: '🌐 Langue du Système / System Language (Multilingue Global)',
      settingsLangCardDesc: 'Changez la langue complète de l’interface en temps réel (Español, English, Português, Français).'
    }
  };

  // Diccionario exhaustivo: encabezados, descripciones, subtítulos, botones, placeholders y tooltips
  // Formato: [Español, English, Português, Français]
  const UI_PHRASE_TABLE = [
    // === BARRA DEMO, TOP BAR & GLOBAL ===
    ['DEMO EN VIVO FUNCIONAL', 'LIVE FUNCTIONAL DEMO', 'DEMO AO VIVO FUNCIONAL', 'DÉMO EN DIRECT FONCTIONNELLE'],
    ['Sistema de Gestión Integral para Restaurantes & Cafeterías — Kinetix Gastro ERP + POS + KDS Pro', 'All-in-One Restaurant & Cafe Management System — Kinetix Gastro ERP + POS + KDS Pro', 'Sistema de Gestão Integral para Restaurantes e Cafeterias — Kinetix Gastro ERP + POS + KDS Pro', 'Système de Gestion Intégral pour Restaurants & Cafés — Kinetix Gastro ERP + POS + KDS Pro'],
    ['Sistema de Facturación, POS y Control de Inventarios Cloud v4.0', 'Cloud Invoicing, POS & Inventory Control System v4.0', 'Sistema de Faturamento, PDV e Controle de Estoque Cloud v4.0', 'Système de Facturation, PDV et Contrôle des Stocks Cloud v4.0'],
    ['Sistema de Expedientes Clínicos, Consultas, Citas y Recordatorios Cloud v4.0', 'Cloud Medical Records, Consultations, Appointments & Reminders System v4.0', 'Sistema de Prontuários Clínicos, Consultas, Agendamentos e Lembretes Cloud v4.0', 'Système de Dossiers Médicaux, Consultations, Rendez-vous et Rappels Cloud v4.0'],
    ['Sistema CRM, Cotizador PDF y Automatización de Clientes Cloud v4.0', 'Cloud CRM, PDF Quoter & Client Automation System v4.0', 'Sistema CRM, Orçamentos PDF e Automação de Clientes Cloud v4.0', 'Système CRM, Devis PDF et Automatisation Clients Cloud v4.0'],
    ['PIN de prueba Admin Principal:', 'Main Admin Trial PIN:', 'PIN de teste Admin Principal:', 'PIN d’essai Admin Principal :'],
    ['Comprar Este Sistema ($89 USD)', 'Buy This System ($89 USD)', 'Comprar Este Sistema ($89 USD)', 'Acheter Ce Système (89 $ USD)'],
    ['✕ Cerrar Demo', '✕ Close Demo', '✕ Fechar Demo', '✕ Fermer Démo'],
    ['Cerrar Demo', 'Close Demo', 'Fechar Demo', 'Fermer Démo'],
    ['Cerrar Sesión / Salir', 'Log Out / Exit', 'Sair / Encerrar Sessão', 'Déconnexion / Quitter'],
    ['Salir', 'Log Out', 'Sair', 'Quitter'],
    ['Modo Claro', 'Light Mode', 'Modo Claro', 'Mode Clair'],
    ['Modo Oscuro', 'Dark Mode', 'Modo Escuro', 'Mode Sombre'],
    ['← Volver al Catálogo', '← Back to Catalog', '← Voltar ao Catálogo', '← Retour au Catalogue'],
    ['Volver al Catálogo', 'Back to Catalog', 'Voltar ao Catálogo', 'Retour au Catalogue'],
    ['Alternar Modo Oscuro / Claro', 'Toggle Dark / Light Mode', 'Alternar Modo Escuro / Claro', 'Basculer Mode Sombre / Clair'],
    ['Conmutar Modo Oscuro / Modo Claro en tiempo real', 'Toggle Dark / Light Mode in real time', 'Alternar Modo Escuro / Claro em tempo real', 'Basculer Mode Sombre / Clair en temps réel'],
    ['Restaurar datos iniciales de demostración', 'Restore initial demo data', 'Restaurar dados iniciais da demonstração', 'Restaurer les données de démo initiales'],
    ['Reiniciar Datos Demo', 'Reset Demo Data', 'Reiniciar Dados Demo', 'Réinitialiser Démo'],
    ['Mostrar Barra Demo Kinetix ($89 USD)', 'Show Kinetix Demo Bar ($89 USD)', 'Mostrar Barra Demo Kinetix ($89 USD)', 'Afficher la Barre Démo Kinetix (89 $ USD)'],

    // === LOGIN SCREEN (GASTRO, POS, MED, CRM) ===
    ['Portal Corporativo de Acceso para Personal Autorizado', 'Corporate Access Portal for Authorized Staff', 'Portal Corporativo de Acesso para Pessoal Autorizado', 'Portail d’Accès Corporatif pour le Personnel Autorisé'],
    ['Restaurantes, Cafeterías de Especialidad, Bares & Food Trucks', 'Restaurants, Specialty Coffee Shops, Bars & Food Trucks', 'Restaurantes, Cafeterias Especiais, Bares e Food Trucks', 'Restaurants, Cafés de Spécialité, Bars & Food Trucks'],
    ['Abrir Portal del Menú Digital & QR (Vista Comensal)', 'Open Digital & QR Menu Portal (Guest View)', 'Abrir Portal do Cardápio Digital e QR (Visão Cliente)', 'Ouvrir le Portail Menu Numérique & QR (Vue Client)'],
    ['Conectividad integral en tiempo real entre', 'Full real-time connectivity between', 'Conectividade integral em tempo real entre', 'Connectivité intégrale en temps réel entre'],
    ['AUTOCOMPLETADO RÁPIDO — 5 ROLES DE PRUEBA (RBAC):', 'QUICK AUTOCOMPLETE — 5 TRIAL ROLES (RBAC):', 'PREENCHIMENTO RÁPIDO — 5 PERFIS DE TESTE (RBAC):', 'SAISIE RAPIDE — 5 RÔLES D’ESSAI (RBAC) :'],
    ['Autocompletado Rápido — 5 Roles de Prueba (RBAC):', 'Quick Autocomplete — 5 Trial Roles (RBAC):', 'Preenchimento Rápido — 5 Perfis de Teste (RBAC):', 'Saisie Rapide — 5 Rôles d’Essai (RBAC) :'],
    ['Toca un rol para autocompletar o doble clic para entrar', 'Tap a role to autocomplete or double-click to log in', 'Toque em um perfil para preencher ou clique duplo para entrar', 'Touchez un rôle pour remplir ou double-cliquez pour entrer'],
    ['CONTROL DE ACCESO RBAC', 'RBAC ACCESS CONTROL', 'CONTROLE DE ACESSO RBAC', 'CONTRÔLE D’ACCÈS RBAC'],
    ['CONTROL DE ACCESO POR ROLES (RBAC)', 'ROLE-BASED ACCESS CONTROL (RBAC)', 'CONTROLE DE ACESSO POR PERFIS (RBAC)', 'CONTRÔLE D’ACCÈS PAR RÔLES (RBAC)'],
    ['Ingresa tu Usuario/Correo y PIN asignado, o utiliza los botones de acceso rápido de demostración.', 'Enter your assigned Username/Email and PIN, or use the quick demo access buttons.', 'Digite seu Usuário/E-mail e PIN atribuído ou use os botões de acesso rápido da demo.', 'Saisissez votre Identifiant/E-mail et code PIN, ou utilisez les boutons d’accès rapide démo.'],
    ['Usuario o Correo Corporativo', 'Username or Corporate Email', 'Usuário ou E-mail Corporativo', 'Utilisateur ou E-mail Corporatif'],
    ['PIN / Contraseña de Acceso', 'Access PIN / Password', 'PIN / Senha de Acesso', 'PIN / Mot de Passe d’Accès'],
    ['Autocompletar Admin (1234)', 'Autocomplete Admin (1234)', 'Preencher Admin (1234)', 'Remplir Admin (1234)'],
    ['Ingresar al Sistema Kinetix Gastro ERP', 'Sign In to Kinetix Gastro ERP', 'Entrar no Sistema Kinetix Gastro ERP', 'Se Connecter à Kinetix Gastro ERP'],
    ['Acceso Rápido Demo (Autocompletar y Entrar en 1 Clic)', 'Quick Demo Access (Autocomplete & Enter in 1 Click)', 'Acesso Rápido Demo (Preencher e Entrar em 1 Clique)', 'Accès Rapide Démo (Saisie Auto & Entrer en 1 Clic)'],
    ['Ingresar al Sistema', 'Sign In to System', 'Entrar no Sistema', 'Se Connecter au Système'],
    ['Entrar al Sistema Cloud', 'Sign In to Cloud System', 'Entrar no Sistema Cloud', 'Accéder au Système Cloud'],
    ['📘 Descargar Manual Oficial Kinetix Gastro ERP (PDF)', '📘 Download Official Kinetix Gastro ERP Manual (PDF)', '📘 Baixar Manual Oficial Kinetix Gastro ERP (PDF)', '📘 Télécharger le Manuel Officiel Kinetix Gastro ERP (PDF)'],
    ['Entrar 1-Clic →', '1-Click Sign In →', 'Entrar 1-Clique →', 'Entrer en 1 Clic →'],
    ['Todas las Áreas & Gerencia', 'All Areas & Management', 'Todas as Áreas e Gerência', 'Tous Secteurs & Direction'],
    ['Caja Central & Barra Express', 'Main Cashier & Express Bar', 'Caixa Central e Bar Express', 'Caisse Centrale & Bar Express'],
    ['Salón Principal', 'Main Dining Room', 'Salão Principal', 'Salle Principale'],
    ['Terraza & Jardín', 'Terrace & Garden', 'Terraço e Jardim', 'Terrasse & Jardin'],
    ['Cocina Caliente & Barra de Café (KDS)', 'Hot Kitchen & Coffee Bar (KDS)', 'Cozinha Quente e Bar de Café (KDS)', 'Cuisine Chaude & Bar Café (KDS)'],
    ['Selecciona tu Usuario (1 Principal + 3 Roles)', 'Select Your User (1 Master + 3 Roles)', 'Selecione seu Usuário (1 Principal + 3 Perfis)', 'Sélectionnez votre Utilisateur (1 Principal + 3 Rôles)'],
    ['Demo / Inicial: PIN del Admin Principal es', 'Demo / Initial: Main Admin PIN is', 'Demo / Inicial: PIN do Admin Principal é', 'Démo / Initial : Le PIN de l’Admin Principal est'],
    ['Demo / Inicial: PIN del Director Principal es', 'Demo / Initial: Main Director PIN is', 'Demo / Inicial: PIN do Diretor Principal é', 'Démo / Initial : Le PIN du Directeur Principal est'],
    ['PIN incorrecto. Verifica tus credenciales.', 'Incorrect PIN. Please verify your credentials.', 'PIN incorreto. Verifique suas credenciais.', 'PIN incorrect. Vérifiez vos identifiants.'],
    ['Licencia Activa:', 'Active License:', 'Licença Ativa:', 'Licence Active :'],
    ['Licencia Corporativa · Máx. 4 Usuarios', 'Corporate License · Max 4 Users', 'Licença Corporativa · Máx. 4 Usuários', 'Licence Entreprise · Max 4 Utilisateurs'],
    ['LICENCIA PARA 4 USUARIOS CON ROLES', 'LICENSE FOR 4 ROLE-BASED USERS', 'LICENÇA PARA 4 USUÁRIOS COM PERFIS', 'LICENCE POUR 4 UTILISATEURS PAR RÔLES'],
    ['LICENCIA COMERCIAL 4 USUARIOS', '4-USER COMMERCIAL LICENSE', 'LICENÇA COMERCIAL 4 USUÁRIOS', 'LICENCE COMMERCIALE 4 UTILISATEURS'],

    // === NAVEGACIÓN & ROLES ===
    ['Dashboard Ejecutivo en Tiempo Real', 'Real-Time Executive Dashboard', 'Dashboard Executivo em Tempo Real', 'Tableau de Bord Exécutif en Temps Réel'],
    ['Mesas, Toma de Pedidos & Menú QR', 'Tables, Order Taking & QR Menu', 'Mesas, Pedidos e Cardápio QR', 'Tables, Prise de Commande & Menu QR'],
    ['POS & Facturación / Corte de Caja', 'POS & Billing / Cash Register Close', 'PDV e Faturamento / Fechamento de Caixa', 'PDV & Facturation / Clôture de Caisse'],
    ['Monitor de Cocina & Barra (KDS)', 'Kitchen & Bar Display Monitor (KDS)', 'Monitor de Cozinha e Bar (KDS)', 'Moniteur Cuisine & Bar (KDS)'],
    ['Inventario, Recetas (Escandallos) & Stock', 'Inventory, Recipes (Costing) & Stock', 'Estoque, Fichas Técnicas (Receitas) e Insumos', 'Inventaire, Recettes & Stock'],
    ['Finanzas (Diario Digital, CxC & CxP)', 'Finance (Daily Ledger, AR & AP)', 'Finanças (Diário Digital, Contas a Receber e Pagar)', 'Finances (Journal, Créances & Dettes)'],
    ['Proveedores Gastronómicos', 'Food & Beverage Suppliers', 'Fornecedores Gastronômicos', 'Fournisseurs Gastronomiques'],
    ['Control de 5 Usuarios & Roles (RBAC)', '5 Users & Roles Control (RBAC)', 'Controle de 5 Usuários e Perfis (RBAC)', 'Contrôle de 5 Utilisateurs & Rôles (RBAC)'],
    ['Personalizar Marca & Configuración', 'Customize Brand & Configuration', 'Personalizar Marca e Configuração', 'Personnaliser Marque & Configuration'],
    ['Manual de Uso & Procesos (PDF)', 'User Manual & Processes (PDF)', 'Manual de Uso e Processos (PDF)', 'Manuel d’Utilisation & Processus (PDF)'],
    ['📱 Portal Menú Digital & QR', '📱 Digital QR Menu Portal', '📱 Portal Cardápio Digital e QR', '📱 Portail Menu Numérique & QR'],
    ['ROL ACTIVO (AISLAMIENTO RBAC)', 'ACTIVE ROLE (RBAC ISOLATION)', 'PERFIL ATIVO (ISOLAMENTO RBAC)', 'RÔLE ACTIF (ISOLATION RBAC)'],
    ['Usuario 1 — Super Admin / Gerente General', 'User 1 — Super Admin / General Manager', 'Usuário 1 — Super Admin / Gerente Geral', 'Utilisateur 1 — Super Admin / Directeur Général'],
    ['Usuario 2 — Cajero / Encargado de Facturación', 'User 2 — Cashier / Billing Manager', 'Usuário 2 — Caixa / Faturamento', 'Utilisateur 2 — Caissier / Facturation'],
    ['Usuario 3 — Mesero Salón Principal', 'User 3 — Main Dining Server', 'Usuário 3 — Garçom Salão Principal', 'Utilisateur 3 — Serveur Salle Principale'],
    ['Usuario 4 — Mesero Terraza / Barra', 'User 4 — Terrace / Bar Server', 'Usuário 4 — Garçom Terraço / Bar', 'Utilisateur 4 — Serveur Terrasse / Bar'],
    ['Usuario 5 — Cocina & Barra (Operador KDS)', 'User 5 — Kitchen & Bar (KDS Operator)', 'Usuário 5 — Cozinha e Bar (Operador KDS)', 'Utilisateur 5 — Cuisine & Bar (Opérateur KDS)'],
    ['Probar Vista Rol:', 'Preview Role View:', 'Testar Visão do Perfil:', 'Tester Vue du Rôle :'],
    ['Flujo KDS:', 'KDS Flow:', 'Fluxo KDS:', 'Flux KDS :'],
    ['Paso a Cocina al Confirmar Pedido por Mesero', 'Send to Kitchen on Waiter Order Confirmation', 'Enviar à Cozinha ao Confirmar Pedido pelo Garçom', 'Envoyer en Cuisine dès Confirmation Serveur'],
    ['Paso a Cocina al Facturar en Caja POS', 'Send to Kitchen on POS Invoice Checkout', 'Enviar à Cozinha ao Faturar no Caixa PDV', 'Envoyer en Cuisine dès Facturation PDV'],
    ['Moneda:', 'Currency:', 'Moeda:', 'Devise :'],
    ['Menú QR', 'QR Menu', 'Cardápio QR', 'Menu QR'],
    ['Manual PDF', 'PDF Manual', 'Manual PDF', 'Manuel PDF'],
    ['Mesas/Menú', 'Tables/Menu', 'Mesas/Cardápio', 'Tables/Menu'],
    ['Caja POS', 'POS Cashier', 'Caixa PDV', 'Caisse PDV'],
    ['Cocina KDS', 'Kitchen KDS', 'Cozinha KDS', 'Cuisine KDS'],
    ['Recetas/Stock', 'Recipes/Stock', 'Receitas/Estoque', 'Recettes/Stock'],
    ['Finanzas', 'Finance', 'Finanças', 'Finances'],
    ['Proveedores', 'Suppliers', 'Fornecedores', 'Fournisseurs'],
    ['5 Usuarios', '5 Users', '5 Usuários', '5 Utilisateurs'],
    ['Marca/Config', 'Brand/Config', 'Marca/Config', 'Marque/Config'],
    ['En Vivo', 'Live', 'Ao Vivo', 'En Direct'],
    ['Salón', 'Dining', 'Salão', 'Salle'],

    // === DASHBOARD GASTRO ERP ===
    ['CENTRO DE COMANDO GASTRONÓMICO EN VIVO • ERP + POS + KDS', 'LIVE GASTRONOMIC COMMAND CENTER • ERP + POS + KDS', 'CENTRO DE COMANDO GASTRONÔMICO AO VIVO • ERP + PDV + KDS', 'CENTRE DE COMMANDE GASTRONOMIQUE EN DIRECT • ERP + PDV + KDS'],
    ['Monitoreo sincronizado entre salón, terraza, barra de café, facturación térmica POS, escandallos de inventario y pantallas KDS de cocina.', 'Synchronized monitoring across dining room, terrace, coffee bar, thermal POS billing, recipe inventory costing, and kitchen KDS screens.', 'Monitoramento sincronizado entre salão, terraço, bar de café, faturamento PDV térmico, fichas técnicas de estoque e telas KDS da cozinha.', 'Suivi synchronisé entre salle, terrasse, bar à café, facturation thermique PDV, fiches recettes et écrans cuisine KDS.'],
    ['Ir a Caja POS →', 'Go to POS Cashier →', 'Ir ao Caixa PDV →', 'Aller à la Caisse PDV →'],
    ['Monitor KDS →', 'KDS Monitor →', 'Monitor KDS →', 'Moniteur KDS →'],
    ['Ir al Mapa de Mesas', 'Go to Table Map', 'Ir ao Mapa de Mesas', 'Aller au Plan de Tables'],
    ['Ventas Facturadas Hoy', 'Invoiced Sales Today', 'Vendas Faturadas Hoje', 'Ventes Facturées Aujourd’hui'],
    ['Ticket Promedio POS', 'Average POS Ticket', 'Ticket Médio PDV', 'Ticket Moyen PDV'],
    ['Mesas Activas en Salón', 'Active Dining Tables', 'Mesas Ativas no Salão', 'Tables Actives en Salle'],
    ['Cocina KDS vs. Despachadas', 'Kitchen KDS vs. Delivered', 'Cozinha KDS vs. Entregues', 'Cuisine KDS vs. Livrées'],
    ['Ranking de Platillos Más Vendidos', 'Top-Selling Dishes & Drinks Ranking', 'Ranking de Pratos Mais Vendidos', 'Classement des Plats les Plus Vendus'],
    ['Rotación real en mesas, barra y delivery', 'Real turnover across tables, bar & delivery', 'Giro real em mesas, balcão e delivery', 'Rotation réelle sur tables, bar et livraison'],
    ['Últimas Facturas Térmicas Emitidas', 'Latest Issued Thermal Receipts', 'Últimos Cupons Térmicos Emitidos', 'Derniers Tickets Thermiques Émis'],
    ['Reimpresión térmica 58mm/80mm, envío WhatsApp y anulación auditada', '58mm/80mm thermal reprint, WhatsApp delivery & audited void', 'Reimpressão térmica 58mm/80mm, envio WhatsApp e cancelamento auditado', 'Réimpression thermique 58mm/80mm, envoi WhatsApp et annulation auditée'],
    ['Ver Ticket', 'View Receipt', 'Ver Cupom', 'Voir Ticket'],
    ['Alertas de Stock Mínimo por Receta', 'Minimum Stock Alerts by Recipe', 'Alertas de Estoque Mínimo por Receita', 'Alertes de Stock Minimum par Recette'],
    ['Insumos que requieren reposición inmediata', 'Ingredients requiring immediate restocking', 'Insumos que exigem reposição imediata', 'Ingrédients nécessitant un réapprovisionnement immédiat'],
    ['✓ Todos los insumos están por encima del punto de reorden.', '✓ All ingredients are above the reorder point.', '✓ Todos os insumos estão acima do ponto de reposição.', '✓ Tous les ingrédients sont au-dessus du seuil de réapprovisionnement.'],
    ['Bitácora de Auditoría (Anti-Robo Hormiga)', 'Audit Log (Anti-Shrinkage Security)', 'Auditoria (Segurança Anti-Desperdício)', 'Journal d’Audit (Sécurité Anti-Vol)'],
    ['Registro Secreto Exclusivo para Super Admin', 'Secret Log Exclusive to Super Admin', 'Registro Secreto Exclusivo do Super Admin', 'Journal Secret Exclusif au Super Admin'],
    ['Ver Bitácora Completa →', 'View Full Audit Log →', 'Ver Auditoria Completa →', 'Voir le Journal Complet →'],

    // === MESAS, MENÚ QR & TOMA DE ÓRDENES ===
    ['Toca cualquier mesa para abrir su comanda o facturarla en POS', 'Tap any table to open its order or bill it in POS', 'Toque em qualquer mesa para abrir a comanda ou faturar no PDV', 'Touchez une table pour ouvrir sa commande ou l’encaisser'],
    ['Estado del Salón, Terraza & Barra en Tiempo Real', 'Dining Room, Terrace & Bar Live Status', 'Status do Salão, Terraço e Bar em Tempo Real', 'État de la Salle, Terrasse & Bar en Temps Réel'],
    ['Estados por color, notas de alergia, fusión de mesas y división Split Bill.', 'Color-coded statuses, allergy notes, table merging & Split Bill.', 'Status por cor, notas de alergia, junção de mesas e divisão Split Bill.', 'Statuts par couleur, notes d’allergie, fusion de tables & Split Bill.'],
    ['Libre (Verde)', 'Available (Green)', 'Livre (Verde)', 'Libre (Vert)'],
    ['Ocupada / Cuenta (Ámbar)', 'Occupied / Bill (Amber)', 'Ocupada / Conta (Âmbar)', 'Occupée / Addition (Ambre)'],
    ['En Preparación (Azul)', 'In Preparation (Blue)', 'Em Preparo (Azul)', 'En Préparation (Bleu)'],
    ['¡Lista para Servir!', 'Ready to Serve!', 'Pronta para Servir!', 'Prête à Servir !'],
    ['Todas las Zonas', 'All Zones', 'Todas as Áreas', 'Toutes les Zones'],
    ['Para Llevar (Takeout)', 'Takeout Order', 'Para Viagem (Takeout)', 'À Emporter (Takeout)'],
    ['Delivery (Domicilio)', 'Home Delivery', 'Delivery (Entrega)', 'Livraison à Domicile'],
    ['En Mesa (Salón / Terraza)', 'Dine-In (Table / Terrace)', 'Na Mesa (Salão / Terraço)', 'Sur Place (Salle / Terrasse)'],
    ['Catálogo del Menú Digital (Toma Rápida de Pedido)', 'Digital Menu Catalog (Fast Order Taking)', 'Cardápio Digital (Lançamento Rápido de Pedido)', 'Catalogue du Menu Numérique (Prise de Commande Rapide)'],
    ['Toca cualquier platillo o café del catálogo izquierdo para añadirlo con sus modificadores.', 'Tap any dish or coffee from the catalog to add it with modifiers.', 'Toque em qualquer prato ou bebida do catálogo para adicionar com opcionais.', 'Touchez un plat ou une boisson du catalogue pour l’ajouter avec ses options.'],
    ['Buscar platillo, café de especialidad, corte o postre...', 'Search dish, specialty coffee, steak, or dessert...', 'Buscar prato, café especial, corte ou sobremesa...', 'Rechercher plat, café, viande ou dessert...'],
    ['Buscar plato o código...', 'Search dish or SKU...', 'Buscar prato ou código...', 'Rechercher plat ou code...'],
    ['Buscar café, bebida, postre...', 'Search coffee, drink, dessert...', 'Buscar café, bebida, sobremesa...', 'Rechercher café, boisson, dessert...'],
    ['Buscar producto o SKU...', 'Search product or SKU...', 'Buscar produto ou SKU...', 'Rechercher produit ou SKU...'],
    ['Todas las Categorías', 'All Categories', 'Todas as Categorias', 'Toutes Catégories'],
    ['Agregar al Pedido de la Mesa', 'Add to Table Order', 'Adicionar ao Pedido da Mesa', 'Ajouter à la Commande'],
    ['Personalizar Platillo / Modificadores', 'Customize Dish / Modifiers', 'Personalizar Prato / Adicionais', 'Personnaliser Plat / Modificateurs'],
    ['Elige 1 opción', 'Choose 1 option', 'Escolha 1 opção', 'Choisissez 1 option'],
    ['Opción múltiple', 'Multiple choice', 'Múltipla escolha', 'Choix multiple'],
    ['Nota Especial / Alergias', 'Special Note / Allergies', 'Observação Especial / Alergias', 'Note Spéciale / Allergies'],
    ['Ej: Sin cebolla, salsa aparte...', 'Ex: No onions, sauce on side...', 'Ex: Sem cebola, molho à parte...', 'Ex : Sans oignons, sauce à part...'],
    ['Nota especial de cocina (ej: sin cebolla, término medio...)', 'Special kitchen note (ex: no onions, medium rare...)', 'Nota especial de cozinha (ex: sem cebola, ao ponto...)', 'Note spéciale cuisine (ex : sans oignons, à point...)'],
    ['Confirmar Pedido a Mesa & Cocina (KDS)', 'Confirm Order to Table & Kitchen (KDS)', 'Confirmar Pedido para Mesa e Cozinha (KDS)', 'Confirmer Commande Table & Cuisine (KDS)'],
    ['🔥 Confirmar y Enviar Comanda a Cocina / Barra (KDS)', '🔥 Confirm & Send Ticket to Kitchen / Bar (KDS)', '🔥 Confirmar e Enviar Comanda para Cozinha / Bar (KDS)', '🔥 Confirmer & Envoyer Commande en Cuisine / Bar (KDS)'],
    ['💳 Pasar a Caja POS (Facturar Mesa o Dividir Cuenta)', '💳 Send to POS Cashier (Bill Table or Split Bill)', '💳 Ir para Caixa PDV (Faturar Mesa ou Dividir Conta)', '💳 Passer en Caisse PDV (Encaisser ou Diviser)'],
    ['Unir Mesas', 'Merge Tables', 'Juntar Mesas', 'Fusionner Tables'],
    ['Fusionar Mesas', 'Merge Tables', 'Unir Mesas', 'Fusionner les Tables'],
    ['Selecciona mesa a anexar...', 'Select table to merge...', 'Selecione a mesa para juntar...', 'Sélectionner la table à joindre...'],
    ['Generar QR de Mesa / Vista Cliente', 'Generate Table QR / Guest View', 'Gerar QR da Mesa / Visão Cliente', 'Générer QR Table / Vue Client'],
    ['+ Toca para abrir mesa', '+ Tap to open table', '+ Toque para abrir mesa', '+ Touchez pour ouvrir'],
    ['MENÚ DIGITAL INTERACTIVO & AUTO-PEDIDO QR', 'INTERACTIVE DIGITAL MENU & QR SELF-ORDER', 'CARDÁPIO DIGITAL INTERATIVO E AUTOATENDIMENTO QR', 'MENU NUMÉRIQUE INTERACTIF & COMMANDE QR'],
    ['ESCANEÁ Y PEDÍ DESDE TU MESA', 'SCAN & ORDER FROM YOUR TABLE', 'ESCANEIE E PEÇA DA SUA MESA', 'SCANNEZ & COMMANDEZ DEPUIS VOTRE TABLE'],
    ['Selecciona platillos o bebidas del menú digital para ordenar a tu mesa.', 'Select dishes or drinks from the digital menu to order to your table.', 'Selecione pratos ou bebidas do cardápio digital para pedir na sua mesa.', 'Sélectionnez plats ou boissons du menu pour commander à votre table.'],
    ['Oculta automáticamente platillos sin stock de insumos en su receta', 'Automatically hides dishes lacking ingredient stock in their recipe', 'Oculta automaticamente pratos sem estoque de ingredientes na receita', 'Masque automatiquement les plats en rupture de stock'],
    ['Pedir por WhatsApp', 'Order via WhatsApp', 'Pedir pelo WhatsApp', 'Commander par WhatsApp'],
    ['Tu Pedido en Mesa (QR)', 'Your Table Order (QR)', 'Seu Pedido na Mesa (QR)', 'Votre Commande à Table (QR)'],
    ['Cerrar Menú QR', 'Close QR Menu', 'Fechar Cardápio QR', 'Fermer le Menu QR'],

    // === POS & FACTURACIÓN / CORTE DE CAJA ===
    ['Facturar Mesa / Split Bill', 'Bill Table / Split Bill', 'Faturar Mesa / Split Bill', 'Encaisser Table / Split Bill'],
    ['Venta Directa en Barra (Cafetería Express / Mostrador)', 'Direct Bar Sale (Express Cafe / Counter)', 'Venda Direta no Balcão (Cafeteria Express)', 'Vente Directe au Comptoir (Café Express)'],
    ['Venta Directa en Barra (Cafetería Express)', 'Direct Bar Sale (Express Cafe)', 'Venda Direta no Balcão (Cafeteria Express)', 'Vente Directe au Comptoir (Café Express)'],
    ['Arqueo Ciego, Corte Z & Historial', 'Blind Cash Count, Z-Close & History', 'Conferência Cega, Fechamento Z e Histórico', 'Comptage Caisse, Clôture Z & Historique'],
    ['🔓 Abrir Gaveta (Auditado)', '🔓 Open Cash Drawer (Audited)', '🔓 Abrir Gaveta (Auditado)', '🔓 Ouvrir Tiroir-Caisse (Audité)'],
    ['Abrir Gaveta (Auditado)', 'Open Cash Drawer (Audited)', 'Abrir Gaveta (Auditado)', 'Ouvrir Tiroir-Caisse (Audité)'],
    ['1. Selecciona la Mesa u Orden Activa a Cobrar', '1. Select Active Table or Order to Bill', '1. Selecione a Mesa ou Pedido Ativo para Cobrar', '1. Sélectionnez la Table ou Commande Active'],
    ['Permite facturar la mesa completa o cobrar ítems individuales por comensal', 'Allows billing the entire table or charging individual items per guest', 'Permite faturar a mesa completa ou cobrar itens individuais por pessoa', 'Permet de facturer toute la table ou par articles (Split Bill)'],
    ['Activar Cobro por Ítems (Split Bill)', 'Enable Pay-by-Item Mode (Split Bill)', 'Ativar Cobrança por Itens (Split Bill)', 'Activer Paiement par Article (Split Bill)'],
    ['Modo Split Bill Activo (Por Ítems)', 'Split Bill Mode Active (By Items)', 'Modo Split Bill Ativo (Por Itens)', 'Mode Split Bill Actif (Par Articles)'],
    ['2. Liquidación, Impuestos, Propina & Pago', '2. Checkout, Taxes, Tip & Payment', '2. Liquidação, Impostos, Gorjeta e Pagamento', '2. Règlement, Taxes, Pourboire & Paiement'],
    ['Descuenta automáticamente los insumos de la receta al facturar', 'Automatically deducts recipe ingredients from stock upon billing', 'Baixa automaticamente os insumos da ficha técnica ao faturar', 'Déduit automatiquement les ingrédients du stock à la facturation'],
    ['Nombre Cliente / Razón Social', 'Customer Name / Business Name', 'Nome do Cliente / Razão Social', 'Nom du Client / Raison Sociale'],
    ['RUC / NIT / Cédula', 'Tax ID / EIN / National ID', 'CPF / CNPJ / Documento', 'SIRET / TVA / Identité'],
    ['Consumidor Final', 'Walk-in Customer', 'Consumidor Final', 'Client de Passage'],
    ['WhatsApp del Cliente (Para envío de ticket en 1 clic)', 'Customer WhatsApp (For 1-click receipt delivery)', 'WhatsApp do Cliente (Envio de cupom em 1 clique)', 'WhatsApp du Client (Envoi ticket en 1 clic)'],
    ['Ej: +50588889999', 'Ex: +1 555-234-5678', 'Ex: +55 11 99999-9999', 'Ex : +33 6 12 34 56 78'],
    ['Propina Sugerida (%)', 'Suggested Tip (%)', 'Gorjeta Sugerida (%)', 'Pourboire Suggéré (%)'],
    ['Descuento Autorizado (%)', 'Authorized Discount (%)', 'Desconto Autorizado (%)', 'Remise Autorisée (%)'],
    ['Método de Pago (Soporta Pagos Mixtos & CxC):', 'Payment Method (Supports Split Payment & Credit AR):', 'Forma de Pagamento (Suporta Misto e Fiado/AR):', 'Mode de Paiement (Mixte & Crédit Client) :'],
    ['Efectivo', 'Cash', 'Dinheiro', 'Espèces'],
    ['Tarjeta', 'Card', 'Cartão', 'Carte'],
    ['Transferencia', 'Transfer', 'Transferência', 'Virement'],
    ['Mixto', 'Split', 'Misto', 'Mixte'],
    ['Cargar a CxC', 'Charge to AR', 'Lançar em Conta', 'À Crédit'],
    ['Efectivo Recibido:', 'Cash Received:', 'Valor Recebido:', 'Espèces Reçues :'],
    ['VUELTO / CAMBIO A ENTREGAR:', 'CHANGE TO RETURN:', 'TROCO A DEVOLVER:', 'MONNAIE À RENDRE :'],
    ['VUELTO / CAMBIO:', 'CHANGE:', 'TROCO:', 'MONNAIE :'],
    ['Subtotal Mesa / Orden:', 'Table / Order Subtotal:', 'Subtotal Mesa / Pedido:', 'Sous-total Table / Commande :'],
    ['TOTAL A COBRAR:', 'TOTAL DUE:', 'TOTAL A COBRAR:', 'TOTAL À ENCAISSER :'],
    ['TOTAL A PAGAR:', 'TOTAL TO PAY:', 'TOTAL A PAGAR:', 'TOTAL À PAYER :'],
    ['Emitir Factura Térmica (58mm/80mm) & Descontar Receta', 'Issue Thermal Receipt (58mm/80mm) & Deduct Recipe Stock', 'Emitir Cupom Térmico (58mm/80mm) e Baixar Estoque', 'Émettre Ticket Thermique (58mm/80mm) & Déduire Stock'],
    ['Dividir Cuenta (Split Bill)', 'Split Bill', 'Dividir Conta (Split Bill)', 'Diviser l’Addition (Split Bill)'],
    ['División Rápida de Cuenta (Split Bill)', 'Quick Bill Splitting (Split Bill)', 'Divisão Rápida de Conta (Split Bill)', 'Division Rapide d’Addition (Split Bill)'],
    ['No hay mesas pendientes de cobro en este momento.', 'There are no tables pending checkout right now.', 'Não há mesas pendentes de pagamento no momento.', 'Aucune table en attente d’encaissement pour le moment.'],
    ['Toca los productos para facturar al instante y enviar a barra/cocina', 'Tap items to bill instantly and route to kitchen/bar KDS', 'Toque nos produtos para faturar na hora e enviar à cozinha/bar', 'Touchez les produits pour encaisser et envoyer en cuisine/bar'],
    ['CONTROL DE TURNO & CIERRE Z DEL DÍA', 'SHIFT CONTROL & DAILY Z-CLOSE', 'CONTROLE DE TURNO E FECHAMENTO Z DO DIA', 'CONTRÔLE DE ÉQUIPE & CLÔTURE Z'],
    ['Arqueo de Caja Ciego (Anti-Faltantes)', 'Blind Cash Count (Anti-Shortage)', 'Conferência Cega de Caixa', 'Comptage de Caisse Aveugle'],
    ['El cajero cuenta e ingresa el efectivo físico total en gaveta. El sistema calcula automáticamente la diferencia frente al saldo esperado (Fondo Inicial + Ventas Efectivo - Retiros).', 'Cashier counts and enters total physical cash in drawer. System calculates variance vs. expected balance (Opening Float + Cash Sales - Payouts).', 'O operador conta e digita o valor físico total na gaveta. O sistema calcula a diferença frente ao saldo esperado.', 'Le caissier compte et saisit les espèces réelles en caisse. Le système calcule l’écart par rapport au solde attendu.'],
    ['Ejecutar Arqueo Ciego & Emitir Cierre Z', 'Run Blind Cash Count & Issue Z-Close', 'Executar Conferência Cega e Emitir Fechamento Z', 'Exécuter Comptage & Émettre Clôture Z'],
    ['Fondo Inicial:', 'Opening Float:', 'Fundo Inicial:', 'Fond de Caisse :'],
    ['Ventas Efectivo:', 'Cash Sales:', 'Vendas em Dinheiro:', 'Ventes Espèces :'],
    ['Ventas Tarjeta POS:', 'POS Card Sales:', 'Vendas Cartão PDV:', 'Ventes Carte PDV :'],
    ['Transferencias:', 'Bank Transfers:', 'Transferências:', 'Virements :'],
    ['Retiros / Egresos:', 'Payouts / Withdrawals:', 'Sangrias / Retiradas:', 'Retraits / Dépenses :'],
    ['Efectivo Esperado:', 'Expected Cash:', 'Dinheiro Esperado:', 'Espèces Attendues :'],
    ['Cortes Z Emitidos en la Sesión:', 'Z-Reports Issued in Session:', 'Fechamentos Z Emitidos na Sessão:', 'Clôtures Z Émises dans la Session :'],

    // === KDS COCINA ===
    ['KDS • KITCHEN DISPLAY SYSTEM EN TIEMPO REAL', 'KDS • REAL-TIME KITCHEN DISPLAY SYSTEM', 'KDS • MONITOR DE COZINHA EM TEMPO REAL', 'KDS • MONITEUR CUISINE EN TEMPS RÉEL'],
    ['Monitor Táctil de Recepción y Preparación de Comandas', 'Touch Monitor for Order Reception & Preparation', 'Monitor Tátil de Recepção e Preparo de Comandas', 'Écran Tactile de Réception et Préparation des Commandes'],
    ['Alerta sonora, filtro Cocina vs. Barra, semáforo 10m/20m y aviso al mesero.', 'Sound chime, Kitchen vs. Bar filter, 10m/20m timer & waiter notification.', 'Alerta sonoro, filtro Cozinha vs. Bar, semáforo 10m/20m e aviso ao garçom.', 'Signal sonore, filtre Cuisine/Bar, minuteur 10m/20m et alerte serveur.'],
    ['Probar timbre sonoro de nueva comanda en cocina', 'Test new kitchen ticket chime', 'Testar campainha sonora da cozinha', 'Tester la sonnerie de nouvelle commande'],
    ['Cocina Caliente', 'Hot Kitchen', 'Cozinha Quente', 'Cuisine Chaude'],
    ['Barra Café & Bebidas', 'Coffee Bar & Drinks', 'Bar de Café e Bebidas', 'Bar Café & Boissons'],
    ['Barra Café / Bebidas', 'Coffee Bar / Drinks', 'Bar Café / Bebidas', 'Bar Café / Boissons'],
    ['Historial de Comandas Despachadas por Cocina & Barra', 'Completed Kitchen & Bar Orders History', 'Histórico de Comandas Despachadas pela Cozinha/Bar', 'Historique des Commandes Expédiées'],
    ['EDICIÓN PREVIA AL INICIO DE PREPARACIÓN', 'PRE-PREPARATION ORDER EDITING', 'EDIÇÃO ANTES DO INÍCIO DO PREPARO', 'ÉDITION AVANT PRÉPARATION'],
    ['Ajusta cantidades, agrega o edita notas de cocina, quita ítems en cola o añade un platillo adicional.', 'Adjust quantities, add or edit kitchen notes, remove queued items, or add another dish.', 'Ajuste quantidades, adicione ou edite notas da cozinha, remova itens na fila ou inclua novo prato.', 'Ajustez les quantités, modifiez les notes cuisine, retirez ou ajoutez un plat.'],
    ['+ Agregar Platillo Adicional a esta Comanda:', '+ Add Extra Dish to This Ticket:', '+ Adicionar Prato Extra a Esta Comanda:', '+ Ajouter un Plat Supplémentaire :'],
    ['Guardar Cambios en Comanda', 'Save Ticket Changes', 'Salvar Alterações na Comanda', 'Enregistrer les Modifications'],
    ['👨‍🍳 Iniciar Preparación', '👨‍🍳 Start Preparation', '👨‍🍳 Iniciar Preparo', '👨‍🍳 Démarrer Préparation'],
    ['Iniciar Preparación', 'Start Preparation', 'Iniciar Preparo', 'Démarrer Préparation'],
    ['✏️ Editar Orden (En Cola)', '✏️ Edit Order (Queued)', '✏️ Editar Pedido (Na Fila)', '✏️ Modifier (En Attente)'],
    ['Editar Orden', 'Edit Order', 'Editar Pedido', 'Modifier Commande'],
    ['✅ Marcar Orden Lista / Entregada', '✅ Mark Order Ready / Delivered', '✅ Marcar Pedido Pronto / Entregue', '✅ Marquer Commande Prête / Livrée'],
    ['Confirmar Retiro por Mesero / Despachada', 'Confirm Server Pickup / Delivered', 'Confirmar Retirada pelo Garçom / Entregue', 'Confirmer Retrait Serveur / Livrée'],
    ['En Cola (Editable)', 'Queued (Editable)', 'Na Fila (Editável)', 'En Attente (Modifiable)'],
    ['Ya en preparación/listo (Bloqueado)', 'Already preparing/ready (Locked)', 'Em preparo/pronto (Bloqueado)', 'En préparation/prêt (Verrouillé)'],
    ['¡Cocina y Barra al Día! Cero Comandas Pendientes', 'Kitchen & Bar Caught Up! Zero Pending Orders', 'Cozinha e Bar em Dia! Zero Comandas Pendentes', 'Cuisine & Bar à Jour ! Zéro Commande en Attente'],
    ['Tan pronto un mesero confirme una orden en mesa o un cliente ordene desde el Menú Digital QR, la comanda aparecerá aquí con alerta sonora instantánea.', 'As soon as a server confirms a table order or a guest orders from the QR Menu, the ticket will appear here with an instant chime.', 'Assim que um garçom confirmar um pedido ou um cliente pedir no Cardápio QR, a comanda aparecerá aqui.', 'Dès qu’un serveur confirme une commande ou qu’un client commande par QR, le bon apparaît ici.'],

    // === INVENTARIO, RECETAS & PROVEEDORES ===
    ['ESCANDALLO DE RECETA & DESCUENTO AUTOMÁTICO', 'RECIPE COSTING & AUTOMATIC STOCK DEDUCTION', 'FICHA TÉCNICA E BAIXA AUTOMÁTICA DE ESTOQUE', 'FICHES RECETTES & DÉDUCTION AUTOMATIQUE'],
    ['Controla insumos de cocina/café (g, ml) y bebidas embotelladas o productos listos para venta directa (und) con mínimos, máximos y datos del proveedor.', 'Manage kitchen/coffee ingredients (g, ml) and bottled drinks or retail goods (units) with min/max thresholds and supplier info.', 'Controle insumos de cozinha/café (g, ml) e bebidas engarrafadas ou venda direta (un) com mínimo, máximo e fornecedor.', 'Gérez ingrédients (g, ml) et boissons/produits finis (unités) avec seuils min/max et infos fournisseurs.'],
    ['Kardex Integral de Insumos & Productos de Venta al Público', 'Full Ingredients & Retail Goods Stock Kardex', 'Kardex Integral de Insumos e Produtos de Venda Direta', 'Kardex Complet Ingrédients & Vente Directe'],
    ['Nuevo Producto / Insumo', 'New Product / Ingredient', 'Novo Produto / Insumo', 'Nouveau Produit / Ingrédient'],
    ['Nuevo Plato', 'New Dish', 'Novo Prato', 'Nouveau Plat'],
    ['+ Editar categorías', '+ Edit Categories', '+ Editar Categorias', '+ Modifier Catégories'],
    ['Exportar Excel', 'Export Excel', 'Exportar Excel', 'Exporter Excel'],
    ['🥕 Insumo de Cocina / Receta', '🥕 Kitchen / Recipe Ingredient', '🥕 Insumo de Cozinha / Receita', '🥕 Ingrédient Cuisine / Recette'],
    ['🍾 Venta Directa al Público (Embotellado/Retail)', '🍾 Direct Retail Sale (Bottled/Packaged)', '🍾 Venda Direta ao Público (Bebida/Varejo)', '🍾 Vente Directe au Public (Bouteille/Détail)'],
    ['🔄 Mixto (Insumo y Venta)', '🔄 Hybrid (Ingredient & Retail)', '🔄 Misto (Insumo e Venda)', '🔄 Mixte (Ingrédient & Vente)'],
    ['Configuración de Escandallos (Recetas) y Rentabilidad en Vivo', 'Recipe Costing (BOM) & Live Margin Configuration', 'Configuração de Fichas Técnicas e Rentabilidade ao Vivo', 'Configuration des Recettes & Rentabilité en Direct'],
    ['Al facturar 1 unidad, el sistema descuenta automáticamente estos insumos o productos de bodega:', 'When billing 1 unit, the system automatically deducts these ingredients or items from stock:', 'Ao faturar 1 unidade, o sistema baixa automaticamente estes insumos ou produtos do estoque:', 'Lors de la facturation d’1 unité, le système déduit automatiquement ces articles du stock :'],
    ['Publicar automáticamente en Menú Digital QR & Caja POS para vender al público', 'Auto-publish on Digital QR Menu & POS Cashier for public sale', 'Publicar automaticamente no Cardápio Digital QR e Caixa PDV', 'Publier automatiquement sur le Menu QR & Caisse PDV'],
    ['Stock Actual', 'Current Stock', 'Estoque Atual', 'Stock Actuel'],
    ['Stock Mínimo', 'Minimum Stock', 'Estoque Mínimo', 'Stock Minimum'],
    ['Stock Máximo', 'Maximum Stock', 'Estoque Máximo', 'Stock Maximum'],
    ['Porciones Posibles:', 'Possible Servings:', 'Porções Possíveis:', 'Portions Possibles :'],
    ['Margen Rentabilidad:', 'Profit Margin:', 'Margem de Lucro:', 'Marge Bénéficiaire :'],
    ['Costo de Receta:', 'Recipe Cost:', 'Custo da Receita:', 'Coût Recette :'],
    ['Directorio de Proveedores, Historial de Compras & Comparativa de Costos', 'Suppliers Directory, Purchase History & Cost Comparison', 'Diretório de Fornecedores, Histórico de Compras e Custos', 'Annuaire Fournisseurs, Historique d’Achats & Coûts'],
    ['Registrar Nuevo Proveedor', 'Register New Supplier', 'Cadastrar Novo Fornecedor', 'Enregistrer Nouveau Fournisseur'],

    // === FINANZAS, USUARIOS Y BRANDING (GASTRO) ===
    ['Diario Digital del Día', 'Daily Digital Cash Ledger', 'Diário Digital do Dia', 'Journal de Caisse du Jour'],
    ['Cuentas por Cobrar (CxC)', 'Accounts Receivable (AR)', 'Contas a Receber (AR)', 'Créances Clients'],
    ['Cuentas por Pagar (CxP)', 'Accounts Payable (AP)', 'Contas a Pagar (AP)', 'Dettes Fournisseurs'],
    ['Exportar Libro Diario Excel', 'Export Cash Ledger to Excel', 'Exportar Livro Diário Excel', 'Exporter le Journal Excel'],
    ['Registrar Movimiento en Caja', 'Record Cash Movement', 'Registrar Movimento no Caixa', 'Enregistrer Mouvement Caisse'],
    ['Proveedor Asociado al Movimiento (Opcional)', 'Linked Supplier (Optional)', 'Fornecedor Associado (Opcional)', 'Fournisseur Associé (Optionnel)'],
    ['-- Movimiento Interno / Sin Proveedor --', '-- Internal Movement / No Supplier --', '-- Movimento Interno / Sem Fornecedor --', '-- Mouvement Interne / Sans Fournisseur --'],
    ['Administrar Categorías Contables de Finanzas', 'Manage Finance Accounting Categories', 'Gerenciar Categorias Contábeis', 'Gérer les Catégories Comptables'],
    ['Control Estricto de 5 Usuarios & Aislamiento de Vistas por Rol (RBAC)', 'Strict 5-User Control & Role-Based View Isolation (RBAC)', 'Controle Estrito de 5 Usuários e Isolamento por Perfil (RBAC)', 'Contrôle Strict de 5 Utilisateurs & Isolation par Rôle (RBAC)'],
    ['Cada usuario opera bajo aislamiento estricto de interfaz: los meseros solo visualizan el Portal del Menú y Mapa de Mesas; Cocina/Barra solo opera la pantalla táctil KDS; y Caja solo opera facturación, corte y CxC.', 'Each user operates under strict interface isolation: waiters only see Table Map & Menu; Kitchen/Bar only operates KDS; and Cashier only handles billing, Z-close, and AR.', 'Cada usuário opera sob isolamento rigoroso de interface: garçons veem Mesas e Cardápio; Cozinha/Bar opera o KDS; Caixa opera faturamento e fechamento.', 'Chaque utilisateur dispose d’une interface isolée selon son rôle : serveurs (Tables/Menu), cuisine (KDS), caisse (PDV/Clôture).'],
    ['PANEL WHITE-LABEL KINETIX.OPS • IDENTIDAD COMERCIAL', 'KINETIX.OPS WHITE-LABEL PANEL • BRAND IDENTITY', 'PAINEL WHITE-LABEL KINETIX.OPS • IDENTIDADE COMERCIAL', 'PANNEAU MARQUE BLANCHE KINETIX.OPS • IDENTITÉ'],
    ['Personalización del Sistema y Datos del Restaurante / Cafetería', 'System Customization & Restaurant / Cafe Profile', 'Personalização do Sistema e Dados do Restaurante / Cafeteria', 'Personnalisation du Système & Profil Restaurant / Café'],
    ['Actualiza instantáneamente encabezados, menú digital QR y tickets térmicos 58mm / 80mm.', 'Instantly updates headers, digital QR menu, and 58mm / 80mm thermal receipts.', 'Atualiza instantaneamente cabeçalhos, cardápio digital QR e cupons térmicos 58mm / 80mm.', 'Met à jour instantanément les en-têtes, le menu QR et les tickets 58mm / 80mm.'],
    ['Cargar Logo desde PC', 'Upload Logo from PC', 'Carregar Logo do PC', 'Importer Logo depuis PC'],
    ['Quitar Logo', 'Remove Logo', 'Remover Logo', 'Supprimer Logo'],
    ['Guardar Configuración', 'Save Configuration', 'Salvar Configuração', 'Enregistrer Configuration'],
    ['Columna Izquierda — Identidad Comercial y Facturación', 'Left Column — Brand Identity & Billing', 'Coluna Esquerda — Identidade Comercial e Faturamento', 'Colonne Gauche — Identité & Facturation'],
    ['Columna Derecha — Ubicación, Zona Horaria y Flujo de Cocina', 'Right Column — Location, Timezone & Kitchen Flow', 'Coluna Direita — Localização, Fuso Horário e Fluxo de Cozinha', 'Colonne Droite — Emplacement, Fuseau Horaire & Flux Cuisine'],
    ['Nombre Comercial del Restaurante / Cafetería *', 'Restaurant / Cafe Commercial Name *', 'Nome Comercial do Restaurante / Cafeteria *', 'Nom Commercial du Restaurant / Café *'],
    ['Eslogan / Lema de la Marca', 'Brand Slogan / Tagline', 'Slogan / Lema da Marca', 'Slogan de la Marque'],
    ['RUC / Identificación Fiscal', 'Tax ID / EIN / VAT', 'CNPJ / NIF / Documento Fiscal', 'SIRET / N° TVA / Fiscal'],
    ['Moneda del Sistema (Multi-Moneda)', 'System Currency (Multi-Currency)', 'Moeda do Sistema (Multi-Moeda)', 'Devise du Système (Multi-Devises)'],
    ['Símbolo Moneda', 'Currency Symbol', 'Símbolo da Moeda', 'Symbole Devise'],
    ['Porcentaje de Impuesto (IVA / ISC %)', 'Tax Percentage (VAT / Sales Tax %)', 'Porcentagem de Imposto (%)', 'Taux de Taxe / TVA (%)'],
    ['Propina Legal Sugerida (%)', 'Suggested Tip (%)', 'Gorjeta Sugerida (%)', 'Pourboire Suggéré (%)'],
    ['Mensaje al Pie del Ticket Térmico 58mm / 80mm (Clave Wi-Fi & Agradecimiento)', '58mm / 80mm Thermal Receipt Footer Message (Wi-Fi Password & Thank You)', 'Mensagem de Rodapé do Cupom Térmico (Senha Wi-Fi e Agradecimento)', 'Message Pied de Ticket Thermique (Code Wi-Fi & Remerciement)'],
    ['Dirección Física del Local', 'Business Street Address', 'Endereço Físico do Local', 'Adresse Physique de l’Établissement'],
    ['Ciudad / Departamento', 'City / State', 'Cidade / Estado', 'Ville / Département'],
    ['País', 'Country', 'País', 'Pays'],
    ['Zona Horaria del Sistema', 'System Timezone', 'Fuso Horário do Sistema', 'Fuseau Horaire du Système'],
    ['Correo Electrónico Oficial', 'Official Email', 'E-mail Oficial', 'E-mail Officiel'],
    ['WhatsApp Oficial (Pedidos & Tickets)', 'Official WhatsApp (Orders & Receipts)', 'WhatsApp Oficial (Pedidos e Cupons)', 'WhatsApp Officiel (Commandes & Tickets)'],
    ['Configuración de Flujo de Cocina (Paso Automático a Pantalla KDS):', 'Kitchen Workflow Rule (Automatic Routing to KDS Screen):', 'Regra de Fluxo da Cozinha (Envio Automático para Tela KDS):', 'Règle de Flux Cuisine (Envoi Auto vers KDS) :'],
    ['🔥 Al confirmar pedido por mesero (Restaurante con servicio en mesa)', '🔥 When server confirms order (Table-service restaurant)', '🔥 Ao confirmar pedido pelo garçom (Restaurante com mesas)', '🔥 Dès confirmation serveur (Restaurant avec service à table)'],
    ['💳 Al facturar en caja POS (Cafetería Express / Fast Casual / Food Truck)', '💳 When billed at POS cashier (Express Cafe / Fast Casual / Food Truck)', '💳 Ao faturar no caixa PDV (Cafeteria Express / Food Truck)', '💳 Dès encaissement PDV (Café Express / Food Truck)'],

    // === POS & INVENTARIOS (HTML) ===
    ['Diario & Balance del Día', 'Daily Ledger & Balance', 'Diário e Balanço do Dia', 'Journal & Bilan du Jour'],
    ['Punto de Venta (POS)', 'Point of Sale (POS)', 'Ponto de Venda (PDV)', 'Point de Vente (PDV)'],
    ['Inventario & Stock', 'Inventory & Stock', 'Estoque e Produtos', 'Inventaire & Stock'],
    ['Facturas & Corte Caja', 'Invoices & Cash Close', 'Faturas e Fechamento de Caixa', 'Factures & Clôture Caisse'],
    ['Gastos, Compras, CxC & CxP', 'Expenses, Purchases, AR & AP', 'Despesas, Compras, Contas a Receber e Pagar', 'Dépenses, Achats, Créances & Dettes'],
    ['4 Usuarios & Roles', '4 Users & Roles', '4 Usuários e Perfis', '4 Utilisateurs & Rôles'],
    ['Personalizar Marca', 'Customize Brand', 'Personalizar Marca', 'Personnaliser Marque'],
    ['4/4 Usuarios', '4/4 Users', '4/4 Usuários', '4/4 Utilisateurs'],
    ['OPERADOR ACTIVO:', 'ACTIVE OPERATOR:', 'OPERADOR ATIVO:', 'OPÉRATEUR ACTIF :'],
    ['LIBRO DIARIO DIGITAL · ARQUEO & BALANCE EN TIEMPO REAL', 'DIGITAL DAILY LEDGER · LIVE CASH BALANCE', 'LIVRO DIÁRIO DIGITAL · BALANÇO EM TEMPO REAL', 'JOURNAL QUOTIDIEN · BILAN EN TEMPS RÉEL'],
    ['Balance de Caja Diario', 'Daily Cash Register Balance', 'Balanço Diário de Caixa', 'Bilan de Caisse Quotidien'],
    ['Control de inicio de caja, ventas (efectivo y tarjeta), compras, egresos del día y utilidad neta histórica.', 'Track opening cash float, cash/card sales, purchases, daily expenses, and net historical profit.', 'Controle de abertura de caixa, vendas em dinheiro/cartão, compras, despesas e lucro líquido.', 'Suivi du fond de caisse, ventes espèces/carte, achats, dépenses du jour et bénéfice net.'],
    ['Inicio de Caja / Fondo de Apertura del Día', 'Opening Cash Float / Start-of-Day Drawer', 'Abertura de Caixa / Fundo Inicial do Dia', 'Ouverture de Caisse / Fond de Caisse'],
    ['Digita el monto en efectivo con el que abre la caja. Se guarda automáticamente en el historial de esta fecha.', 'Enter the opening cash amount in drawer. Saved automatically to today’s ledger history.', 'Digite o valor em dinheiro da abertura do caixa. Salvo automaticamente no histórico do dia.', 'Saisissez le montant initial en caisse. Enregistré automatiquement pour cette date.'],
    ['1. Fondo Inicio de Caja', '1. Opening Cash Float', '1. Fundo Inicial de Caixa', '1. Fond Initial Caisse'],
    ['2. Total Vendido del Día (+)', '2. Total Daily Sales (+)', '2. Total Vendido no Dia (+)', '2. Total Ventes du Jour (+)'],
    ['3. Compras & Egresos (-)', '3. Purchases & Expenses (-)', '3. Compras e Despesas (-)', '3. Achats & Dépenses (-)'],
    ['4. Total Caja del Día (=)', '4. Net Cash in Drawer (=)', '4. Saldo Total em Caixa (=)', '4. Total En Caisse (=)'],
    ['5. Utilidad Diaria Neta', '5. Daily Net Profit', '5. Lucro Líquido Diário', '5. Bénéfice Net Quotidien'],
    ['Histórico de Movimientos de la Fecha', 'Transactions History for Selected Date', 'Histórico de Movimentos da Data', 'Historique des Mouvements du Jour'],
    ['Historial de Movimientos de la Fecha', 'Transactions History for Selected Date', 'Histórico de Movimentos da Data', 'Historique des Mouvements du Jour'],
    ['TERMINAL DE FACTURACIÓN', 'BILLING TERMINAL (POS)', 'TERMINAL DE FATURAMENTO (PDV)', 'TERMINAL DE FACTURATION (PDV)'],
    ['Buscar por nombre, código o escanear código de barras...', 'Search by name, SKU, or scan barcode...', 'Buscar por nome, código ou código de barras...', 'Rechercher par nom, code ou code-barres...'],
    ['Comprobante / Orden Actual', 'Current Receipt / Cart', 'Cupom / Pedido Atual', 'Ticket / Commande Actuelle'],
    ['Vaciar Carrito', 'Empty Cart', 'Esvaziar Carrinho', 'Vider le Panier'],
    ['KARDEX & ALMACÉN EN TIEMPO REAL', 'LIVE KARDEX & WAREHOUSE STOCK', 'KARDEX E ESTOQUE EM TEMPO REAL', 'KARDEX & ENTREPÔT EN TEMPS RÉEL'],
    ['Control de Inventarios y Productos', 'Inventory & Products Control', 'Controle de Estoque e Produtos', 'Contrôle des Stocks et Produits'],
    ['Abastecimiento de mercancía, insumos y control de stock', 'Merchandise replenishment, supplies, and live stock tracking', 'Abastecimento de mercadorias, insumos e controle de estoque', 'Approvisionnement, fournitures et gestion des stocks'],
    ['Nuevo Producto / Servicio', 'New Product / Service', 'Novo Produto / Serviço', 'Nouveau Produit / Service'],
    ['DASHBOARD EJECUTIVO · ARQUEO, INVENTARIO & FINANZAS', 'EXECUTIVE DASHBOARD · CASH CLOSE, INVENTORY & FINANCE', 'DASHBOARD EXECUTIVO · CAIXA, ESTOQUE E FINANÇAS', 'TABLEAU DE BORD · CLÔTURE, STOCK & FINANCES'],
    ['Facturas, Corte de Caja y Reportes por Fechas', 'Invoices, Cash Close & Date Range Reports', 'Faturas, Fechamento de Caixa e Relatórios', 'Factures, Clôture de Caisse & Rapports'],
    ['MÓDULO FINANCIERO & CONTROL ADMINISTRATIVO', 'FINANCIAL MODULE & ADMINISTRATIVE CONTROL', 'MÓDULO FINANCEIRO E CONTROLE ADMINISTRATIVO', 'MODULE FINANCIER & CONTRÔLE ADMINISTRATIF'],
    ['Gastos, Compras, CxC y CxP', 'Expenses, Purchases, AR & AP', 'Despesas, Compras, Contas a Receber e Pagar', 'Dépenses, Achats, Créances & Dettes'],
    ['Deducción de caja operativa con proveedor vinculado por categoría', 'Operating cash deduction linked with category suppliers', 'Dedução de caixa operacional com fornecedor vinculado', 'Déduction de caisse liée au fournisseur par catégorie'],
    ['ABASTECIMIENTO & SOCIOS COMERCIALES', 'SUPPLY CHAIN & COMMERCIAL PARTNERS', 'ABASTECIMENTO E PARCEIROS COMERCIAIS', 'APPROVISIONNEMENT & FOURNISSEURS'],
    ['Directorio de Proveedores Comerciales', 'Commercial Suppliers Directory', 'Diretório de Fornecedores Comerciais', 'Annuaire des Fournisseurs Commerciaux'],
    ['Control centralizado de empresas proveedoras, datos de contacto WhatsApp, RUC fiscal y vinculación por categorías de productos y compras.', 'Centralized management of supplier companies, WhatsApp contacts, Tax IDs, and product/purchase categories.', 'Controle centralizado de fornecedores, WhatsApp, CNPJ e categorias de produtos.', 'Gestion centralisée des fournisseurs, contacts WhatsApp, SIRET et catégories.'],
    ['Administración de Usuarios de Licencia (Máx. 4)', 'License Users Management (Max 4)', 'Administração de Usuários da Licença (Máx. 4)', 'Gestion des Utilisateurs de Licence (Max 4)'],
    ['PERSONALIZACIÓN INTERNA WHITE-LABEL', 'INTERNAL WHITE-LABEL CUSTOMIZATION', 'PERSONALIZAÇÃO INTERNA WHITE-LABEL', 'PERSONNALISATION MARQUE BLANCHE'],
    ['Identidad de Marca, Logo y Parámetros del Negocio', 'Brand Identity, Logo & Business Settings', 'Identidade da Marca, Logo e Parâmetros do Negócio', 'Identité de Marque, Logo & Paramètres'],
    ['Personaliza el sistema con tu propio logo, nombre comercial y giro de negocio.', 'Customize the system with your own logo, business name, and store type.', 'Personalize o sistema com seu próprio logo, nome comercial e ramo de negócio.', 'Personnalisez le système avec votre logo, nom commercial et secteur.'],
    ['💾 Guardar Cambios Ahora', '💾 Save Changes Now', '💾 Salvar Alterações Agora', '💾 Enregistrer les Modifications'],

    // === CLÍNICAS & CITAS (HTML) ===
    ['Dashboard Clínico', 'Clinical Dashboard', 'Dashboard Clínico', 'Tableau de Bord Clinique'],
    ['Agenda de Citas & WhatsApp', 'Appointments & WhatsApp Reminders', 'Agenda de Consultas e WhatsApp', 'Agenda Rendez-vous & WhatsApp'],
    ['Pacientes & Expedientes', 'Patients & Medical Records', 'Pacientes e Prontuários', 'Patients & Dossiers Médicaux'],
    ['Consultas & Recetario PDF', 'Consultations & PDF Prescriptions', 'Consultas e Receituário PDF', 'Consultations & Ordonnances PDF'],
    ['Finanzas, Ingresos & Gastos', 'Finance, Income & Expenses', 'Finanças, Receitas e Despesas', 'Finances, Revenus & Dépenses'],
    ['PROFESIONAL ACTIVO:', 'ACTIVE PRACTITIONER:', 'PROFISSIONAL ATIVO:', 'PRATICIEN ACTIF :'],
    ['SISTEMA ANTI-AUSENTISMO, AGENDAMIENTO & REPORTES', 'ANTI-NO-SHOW BOOKING, REMINDERS & REPORTS', 'SISTEMA ANTI-FALTAS, AGENDAMENTO E RELATÓRIOS', 'SYSTÈME ANTI-ABSENCES, RENDEZ-VOUS & RAPPORTS'],
    ['Dashboard de Agenda, Consultas y Finanzas Clínicas', 'Appointments, Consultations & Clinic Finance Dashboard', 'Dashboard de Agenda, Consultas e Finanças da Clínica', 'Tableau de Bord Agenda, Consultations & Finances'],
    ['Agendar Nueva Cita / Reserva', 'Schedule New Appointment / Booking', 'Agendar Nova Consulta / Reserva', 'Planifier Nouveau Rendez-vous'],
    ['Centro de Recordatorios Automáticos (WhatsApp, SMS y Correo)', 'Automated Reminders Center (WhatsApp, SMS & Email)', 'Central de Lembretes Automáticos (WhatsApp, SMS e E-mail)', 'Centre de Rappels Automatiques (WhatsApp, SMS & E-mail)'],
    ['Personaliza la plantilla y dispara recordatorios automáticos con 1 clic a todos tus pacientes/clientes citados.', 'Customize the template and trigger automated 1-click reminders to all scheduled patients/clients.', 'Personalize o modelo e dispare lembretes automáticos em 1 clique para pacientes agendados.', 'Personnalisez le modèle et envoyez des rappels automatiques en 1 clic à vos patients.'],
    ['EXPEDIENTE DIGITAL INTEGRAL', 'INTEGRATED DIGITAL MEDICAL RECORD (EMR)', 'PRONTUÁRIO DIGITAL INTEGRAL', 'DOSSIER MÉDICAL NUMÉRIQUE INTÉGRAL'],
    ['Directorio de Expedientes e Historial Clínico', 'Medical Records & Clinical History Directory', 'Diretório de Prontuários e Histórico Clínico', 'Annuaire des Dossiers & Historique Clinique'],
    ['Crear Nuevo Expediente', 'Create New Patient Record', 'Criar Novo Prontuário', 'Créer Nouveau Dossier Patient'],
    ['ATENCIÓN DE CONSULTA & ÓRDENES', 'CONSULTATION CARE & ORDERS', 'ATENDIMENTO DE CONSULTA E RECEITAS', 'SOINS EN CONSULTATION & ORDONNANCES'],
    ['Registro de Consulta Multi-Especialidad y Receta', 'Multi-Specialty Consultation & Prescription Entry', 'Registro de Consulta Multiespecialidade e Receita', 'Saisie de Consultation Multispécialité & Ordonnance'],
    ['CONTROL FINANCIERO MÉDICO, CLÍNICO & DE SERVICIOS', 'CLINIC, MEDICAL & SERVICES FINANCIAL CONTROL', 'CONTROLE FINANCEIRO MÉDICO, CLÍNICO E DE SERVIÇOS', 'CONTRÔLE FINANCIER MÉDICAL & SERVICES'],
    ['Finanzas: Ingresos por Consultas, Gastos de Clínica y Cuentas', 'Finance: Consultation Revenue, Clinic Expenses & Accounts', 'Finanças: Receitas de Consultas, Despesas da Clínica e Contas', 'Finances : Recettes de Consultations, Dépenses & Comptes'],
    ['WHITE-LABEL CONFIG', 'WHITE-LABEL CONFIG', 'CONFIGURAÇÃO WHITE-LABEL', 'CONFIGURATION MARQUE BLANCHE'],
    ['Personalizar Logo, Nombre y Especialidad', 'Customize Logo, Name & Specialty', 'Personalizar Logo, Nome e Especialidade', 'Personnaliser Logo, Nom & Spécialité'],
    ['💾 Guardar Configuración', '💾 Save Configuration', '💾 Salvar Configuração', '💾 Enregistrer la Configuration'],

    // === CRM & COTIZADOR PDF (HTML) ===
    ['Embudo Kanban de Ventas', 'Kanban Sales Pipeline', 'Funil Kanban de Vendas', 'Pipeline Kanban des Ventes'],
    ['Clientes & Prospectos', 'Clients & Leads', 'Clientes e Leads', 'Clients & Prospects'],
    ['Cotizador Formal PDF', 'Formal PDF Quoter', 'Orçamentos Formais em PDF', 'Générateur de Devis PDF'],
    ['Seguimiento WhatsApp', 'WhatsApp Follow-up', 'Acompanhamento WhatsApp', 'Suivi WhatsApp'],
    ['EJECUTIVO ACTIVO:', 'ACTIVE EXECUTIVE:', 'EXECUTIVO ATIVO:', 'COMMERCIAL ACTIF :'],
    ['EMBUDO DE VENTAS, AUTOMATIZACIÓN & REPORTES COMERCIALES', 'SALES PIPELINE, AUTOMATION & COMMERCIAL REPORTS', 'FUNIL DE VENDAS, AUTOMAÇÃO E RELATÓRIOS COMERCIAIS', 'PIPELINE DE VENTES, AUTOMATISATION & RAPPORTS'],
    ['Dashboard de Pipeline, Cierres y Finanzas B2B', 'Pipeline, Closings & B2B Finance Dashboard', 'Dashboard de Funil, Fechamentos e Finanças B2B', 'Tableau de Bord Pipeline, Ventes & Finances B2B'],
    ['Captar Nuevo Lead / Prospecto', 'Capture New Lead / Prospect', 'Captar Novo Lead / Prospecto', 'Capturer Nouveau Prospect'],
    ['GENERADOR DE PROPUESTAS PDF', 'PDF PROPOSAL GENERATOR', 'GERADOR DE PROPOSTAS PDF', 'GÉNÉRATEUR DE DEVIS PDF'],
    ['Emitir Nueva Cotización Formal', 'Issue New Formal Quotation', 'Emitir Novo Orçamento Formal', 'Émettre un Nouveau Devis Formel'],
    ['Historial y Seguimiento de Cotizaciones', 'Quotations History & Follow-Up', 'Histórico e Acompanhamento de Orçamentos', 'Historique & Suivi des Devis'],
    ['DIRECTORIO & SEGUIMIENTO EN 1 CLIC', 'DIRECTORY & 1-CLICK FOLLOW-UP', 'DIRETÓRIO E ACOMPANHAMENTO EM 1 CLIQUE', 'ANNUAIRE & SUIVI EN 1 CLIC'],
    ['Base de Datos de Clientes y Plantillas de Automatización', 'Client Database & Automation Templates', 'Base de Clientes e Modelos de Automação', 'Base Clients & Modèles d’Automatisation'],
    ['CONTROL FINANCIERO B2B & AGENCIA', 'B2B & AGENCY FINANCIAL CONTROL', 'CONTROLE FINANCEIRO B2B E AGÊNCIA', 'CONTRÔLE FINANCIER B2B & AGENCE'],
    ['Ingresos por Cierres, Gastos Comerciales, CxC y CxP', 'Revenue from Deals, Commercial Expenses, AR & AP', 'Receitas de Fechamentos, Despesas Comerciais, AR e AP', 'Revenus des Ventes, Dépenses, Créances & Dettes'],
    ['WHITE-LABEL BRANDING', 'WHITE-LABEL BRANDING', 'IDENTIDADE WHITE-LABEL', 'MARQUE BLANCHE'],
    ['Personalizar Logo, Empresa y Datos de Cotización', 'Customize Logo, Company & Quotation Details', 'Personalizar Logo, Empresa e Dados de Orçamento', 'Personnaliser Logo, Entreprise & Détails des Devis'],

    // === SUBTÍTULOS / ETIQUETAS COMPARTIDAS & TABLAS ===
    ['Menú Digital QR', 'Digital QR Menu', 'Cardápio Digital QR', 'Menu Numérique QR'],
    ['Mapa de Mesas', 'Table Map', 'Mapa de Mesas', 'Plan de Tables'],
    ['Facturación POS & Recetas', 'POS Billing & Recipes', 'Faturamento PDV e Receitas', 'Facturation PDV & Recettes'],
    ['Monitor de Cocina (KDS)', 'Kitchen Display Monitor (KDS)', 'Monitor de Cozinha (KDS)', 'Moniteur Cuisine (KDS)'],
    ['Acciones', 'Actions', 'Ações', 'Actions'],
    ['Concepto', 'Concept / Description', 'Conceito', 'Libellé'],
    ['Categoría', 'Category', 'Categoria', 'Catégorie'],
    ['Proveedor', 'Supplier', 'Fornecedor', 'Fournisseur'],
    ['Cliente', 'Client', 'Cliente', 'Client'],
    ['Fecha y Hora', 'Date & Time', 'Data e Hora', 'Date & Heure'],
    ['Fecha', 'Date', 'Data', 'Date'],
    ['Monto Total', 'Total Amount', 'Valor Total', 'Montant Total'],
    ['Saldo Pendiente', 'Pending Balance', 'Saldo Pendente', 'Solde Dû'],
    ['Estado', 'Status', 'Status', 'Statut'],
    ['Cancelar', 'Cancel', 'Cancelar', 'Annuler'],
    ['Cerrar', 'Close', 'Fechar', 'Fermer'],
    ['Editar', 'Edit', 'Editar', 'Modifier'],
    ['Anular', 'Void', 'Cancelar', 'Annuler'],
    ['Hoy', 'Today', 'Hoje', 'Aujourd’hui'],
    ['Este Mes', 'This Month', 'Este Mês', 'Ce Mois'],
    ['Todo', 'All', 'Tudo', 'Tout'],
    ['Desde:', 'From:', 'De:', 'Du :'],
    ['Hasta:', 'To:', 'Até:', 'Au :'],
    ['Total', 'Total', 'Total', 'Total'],
    ['Subir Logo de tu Clínica / Negocio', 'Upload Clinic / Business Logo', 'Enviar Logo da Clínica / Negócio', 'Importer Logo Clinique / Entreprise'],
    ['Logo de tu Negocio', 'Your Business Logo', 'Logo do Seu Negócio', 'Logo de Votre Entreprise'],
    ['Logo de tu Empresa', 'Your Company Logo', 'Logo da Sua Empresa', 'Logo de Votre Entreprise'],
    ['Nombre Comercial de la Empresa', 'Business Commercial Name', 'Nome Comercial da Empresa', 'Nom Commercial de l’Entreprise'],
    ['Nombre de la Clínica / Salón / Taller', 'Clinic / Salon / Workshop Name', 'Nome da Clínica / Salão / Oficina', 'Nom de la Clinique / Salon / Atelier'],
    ['Nombre de tu Empresa / Agencia', 'Your Company / Agency Name', 'Nome da Sua Empresa / Agência', 'Nom de Votre Entreprise / Agence'],
    ['Especialidad o Giro Principal', 'Specialty or Main Industry', 'Especialidade ou Ramo Principal', 'Spécialité ou Secteur Principal'],
    ['Giro del Comercio (Plantilla Rápida)', 'Store Industry (Quick Template)', 'Ramo do Comércio (Modelo Rápido)', 'Secteur d’Activité (Modèle Rapide)'],
    ['Símbolo de Moneda', 'Currency Symbol', 'Símbolo da Moeda', 'Symbole Devise'],

    // === GESTIÓN DE TRANSPORTE, LOGÍSTICA & CASILLEROS (LOGISTICS ERP + TMS + WMS) ===
    ['Punto de Venta (POS) & Recepción / Guías', 'POS Billing, Receiving & Airway Bills', 'PDV, Recepção e Guias de Envio', 'PDV, Réception & Bordereaux'],
    ['Inventario Bodega, Casilleros & Stock (WMS)', 'Warehouse, Lockers & Stock (WMS)', 'Estoque Galpão, Lockers e Insumos (WMS)', 'Entrepôt, Casiers & Stock (WMS)'],
    ['Rastreo End-to-End & Última Milla (TMS)', 'End-to-End Tracking & Last Mile (TMS)', 'Rastreamento Ponta a Ponta e Última Milha (TMS)', 'Suivi Bout-en-Bout & Dernier Kilomètre (TMS)'],
    ['Facturas & Corte de Caja', 'Invoices & Cash Close', 'Faturas e Fechamento de Caixa', 'Factures & Clôture de Caisse'],
    ['Proveedores & Agentes de Carga', 'Carriers, Freight Forwarders & Agents', 'Fornecedores e Agentes de Carga', 'Fournisseurs & Transitaires'],
    ['4 Usuarios, Roles & 3 Sucursales', '4 Users, Roles & 3 Branches', '4 Usuários, Perfis e 3 Filiais', '4 Utilisateurs, Rôles & 3 Agences'],
    ['Personalizar Marca & Seguridad', 'Customize Brand & Security', 'Personalizar Marca e Segurança', 'Personnaliser Marque & Sécurité'],
    ['Manual del Sistema & Procesos (HD)', 'System & Operations Manual (HD)', 'Manual do Sistema e Processos (HD)', 'Manuel du Système & Processus (HD)'],
    ['Portal Público de Rastreo Rápido (Sin Login)', 'Public Fast Package Tracking Portal (No Login)', 'Portal Público de Rastreamento (Sem Login)', 'Portail Public de Suivi Colis (Sans Connexion)'],
    ['Rastreo Público', 'Public Tracking', 'Rastreio Público', 'Suivi Public'],
    ['ERP + TMS + WMS • Casillero Internacional & Última Milla', 'ERP + TMS + WMS • International Courier & Last Mile', 'ERP + TMS + WMS • Courier Internacional e Última Milha', 'ERP + TMS + WMS • Fret International & Dernier Kilomètre'],
    ['Powered by Kinetix.ops — Intelligent Logistics ERP Pro', 'Powered by Kinetix.ops — Intelligent Logistics ERP Pro', 'Powered by Kinetix.ops — Intelligent Logistics ERP Pro', 'Powered by Kinetix.ops — Intelligent Logistics ERP Pro'],
    ['Consolidado Global (3 Sedes)', 'Global Consolidated (3 Branches)', 'Consolidado Global (3 Filiais)', 'Consolidé Global (3 Agences)'],
    ['Acceso Rápido a los 4 Usuarios Licenciados (RBAC):', 'Quick Access to the 4 Licensed Users (RBAC):', 'Acesso Rápido aos 4 Usuários Licenciados (RBAC):', 'Accès Rapide aux 4 Utilisateurs Licenciés (RBAC) :'],
    ['Personalización del Sistema y Datos de la Empresa', 'System Customization & Logistics Company Profile', 'Personalização do Sistema e Dados da Transportadora', 'Personnalisation du Système & Profil Entreprise'],
    ['Actualiza instantáneamente encabezados, tickets térmicos 58mm/80mm, etiquetas QR y portal público.', 'Instantly updates headers, 58mm/80mm thermal receipts, QR labels, and public tracking portal.', 'Atualiza instantaneamente cabeçalhos, cupons 58mm/80mm, etiquetas QR e portal público.', 'Met à jour en-têtes, tickets 58mm/80mm, étiquettes QR et portail public en direct.'],
    ['Nombre Comercial de la Agencia de Envíos / Empresa *', 'Courier / Logistics Agency Commercial Name *', 'Nome Comercial da Transportadora / Agência *', 'Nom Commercial de l’Agence de Transport *'],
    ['Identidad Comercial y Facturación', 'Brand Identity & Billing Rates', 'Identidade Comercial e Tarifas', 'Identité Commerciale & Tarification'],
    ['Configuración White-Label & Identidad Corporativa', 'White-Label Config & Corporate Identity', 'Configuração White-Label e Identidade Corporativa', 'Configuration Marque Blanche & Identité'],
    ['Confirmación de Seguridad — Cerrar Sesión', 'Security Confirmation — Log Out', 'Confirmação de Segurança — Sair', 'Confirmation de Sécurité — Déconnexion'],
    ['Confirmar y Salir', 'Confirm & Log Out', 'Confirmar e Sair', 'Confirmer & Quitter']
  ];

  // Ordenar por longitud descendente para que frases largas se reemplacen antes que subfrases
  UI_PHRASE_TABLE.sort((a, b) => b[0].length - a[0].length);

  const EXACT_TRANSLATION_MAP = { en: new Map(), pt: new Map(), fr: new Map() };
  UI_PHRASE_TABLE.forEach(row => {
    const [esText, enText, ptText, frText] = row;
    EXACT_TRANSLATION_MAP.en.set(esText, enText);
    EXACT_TRANSLATION_MAP.pt.set(esText, ptText);
    EXACT_TRANSLATION_MAP.fr.set(esText, frText);
  });

  // Reglas dinámicas para textos con números/variables incrustadas (ej. "Mesa 02", "6 Abiertas", "Usuario #1/5", "4 Activas")
  function applyDynamicPatterns(text, targetLang) {
    if (targetLang === 'es' || !text) return text;
    let out = text;

    if (targetLang === 'en') {
      out = out
        .replace(/\bMesa\s+(\d+|VIP|QR)/g, 'Table $1')
        .replace(/\bMesas\b/g, 'Tables')
        .replace(/\bUsuario #(\d+\/\d+)/g, 'User #$1')
        .replace(/\bUsuario (\d+) —/g, 'User $1 —')
        .replace(/(\d+)\s+Abiertas\b/g, '$1 Open')
        .replace(/(\d+)\s+Activas\b/g, '$1 Active')
        .replace(/(\d+)\s+¡Listas!/g, '$1 Ready!')
        .replace(/Detalle de Consumo en /g, 'Order Details for ')
        .replace(/\bSaldo Mesa:/g, 'Table Balance:')
        .replace(/\bPersonaliza también el Mensaje al Pie/g, 'Also customize the Footer Message');
    } else if (targetLang === 'pt') {
      out = out
        .replace(/\bUsuario #(\d+\/\d+)/g, 'Usuário #$1')
        .replace(/\bUsuario (\d+) —/g, 'Usuário $1 —')
        .replace(/(\d+)\s+Abiertas\b/g, '$1 Abertas')
        .replace(/(\d+)\s+Activas\b/g, '$1 Ativas')
        .replace(/(\d+)\s+¡Listas!/g, '$1 Prontas!')
        .replace(/Detalle de Consumo en /g, 'Detalhes do Consumo na ');
    } else if (targetLang === 'fr') {
      out = out
        .replace(/\bMesa\s+(\d+|VIP|QR)/g, 'Table $1')
        .replace(/\bMesas\b/g, 'Tables')
        .replace(/\bUsuario #(\d+\/\d+)/g, 'Utilisateur #$1')
        .replace(/\bUsuario (\d+) —/g, 'Utilisateur $1 —')
        .replace(/(\d+)\s+Abiertas\b/g, '$1 Ouvertes')
        .replace(/(\d+)\s+Activas\b/g, '$1 Actives')
        .replace(/(\d+)\s+¡Listas!/g, '$1 Prêtes !')
        .replace(/Detalle de Consumo en /g, 'Détails de Commande ')
        .replace(/\bSaldo Mesa:/g, 'Solde Table :');
    }
    return out;
  }

  function translateTextString(origEsText, targetLang) {
    if (!origEsText || targetLang === 'es') return origEsText;
    const trimmed = origEsText.trim();
    if (!trimmed) return origEsText;

    const map = EXACT_TRANSLATION_MAP[targetLang];
    if (!map) return origEsText;

    if (map.has(trimmed)) {
      return origEsText.replace(trimmed, map.get(trimmed));
    }

    // Reemplazo por coincidencia de subcadenas (ordenadas de mayor a menor longitud)
    let out = origEsText;
    const idx = targetLang === 'en' ? 1 : targetLang === 'pt' ? 2 : 3;
    for (let i = 0; i < UI_PHRASE_TABLE.length; i++) {
      const esPhrase = UI_PHRASE_TABLE[i][0];
      if (esPhrase.length >= 4 && out.includes(esPhrase)) {
        out = out.split(esPhrase).join(UI_PHRASE_TABLE[i][idx]);
      }
    }

    return applyDynamicPatterns(out, targetLang);
  }

  function translateAttribute(el, attrName) {
    if (!el || !el.hasAttribute(attrName)) return;
    const storeKey = '__kinetixOrigAttr_' + attrName;
    const lastKey = '__kinetixLastAttr_' + attrName;
    const cur = el.getAttribute(attrName) || '';

    if (typeof el[storeKey] === 'undefined' || cur !== el[lastKey]) {
      el[storeKey] = cur;
    }

    const baseEs = el[storeKey];
    const nextVal = currentLang === 'es' ? baseEs : translateTextString(baseEs, currentLang);
    el[lastKey] = nextVal;
    if (cur !== nextVal) {
      el.setAttribute(attrName, nextVal);
    }
  }

  function translateDOMTree(root) {
    if (!root) return;

    // 1. Nodos de texto (respetando actualizaciones dinámicas de React)
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent) continue;
      if (parent.closest && (parent.closest('#kinetix-cloud-guard-bar') || parent.closest('#kinetix-settings-i18n-card') || parent.closest('#kinetix-cloud-device-modal') || parent.closest('#kinetix-demo-limit-modal') || parent.closest('#kinetix-security-lockout-modal'))) {
        continue;
      }
      const tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'TEXTAREA') continue;

      const curVal = node.nodeValue || '';
      if (!curVal.trim()) continue;

      // Si React modificó el texto desde nuestra última escritura, actualizar la base original
      if (typeof node.__kinetixOrigEs === 'undefined' || curVal !== node.__kinetixLastOut) {
        node.__kinetixOrigEs = curVal;
      }

      const nextVal = currentLang === 'es'
        ? node.__kinetixOrigEs
        : translateTextString(node.__kinetixOrigEs, currentLang);

      node.__kinetixLastOut = nextVal;
      if (curVal !== nextVal) {
        node.nodeValue = nextVal;
      }
    }

    // 2. Placeholders, tooltips (title) y aria-label
    root.querySelectorAll('input[placeholder], textarea[placeholder], [title], [aria-label]').forEach(el => {
      if (el.hasAttribute('placeholder')) translateAttribute(el, 'placeholder');
      if (el.hasAttribute('title')) translateAttribute(el, 'title');
      if (el.hasAttribute('aria-label')) translateAttribute(el, 'aria-label');
    });

    // 3. Sincronizar todos los selectores de idioma
    document.querySelectorAll('[data-kinetix-lang-select]').forEach(sel => {
      if (sel.value !== currentLang) {
        sel.value = currentLang;
      }
    });
  }

  function setGlobalLanguage(newLang) {
    const clean = String(newLang || '').toLowerCase().slice(0, 2);
    if (!SUPPORTED_LANGS.includes(clean)) return;
    currentLang = clean;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, clean);
      document.documentElement.lang = clean;
    } catch (e) {}

    translateDOMTree(document.body);
    updateBadgeUI();
    if (isDemo) {
      updateDemoFloatingBadge(getDemoActionCount());
    }
    injectSettingsLanguageSelector();

    // Sincronizar con la ventana padre del portal si está dentro de un iframe
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'KINETIX_LANG_SYNC', lang: clean }, '*');
      }
    } catch (e) {}

    try {
      window.dispatchEvent(new CustomEvent('kinetix:langchange', { detail: { lang: clean } }));
    } catch (e) {}
  }

  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'KINETIX_SET_LANG' && e.data.lang) {
      setGlobalLanguage(e.data.lang);
    }
  });

  function injectSettingsLanguageSelector() {
    const settingsTab = document.getElementById('tab-settings');
    if (!settingsTab) return;
    const t = GUARD_UI_TEXTS[currentLang] || GUARD_UI_TEXTS.es;

    let existingCard = document.getElementById('kinetix-settings-i18n-card');
    if (existingCard) {
      const titleEl = existingCard.querySelector('[data-i18n-card-title]');
      const descEl = existingCard.querySelector('[data-i18n-card-desc]');
      const selEl = existingCard.querySelector('select');
      if (titleEl) titleEl.textContent = t.settingsLangCardTitle;
      if (descEl) descEl.textContent = t.settingsLangCardDesc;
      if (selEl && selEl.value !== currentLang) selEl.value = currentLang;
      return;
    }

    const container = settingsTab.querySelector('.glass') || settingsTab;
    const card = document.createElement('div');
    card.id = 'kinetix-settings-i18n-card';
    card.className = 'p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4';
    card.innerHTML = `
      <div class="space-y-1">
        <span data-i18n-card-title class="text-xs sm:text-sm font-extrabold text-emerald-400 block">${t.settingsLangCardTitle}</span>
        <p data-i18n-card-desc class="text-[11px] text-slate-300">${t.settingsLangCardDesc}</p>
      </div>
      <div class="shrink-0">
        <select data-kinetix-lang-select class="bg-slate-950 border border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-white cursor-pointer focus:outline-none">
          <option value="es">🇪🇸 Español (Latinoamérica & España)</option>
          <option value="en">🇺🇸 English (USA, UK, Canada & Global)</option>
          <option value="pt">🇧🇷 Português (Brasil & Portugal)</option>
          <option value="fr">🇫🇷 Français (France, Canada & Europe)</option>
        </select>
      </div>
    `;
    const sel = card.querySelector('select');
    sel.value = currentLang;
    sel.addEventListener('change', function () {
      setGlobalLanguage(this.value);
    });

    const headerDiv = container.firstElementChild;
    if (headerDiv && headerDiv.nextSibling) {
      container.insertBefore(card, headerDiv.nextSibling);
    } else {
      container.appendChild(card);
    }
  }

  window.KinetixI18n = {
    getLang: function () { return currentLang; },
    setLang: setGlobalLanguage,
    detectLang: detectVisitorLanguage,
    translateDOM: function () { translateDOMTree(document.body); }
  };

  // ============================================================================
  // 2. IDENTIFICACIÓN DEL SISTEMA Y LÍMITE DE DISPOSITIVOS ACORDE A USUARIOS
  // ============================================================================
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
  } else if (pathName.includes('logistics') || pathName.includes('transporte') || pathName.includes('courier')) {
    appKey = 'logistics';
    appTitle = 'Kinetix Logistics ERP + TMS + WMS Pro Cloud';
  }

  const MAX_DEVICES_BY_APP = {
    gastro: 5,
    pos: 4,
    logistics: 4,
    gym: 4,
    med: 4,
    crm: 4
  };
  const MAX_AUTHORIZED_DEVICES = MAX_DEVICES_BY_APP[appKey] || 4;

  const OFFICIAL_CHECKOUT_URLS = {
    gastro: 'https://www.paypal.com/ncp/payment/U6STW4GVVER82',
    pos: 'https://www.paypal.com/ncp/payment/6N33BA6V5CXM4',
    logistics: 'https://kinetix-systems.github.io/kinetix-systems/?comprar=logistics',
    gym: 'https://www.paypal.com/ncp/payment/F9BEG5X5AJWR8',
    med: 'https://www.paypal.com/ncp/payment/D7L3CB8AWY75Y',
    crm: 'https://www.paypal.com/ncp/payment/5LX3ZS2TR4A22'
  };

  const MAIN_STORAGE_KEYS = {
    gastro: 'kinetix_gastro_erp_pro_v5_state',
    pos: 'KINETIX_POS_SUITE_V3',
    logistics: 'kinetix_ops_erp_pro_v4_state',
    gym: 'kinetix_gym_erp_pro_v1',
    med: 'KINETIX_MED_SUITE_V3',
    crm: 'KINETIX_CRM_SUITE_V3'
  };

  const STORAGE_SESSIONS_KEY = 'KINETIX_CLOUD_SESSIONS_' + appKey.toUpperCase();
  const STORAGE_LICENSE_KEY = 'KINETIX_CLOUD_LICENSE_' + appKey.toUpperCase();
  const STORAGE_DEVICE_ID_KEY = 'KINETIX_DEVICE_FINGERPRINT_ID';

  function detectDeviceInfo() {
    const ua = navigator.userAgent || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    let os = 'Windows PC';
    if (/iPhone|iPad|iPod/i.test(ua)) os = 'iPhone / iOS';
    else if (/Android/i.test(ua)) os = 'Android Mobile';
    else if (/Mac/i.test(ua)) os = 'MacOS';
    else if (/Linux/i.test(ua)) os = 'Linux PC';

    let browser = 'Chrome';
    if (/Edg/i.test(ua)) browser = 'Edge';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';

    return {
      type: isMobile ? 'Mobile / Tablet' : 'Desktop PC',
      icon: isMobile ? '📱' : '💻',
      label: `${os} (${browser})`,
      isMobile: isMobile
    };
  }

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

  function getOrCreateInstanceToken() {
    let token = sessionStorage.getItem('KINETIX_INSTANCE_SESSION_TOKEN');
    if (!token) {
      token = 'SES-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now();
      sessionStorage.setItem('KINETIX_INSTANCE_SESSION_TOKEN', token);
    }
    return token;
  }

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

  function registerDeviceSessionOnLogin() {
    let sessions = getActiveSessions();
    const now = Date.now();
    sessions = sessions.filter(s => (now - (s.lastSeen || 0)) < 24 * 60 * 60 * 1000);

    const existingIdx = sessions.findIndex(s => s.instanceToken === currentInstanceToken);
    if (existingIdx !== -1) {
      sessions[existingIdx].lastSeen = now;
      saveActiveSessions(sessions);
      updateBadgeUI();
      return;
    }

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
      const t = GUARD_UI_TEXTS[currentLang] || GUARD_UI_TEXTS.es;
      const payload = {
        type: 'SESSION_REVOKED',
        revokedTokens: revokedTokens,
        newDevice: newSession,
        reason: t.securityAlert,
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

  function enforceAutomaticSessionLogout(newDeviceData) {
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

  function showSecurityLockoutModal(newDeviceData) {
    let existing = document.getElementById('kinetix-security-lockout-modal');
    if (existing) existing.remove();

    const t = GUARD_UI_TEXTS[currentLang] || GUARD_UI_TEXTS.es;
    const devInfoText = newDeviceData && newDeviceData.deviceLabel
      ? `${newDeviceData.deviceIcon || '💻'} ${newDeviceData.deviceType || 'Device'} — ${newDeviceData.deviceLabel}`
      : `#${MAX_AUTHORIZED_DEVICES + 1}`;

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
            ${t.lockoutBadge(MAX_AUTHORIZED_DEVICES)}
          </span>
          <h3 class="text-xl font-black text-white leading-snug pt-1">
            ${t.securityAlert}
          </h3>
        </div>

        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2">
          <div class="flex items-center justify-between text-slate-400">
            <span>${t.licenseAssigned}</span>
            <strong class="font-mono text-emerald-400">${currentLicense}</strong>
          </div>
          <div class="flex items-center justify-between text-slate-400">
            <span>Max:</span>
            <strong class="text-white">${t.lockoutLimitVal(MAX_AUTHORIZED_DEVICES)}</strong>
          </div>
          <div class="pt-1.5 border-t border-slate-800 text-[11px] text-amber-300">
            <strong>${t.lockoutTakenBy}</strong> ${devInfoText}
          </div>
        </div>

        <p class="text-xs text-slate-400 leading-relaxed">
          ${t.lockoutFooter(MAX_AUTHORIZED_DEVICES)}
        </p>

        <button id="kinetix-lockout-ack-btn" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 hover:opacity-95 text-slate-950 font-black text-sm transition cursor-pointer shadow-lg">
          ${t.lockoutAckBtn}
        </button>
      </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('kinetix-lockout-ack-btn').onclick = function () {
      modal.remove();
    };
  }

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

  window.simulateThirdDeviceIntrusion = function () {
    const closePanel = document.getElementById('kinetix-cloud-device-modal');
    if (closePanel) closePanel.remove();
    enforceAutomaticSessionLogout({
      deviceIcon: '📱',
      deviceType: `Device #${MAX_AUTHORIZED_DEVICES + 1}`,
      deviceLabel: `(${MAX_AUTHORIZED_DEVICES + 1}/${MAX_AUTHORIZED_DEVICES})`
    });
  };

  window.openKinetixDeviceGuardModal = function () {
    let existing = document.getElementById('kinetix-cloud-device-modal');
    if (existing) {
      existing.remove();
      return;
    }

    const t = GUARD_UI_TEXTS[currentLang] || GUARD_UI_TEXTS.es;
    let sessions = getActiveSessions();
    if (sessions.length === 0) {
      sessions = [{
        instanceToken: currentInstanceToken,
        deviceId: currentDeviceId,
        deviceType: currentDeviceInfo.type,
        deviceIcon: currentDeviceInfo.icon,
        deviceLabel: currentDeviceInfo.label,
        loginTime: 'Active'
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
                <p class="text-xs font-bold text-white">${s.deviceType} · ${t.deviceWord} #${i + 1} <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono ml-1">${t.activeTag}</span></p>
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
                <p class="text-xs font-bold text-slate-300">${t.deviceWord} #${i + 1}</p>
                <p class="text-[11px] text-slate-400">${t.availSlotDesc}</p>
              </div>
            </div>
            <span class="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 font-bold">${t.availableTag}</span>
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
            <span class="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">${t.deviceModalSub}</span>
            <h3 class="text-lg font-black text-white">${appTitle}</h3>
          </div>
        </div>

        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">${t.licenseAssigned}</span>
            <span class="font-mono font-bold text-emerald-400">${currentLicense}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">${t.architectureLbl}</span>
            <span class="text-white font-semibold">${t.architectureVal}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">${t.updatesLbl}</span>
            <span class="text-cyan-400 font-semibold">${t.updatesVal}</span>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-slate-800">
            <span class="text-slate-400">${t.langLbl}</span>
            <select id="kinetix-guard-modal-lang" class="bg-slate-950 border border-emerald-500/40 rounded-lg px-2.5 py-1 text-xs font-bold text-emerald-300 cursor-pointer">
              <option value="es" ${currentLang === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
              <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇺🇸 English</option>
              <option value="pt" ${currentLang === 'pt' ? 'selected' : ''}>🇧🇷 Português</option>
              <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-white uppercase tracking-wider">${t.authDevicesTitle(sessions.length, MAX_AUTHORIZED_DEVICES)}</span>
            <span class="text-[11px] text-emerald-400 font-semibold">${t.onePerUser(MAX_AUTHORIZED_DEVICES)}</span>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
            ${slotsHtml}
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
          🔒 <strong>${t.antiPiracyTitle}</strong> ${t.antiPiracyDesc(MAX_AUTHORIZED_DEVICES)}<br>
          <em class="text-white font-semibold">"${t.securityAlert}"</em>
        </div>

        <div class="grid grid-cols-1 gap-2.5 pt-1">
          <button onclick="simulateThirdDeviceIntrusion()" class="py-3 px-4 rounded-xl bg-slate-900 hover:bg-red-950/60 text-amber-300 hover:text-red-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5">
            <span>${t.testAlertBtn(MAX_AUTHORIZED_DEVICES)}</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const langSelect = document.getElementById('kinetix-guard-modal-lang');
    if (langSelect) {
      langSelect.addEventListener('change', function () {
        setGlobalLanguage(this.value);
        modal.remove();
        window.openKinetixDeviceGuardModal();
      });
    }
  };

  function updateBadgeUI() {
    const badgeText = document.getElementById('kinetix-cloud-guard-badge-text');
    const pill = document.getElementById('kinetix-cloud-guard-pill');
    const langSelect = document.getElementById('kinetix-cloud-guard-lang-pill');
    const t = GUARD_UI_TEXTS[currentLang] || GUARD_UI_TEXTS.es;
    const count = Math.min(Math.max(getActiveSessions().length, 1), MAX_AUTHORIZED_DEVICES);
    if (badgeText) {
      badgeText.textContent = t.cloudPill(count, MAX_AUTHORIZED_DEVICES);
    }
    if (pill) {
      pill.title = t.cloudPillTitle(MAX_AUTHORIZED_DEVICES);
    }
    if (langSelect && langSelect.value !== currentLang) {
      langSelect.value = currentLang;
    }
  }

  function injectCloudSecurityBadge() {
    if (document.getElementById('kinetix-cloud-guard-bar')) return;

    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '../manifest.json';
      document.head.appendChild(link);
    }

    const t = GUARD_UI_TEXTS[currentLang] || GUARD_UI_TEXTS.es;
    const bar = document.createElement('div');
    bar.id = 'kinetix-cloud-guard-bar';
    bar.className = 'fixed bottom-3 left-3 z-40 flex items-center gap-1.5';

    const pill = document.createElement('button');
    pill.id = 'kinetix-cloud-guard-pill';
    pill.type = 'button';
    pill.onclick = window.openKinetixDeviceGuardModal;
    pill.title = t.cloudPillTitle(MAX_AUTHORIZED_DEVICES);
    pill.className = 'px-3 py-1.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-emerald-500/40 text-[11px] font-semibold text-slate-200 flex items-center gap-2 shadow-lg backdrop-blur-md transition cursor-pointer';
    pill.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
      <span id="kinetix-cloud-guard-badge-text">${t.cloudPill(1, MAX_AUTHORIZED_DEVICES)}</span>
    `;

    const langSel = document.createElement('select');
    langSel.id = 'kinetix-cloud-guard-lang-pill';
    langSel.setAttribute('data-kinetix-lang-select', '1');
    langSel.title = 'Language / Idioma / Langue';
    langSel.className = 'px-2.5 py-1.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-emerald-500/40 text-[11px] font-extrabold text-emerald-300 shadow-lg backdrop-blur-md transition cursor-pointer focus:outline-none';
    langSel.innerHTML = `
      <option value="es">🇪🇸 ES</option>
      <option value="en">🇺🇸 EN</option>
      <option value="pt">🇧🇷 PT</option>
      <option value="fr">🇫🇷 FR</option>
    `;
    langSel.value = currentLang;
    langSel.addEventListener('change', function () {
      setGlobalLanguage(this.value);
    });

    bar.appendChild(pill);
    bar.appendChild(langSel);
    document.body.appendChild(bar);
    updateBadgeUI();
  }

  // ========================================================
  // 3. KINETIX DEMO SECURITY & EPHEMERAL GUARD v5.5
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
    if (!isDemo) return true;
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

  function showDemoLockoutModal() {
    let existing = document.getElementById('kinetix-demo-limit-modal');
    if (existing) existing.remove();

    const t = GUARD_UI_TEXTS[currentLang] || GUARD_UI_TEXTS.es;
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
          ${t.demoLimitBadge}
        </div>
        <h3 style="font-size:20px;font-weight:800;color:#ffffff;margin:0 0 8px;line-height:1.25;">
          ${t.demoLimitTitle}
        </h3>
        <p style="font-size:12.5px;color:#cbd5e1;line-height:1.5;margin:0 0 16px;">
          ${t.demoLimitDesc}
        </p>

        <div style="background:rgba(15,23,42,0.8);border:1px solid #334155;border-radius:12px;padding:12px 14px;margin-bottom:18px;text-align:left;font-size:12px;">
          <div style="color:#34d399;font-weight:600;margin-bottom:6px;">${t.demoBullet1}</div>
          <div style="color:#34d399;font-weight:600;margin-bottom:6px;">${t.demoBullet2}</div>
          <div style="color:#34d399;font-weight:600;">${t.demoBullet3(MAX_AUTHORIZED_DEVICES)}</div>
        </div>

        <a href="${checkoutUrl}" onclick="return window.triggerKinetixDemoBuy(event)" target="_blank" style="display:block;width:100%;padding:14px;background:linear-gradient(135deg,#10b981,#14b8a6);color:#022c22;font-size:14px;font-weight:800;border-radius:14px;text-decoration:none;box-shadow:0 10px 15px -3px rgba(16,185,129,0.3);box-sizing:border-box;">
          ${t.demoBuyCta}
        </a>

        <button id="kinetix-demo-close-lockout" style="margin-top:14px;background:transparent;border:none;color:#94a3b8;font-size:12px;cursor:pointer;text-decoration:underline;">
          ${t.demoCloseReadonly}
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
    const t = GUARD_UI_TEXTS[currentLang] || GUARD_UI_TEXTS.es;
    const isFull = count >= DEMO_MAX_ACTIONS;
    const checkoutUrl = OFFICIAL_CHECKOUT_URLS[appKey] || OFFICIAL_CHECKOUT_URLS.pos;
    badge.innerHTML = `
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${isFull ? '#ef4444' : '#10b981'};"></span>
      <span style="color:#ffffff;font-weight:700;">${t.demoWord}</span>
      <span style="color:${isFull ? '#f87171' : '#34d399'};font-weight:800;">${count}/${DEMO_MAX_ACTIONS} ${t.actionsWord}</span>
      <a href="${checkoutUrl}" onclick="return window.triggerKinetixDemoBuy(event)" target="_blank" style="margin-left:4px;padding:3px 10px;background:#10b981;color:#022c22;font-size:10.5px;font-weight:800;border-radius:999px;text-decoration:none;">
        ${t.buyBtnShort}
      </a>
    `;
  }

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

  let domTranslationScheduled = false;
  function scheduleDOMTranslation() {
    if (domTranslationScheduled) return;
    domTranslationScheduled = true;
    requestAnimationFrame(function () {
      domTranslationScheduled = false;
      translateDOMTree(document.body);
      injectSettingsLanguageSelector();
    });
  }

  function initGuard() {
    hookAuthFunctions();
    injectCloudSecurityBadge();
    injectSettingsLanguageSelector();
    translateDOMTree(document.body);

    try {
      const observer = new MutationObserver(function () {
        if (currentLang !== 'es') {
          scheduleDOMTranslation();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    } catch (e) {}

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
