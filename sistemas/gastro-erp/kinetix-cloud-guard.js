/**
 * KINETIX CLOUD PWA, MULTI-DEVICE SECURITY GUARD & GLOBAL I18N ENGINE v5.0
 * Modelo Web / PWA en la Nube - Alojado en Servidores de Kinetix Systems
 * - Multi-Idioma Global Nativo (Español ES, English EN, Português PT, Français FR)
 * - Detección automática por región/zona horaria (USA -> EN, Brasil/Portugal -> PT, Francia -> FR, LATAM/España -> ES)
 * - Límite inteligente de dispositivos acorde a la cantidad de usuarios del sistema:
 *   · Gastro ERP + POS + KDS: 5 Usuarios = Máx. 5 Dispositivos Simultáneos
 *   · POS / Gimnasios / Clínicas / CRM: 4 Usuarios = Máx. 4 Dispositivos Simultáneos
 * - Límite de 5 acciones en Modo Demo en Vivo con restablecimiento efímero
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

      // 1) Brasil y Portugal -> Português (pt)
      const ptZones = [
        'america/sao_paulo', 'america/fortaleza', 'america/manaus', 'america/recife',
        'america/belem', 'america/bahia', 'america/cuiaba', 'america/campo_grande',
        'america/porto_velho', 'america/boa_vista', 'america/maceio', 'america/araguaina',
        'america/noronha', 'america/rio_branco', 'america/santarem',
        'europe/lisbon', 'atlantic/madeira', 'atlantic/azores'
      ];
      if (ptZones.includes(tz) || primaryNav === 'pt') {
        return 'pt';
      }

      // 2) Francia, Quebec y Territorios Francófonos -> Français (fr)
      const frZones = [
        'europe/paris', 'america/montreal', 'indian/reunion', 'africa/abidjan',
        'africa/dakar', 'america/guadeloupe', 'america/martinique', 'america/cayenne'
      ];
      if (frZones.includes(tz) || primaryNav === 'fr') {
        return 'fr';
      }

      // 3) Latinoamérica y España -> Español (es)
      const esZones = [
        'america/managua', 'america/costa_rica', 'america/mexico_city', 'america/cancun',
        'america/tijuana', 'america/merida', 'america/monterrey', 'america/chihuahua',
        'america/mazatlan', 'america/hermosillo', 'america/guatemala', 'america/el_salvador',
        'america/tegucigalpa', 'america/panama', 'america/santo_domingo', 'america/puerto_rico',
        'america/havana', 'america/bogota', 'america/lima', 'america/guayaquil',
        'america/caracas', 'america/la_paz', 'america/santiago', 'america/asuncion',
        'america/montevideo', 'america/argentina', 'europe/madrid', 'atlantic/canary'
      ];
      if (esZones.some(z => tz.startsWith(z))) {
        return 'es';
      }

      // 4) Estados Unidos, Canadá, Reino Unido, Australia o navegador en Inglés -> English (en)
      const enZones = [
        'america/new_york', 'america/chicago', 'america/denver', 'america/los_angeles',
        'america/phoenix', 'america/anchorage', 'pacific/honolulu', 'america/detroit',
        'america/indiana', 'america/kentucky', 'america/boise', 'america/toronto',
        'america/vancouver', 'america/edmonton', 'america/winnipeg', 'america/halifax',
        'europe/london', 'europe/dublin', 'australia/', 'pacific/auckland'
      ];
      if (enZones.some(z => tz.startsWith(z)) || primaryNav === 'en') {
        return 'en';
      }

      if (SUPPORTED_LANGS.includes(primaryNav)) {
        return primaryNav;
      }
    } catch (e) {}
    return 'es';
  }

  let currentLang = detectVisitorLanguage();

  // Textos propios del Guardián Cloud y Demo en 4 idiomas
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

  // Diccionario de frases e interfaz para todos los sistemas Kinetix (Gastro, POS, Clínicas, CRM, Gym)
  // Cada entrada es [TextoEspañol, English, Português, Français]
  const UI_PHRASE_TABLE = [
    // Barra Superior Demo & Botones Globales
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
    ['Claro', 'Light', 'Claro', 'Clair'],
    ['Oscuro', 'Dark', 'Escuro', 'Sombre'],

    // Navegación Gastro ERP + POS + KDS
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

    // Navegación POS & Inventarios / Clínicas / CRM
    ['Diario & Balance del Día', 'Daily Ledger & Balance', 'Diário e Balanço do Dia', 'Journal & Bilan du Jour'],
    ['Punto de Venta (POS)', 'Point of Sale (POS)', 'Ponto de Venda (PDV)', 'Point de Vente (PDV)'],
    ['Inventario & Stock', 'Inventory & Stock', 'Estoque e Produtos', 'Inventaire & Stock'],
    ['Facturas & Corte Caja', 'Invoices & Cash Close', 'Faturas e Fechamento de Caixa', 'Factures & Clôture Caisse'],
    ['Gastos, Compras, CxC & CxP', 'Expenses, Purchases, AR & AP', 'Despesas, Compras, Contas a Receber e Pagar', 'Dépenses, Achats, Créances & Dettes'],
    ['4 Usuarios & Roles', '4 Users & Roles', '4 Usuários e Perfis', '4 Utilisateurs & Rôles'],
    ['Personalizar Marca', 'Customize Brand', 'Personalizar Marca', 'Personnaliser Marque'],
    ['Licencia Activa:', 'Active License:', 'Licença Ativa:', 'Licence Active :'],
    ['4/4 Usuarios', '4/4 Users', '4/4 Usuários', '4/4 Utilisateurs'],
    ['OPERADOR ACTIVO:', 'ACTIVE OPERATOR:', 'OPERADOR ATIVO:', 'OPÉRATEUR ACTIF :'],
    ['Dashboard Clínico', 'Clinical Dashboard', 'Dashboard Clínico', 'Tableau de Bord Clinique'],
    ['Agenda de Citas & WhatsApp', 'Appointments & WhatsApp Reminders', 'Agenda de Consultas e WhatsApp', 'Agenda Rendez-vous & WhatsApp'],
    ['Pacientes & Expedientes', 'Patients & Medical Records', 'Pacientes e Prontuários', 'Patients & Dossiers Médicaux'],
    ['Consultas & Recetario PDF', 'Consultations & PDF Prescriptions', 'Consultas e Receituário PDF', 'Consultations & Ordonnances PDF'],
    ['Embudo Kanban de Ventas', 'Kanban Sales Pipeline', 'Funil Kanban de Vendas', 'Pipeline Kanban des Ventes'],
    ['Clientes & Prospectos', 'Clients & Leads', 'Clientes e Leads', 'Clients & Prospects'],
    ['Cotizador Formal PDF', 'Formal PDF Quoter', 'Orçamentos Formais em PDF', 'Générateur de Devis PDF'],
    ['Seguimiento WhatsApp', 'WhatsApp Follow-up', 'Acompanhamento WhatsApp', 'Suivi WhatsApp'],

    // Login & Acceso Rápido
    ['Portal Corporativo de Acceso para Personal Autorizado', 'Corporate Access Portal for Authorized Staff', 'Portal Corporativo de Acesso para Pessoal Autorizado', 'Portail d’Accès Corporatif pour le Personnel Autorisé'],
    ['Abrir Portal del Menú Digital & QR (Vista Comensal)', 'Open Digital & QR Menu Portal (Guest View)', 'Abrir Portal do Cardápio Digital e QR (Visão Cliente)', 'Ouvrir le Portail Menu Numérique & QR (Vue Client)'],
    ['Acceso Rápido Demo (Autocompletar y Entrar en 1 Clic)', 'Quick Demo Access (Autocomplete & Enter in 1 Click)', 'Acesso Rápido Demo (Autocompletar e Entrar em 1 Clique)', 'Accès Rapide Démo (Saisie Auto & Entrer en 1 Clic)'],
    ['Ingresar al Sistema', 'Sign In to System', 'Entrar no Sistema', 'Se Connecter au Système'],
    ['Entrar al Sistema Cloud', 'Sign In to Cloud System', 'Entrar no Sistema Cloud', 'Accéder au Système Cloud'],
    ['📘 Descargar Manual Oficial Kinetix Gastro ERP (PDF)', '📘 Download Official Kinetix Gastro ERP Manual (PDF)', '📘 Baixar Manual Oficial Kinetix Gastro ERP (PDF)', '📘 Télécharger le Manuel Officiel Kinetix Gastro ERP (PDF)'],
    ['Usuario / Correo Corporativo', 'Username / Corporate Email', 'Usuário / E-mail Corporativo', 'Utilisateur / E-mail Corporatif'],
    ['PIN de Seguridad / Contraseña', 'Security PIN / Password', 'PIN de Segurança / Senha', 'PIN de Sécurité / Mot de Passe'],

    // Acciones Comunes, POS, Cocina, Inventario, Finanzas y Configuración
    ['Guardar Configuración', 'Save Configuration', 'Salvar Configuração', 'Enregistrer la Configuration'],
    ['💾 Guardar Configuración', '💾 Save Configuration', '💾 Salvar Configuração', '💾 Enregistrer la Configuration'],
    ['💾 Guardar Cambios Ahora', '💾 Save Changes Now', '💾 Salvar Alterações Agora', '💾 Enregistrer les Modifications'],
    ['Cargar Logo desde PC', 'Upload Logo from PC', 'Carregar Logo do PC', 'Téléverser le Logo depuis le PC'],
    ['Quitar Logo', 'Remove Logo', 'Remover Logo', 'Supprimer le Logo'],
    ['Efectivo', 'Cash', 'Dinheiro', 'Espèces'],
    ['Tarjeta', 'Card', 'Cartão', 'Carte'],
    ['Transferencia', 'Bank Transfer', 'Transferência', 'Virement'],
    ['Mixto', 'Split Payment', 'Pagamento Misto', 'Paiement Mixte'],
    ['Cargar a CxC', 'Charge to AR (Credit)', 'Lançar em Conta (Fiado)', 'Facturer à Crédit'],
    ['Cobrar y Emitir Ticket Térmico (58mm / 80mm)', 'Charge & Issue Thermal Receipt (58mm / 80mm)', 'Cobrar e Emitir Cupom Térmico (58mm / 80mm)', 'Encaisser & Émettre Ticket Thermique (58mm / 80mm)'],
    ['Imprimir Ticket (80mm)', 'Print Receipt (80mm)', 'Imprimir Cupom (80mm)', 'Imprimer Ticket (80mm)'],
    ['Imprimir Ticket (58mm)', 'Print Receipt (58mm)', 'Imprimir Cupom (58mm)', 'Imprimer Ticket (58mm)'],
    ['Enviar por WhatsApp (1 Clic)', 'Send via WhatsApp (1 Click)', 'Enviar por WhatsApp (1 Clique)', 'Envoyer par WhatsApp (1 Clic)'],
    ['✅ Marcar Orden Lista / Entregada', '✅ Mark Order Ready / Delivered', '✅ Marcar Pedido Pronto / Entregue', '✅ Marquer Commande Prête / Livrée'],
    ['Iniciar Preparación', 'Start Preparation', 'Iniciar Preparo', 'Démarrer la Préparation'],
    ['Editar Orden', 'Edit Order', 'Editar Pedido', 'Modifier la Commande'],
    ['Personalización del Sistema y Datos del Restaurante / Cafetería', 'System Customization & Restaurant / Cafe Profile', 'Personalização do Sistema e Dados do Restaurante / Cafeteria', 'Personnalisation du Système & Profil du Restaurant / Café'],
    ['Identidad de Marca, Logo y Parámetros del Negocio', 'Brand Identity, Logo & Business Parameters', 'Identidade da Marca, Logo e Parâmetros do Negócio', 'Identité de Marque, Logo & Paramètres de l’Entreprise'],
    ['Personalizar Logo, Nombre y Especialidad', 'Customize Logo, Name & Specialty', 'Personalizar Logo, Nome e Especialidade', 'Personnaliser Logo, Nom & Spécialité'],
    ['Personalizar Logo, Empresa y Datos de Cotización', 'Customize Logo, Company & Quotation Details', 'Personalizar Logo, Empresa e Dados de Orçamento', 'Personnaliser Logo, Entreprise & Détails des Devis']
  ];

  // Construir mapas rápidos de traducción a partir de la tabla en español
  const EXACT_TRANSLATION_MAP = { en: new Map(), pt: new Map(), fr: new Map() };
  UI_PHRASE_TABLE.forEach(row => {
    const [esText, enText, ptText, frText] = row;
    EXACT_TRANSLATION_MAP.en.set(esText, enText);
    EXACT_TRANSLATION_MAP.pt.set(esText, ptText);
    EXACT_TRANSLATION_MAP.fr.set(esText, frText);
  });

  function translateTextString(origEsText, targetLang) {
    if (!origEsText || targetLang === 'es') return origEsText;
    const trimmed = origEsText.trim();
    if (!trimmed) return origEsText;

    const map = EXACT_TRANSLATION_MAP[targetLang];
    if (!map) return origEsText;

    if (map.has(trimmed)) {
      return origEsText.replace(trimmed, map.get(trimmed));
    }

    // Reemplazo parcial para cadenas compuestas
    let out = origEsText;
    for (let i = 0; i < UI_PHRASE_TABLE.length; i++) {
      const esPhrase = UI_PHRASE_TABLE[i][0];
      if (esPhrase.length > 5 && out.includes(esPhrase)) {
        const idx = targetLang === 'en' ? 1 : targetLang === 'pt' ? 2 : 3;
        out = out.split(esPhrase).join(UI_PHRASE_TABLE[i][idx]);
      }
    }
    return out;
  }

  function translateDOMTree(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent) continue;
      const tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'TEXTAREA') continue;

      if (typeof node.__kinetixOrigEs === 'undefined') {
        const val = node.nodeValue || '';
        if (val.trim().length > 0) {
          node.__kinetixOrigEs = val;
        }
      }
      if (node.__kinetixOrigEs) {
        const nextVal = currentLang === 'es'
          ? node.__kinetixOrigEs
          : translateTextString(node.__kinetixOrigEs, currentLang);
        if (node.nodeValue !== nextVal) {
          node.nodeValue = nextVal;
        }
      }
    }

    // Sincronizar todos los selectores de idioma que existan en la página o en Configuración
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

    try {
      window.dispatchEvent(new CustomEvent('kinetix:langchange', { detail: { lang: clean } }));
    } catch (e) {}
  }

  // Escuchar cambios de idioma enviados por postMessage desde el portal padre
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'KINETIX_SET_LANG' && e.data.lang) {
      setGlobalLanguage(e.data.lang);
    }
  });

  // Inyectar selector de idioma dentro de la pestaña de Configuración (#tab-settings) en sistemas HTML (POS, Clínica, CRM)
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

    // Insertar justo después del encabezado de configuración
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

    // Selector rápido de idioma junto a la píldora Cloud PWA
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
  // 3. KINETIX DEMO SECURITY & EPHEMERAL GUARD v5.0
  // Límite estricto de 5 acciones en modo prueba
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

    // Observar cambios dinámicos en el DOM (React / pestañas / modales) para traducir en tiempo real
    try {
      const observer = new MutationObserver(function () {
        if (currentLang !== 'es') {
          scheduleDOMTranslation();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
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
