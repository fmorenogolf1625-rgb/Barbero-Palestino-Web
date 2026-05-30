import React, { useState, useEffect } from 'react';

// === BASE DE DATOS INICIAL & PERSISTENCIA (LOCAL STORAGE) ===
const APP_STORAGE_KEY = 'barbero_palestino_db_v3';

const DEFAULT_SERVICES = [
  { id: 's1', name: 'Corte Premium Palestino', duration: '40 min', price: 25, category: 'Cortes', desc: 'Asesoramiento de visagismo, corte premium a tijera/máquina, lavado con champú purificante, peinado con producto de alta gama y un perfilado de cejas de cortesía.' },
  { id: 's2', name: 'Perfilado de Barba Ritual', duration: '30 min', price: 18, category: 'Barba', desc: 'Diseño y perfilado de barba preciso con navaja y toalla caliente perfumada con aceites esenciales orgánicos, masaje relajante e hidratación intensa.' },
  { id: 's3', name: 'El Combo Elite (Corte + Barba)', duration: '75 min', price: 38, category: 'Combos', desc: 'La experiencia completa de autor. Corte personalizado Premium + Ritual de barba con toalla caliente, exfoliación facial y acabado impecable.' },
  { id: 's4', name: 'Corte Infantil (Menores de 12)', duration: '30 min', price: 18, category: 'Cortes', desc: 'Atención especial y corte moderno y adaptado para los más jóvenes de la casa, manteniendo la esencia premium.' },
  { id: 's5', name: 'Tratamiento Capilar Detox + Hidratación', duration: '20 min', price: 15, category: 'Tratamientos', desc: 'Exfoliación profunda del cuero cabelludo para eliminar impurezas, mascarilla nutritiva regeneradora y masaje craneal estimulante.' }
];

const DEFAULT_BARBERS = [
  { id: 'b1', name: 'Ahmed "Palestino"', role: 'Master Barber & Fundador', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400', rating: '5.0' },
  { id: 'b2', name: 'Karim', role: 'Especialista en Degradados & Color', avatar: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&q=80&w=400', rating: '4.9' },
  { id: 'b3', name: 'Yousef', role: 'Especialista en Barba & Ritual Classic', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400', rating: '4.9' }
];

const INITIAL_HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

const REVIEWS_MOCK = [
  { id: 1, name: 'Marcos R.', rating: 5, date: 'Hace 2 días', text: 'El mejor degradado de Barcelona sin duda. Ahmed tiene una precisión milimétrica. El local es impresionante, la música de fondo y la atención es de 10.' },
  { id: 2, name: 'David G.', rating: 5, date: 'Hace 1 semana', text: 'La experiencia del ritual de toalla caliente es de otro planeta. Es una barbería de lujo, pagas por calidad real y la identidad del corte es excelente.' },
  { id: 3, name: 'Yassine B.', rating: 5, date: 'Hace 3 días', text: 'Ambiente espectacular, muy urbano y exclusivo. Súper profesionales, puntuales y atentos. La reserva por la web es sumamente rápida.' }
];

// === DICCIONARIOS DE TRADUCCIÓN COMPLETA ===
const TRANSLATIONS = {
  es: {
    heroTag: 'ESTÉTICA STREET-LUXURY & PRECISIÓN EXTREMA',
    heroTitle: 'PRECISIÓN. ESTILO. IDENTIDAD.',
    heroDesc: 'No hacemos cortes genéricos. Esculpimos tu identidad con técnicas avanzadas de barbería internacional. La experiencia premium de Barcelona inspirada en las élites de Dubái y Londres.',
    btnReserve: 'RESERVAR CITA',
    btnServices: 'VER SERVICIOS',
    navConcept: 'Concepto',
    navMenu: 'Menú',
    navGallery: 'Galería',
    navOpinions: 'Opiniones',
    clubAccess: 'Acceso Club',
    conceptTag: 'Nuestra Identidad',
    conceptTitle: 'DONDE LA CALLE SE ENCUENTRA CON EL LUJO.',
    conceptDesc1: 'Nacidos con la visión de romper el molde de la barbería tradicional. En Barbero Palestino, el corte de pelo es un arte de alta costura, y cada barba es un monumento tallado a la perfección.',
    conceptDesc2: 'Hemos creado un refugio urbano contemporáneo que fusiona la comodidad tecnológica, un ambiente estrictamente selecto y el dominio artesanal de las tijeras. Aquí no solo cambias tu look; refuerzas tu estatus.',
    stat1: 'Clientes Satisfechos',
    stat2: 'Años de Perfección',
    menuTag: 'Servicios Premium',
    menuTitle: 'MENÚ DE AUTOR',
    menuDesc: 'Tarifas transparentes. Servicios integrales de alta gama diseñados para el hombre moderno.',
    galleryTag: 'Portfolio Visual',
    galleryTitle: 'NUESTRO ESTILO',
    galleryDesc: 'Fotografías reales tomadas en nuestra barbería. Resultados perfectos, texturas pulidas y cortes con identidad propia.',
    reviewsTitle: 'LO QUE OPINAN NUESTROS CLIENTES',
    reviewsDesc: 'Clientes reales que ya han dado el paso para elevar su identidad visual.',
    ctaTag: 'Tu Turno Ha Llegado',
    ctaTitle: '¿LISTO PARA EL CAMBIO DE NIVEL?',
    ctaDesc: 'Elige tu horario ideal con comodidad. Sistema de reservas integrado en tiempo real sin esperas telefónicas.',
    footerDesc: 'La marca definitiva de cuidado masculino, precisión extrema y vanguardia urbana.',
    footerHours: 'HORARIO DE AUTOR',
    footerStudio: 'NUESTRO ESTUDIO',
    footerTech: 'TECNOLOGÍA',
    monFri: 'Lunes a Viernes',
    saturdays: 'Sábados',
    sundays: 'Domingos',
    closed: 'Cerrado',
    selectLang: 'Idioma',
    adminPanel: 'Panel del Barbero',
    createAccount: 'Crear Cuenta Cliente',
    bookingSystem: 'SISTEMA INTEGRADO',
    reserveTitle: 'RESERVAR RITUAL ELITE',
    step1: '1. Servicio',
    step2: '2. Profesional & Día',
    step3: '3. Hora',
    step4: '4. Confirmar',
    noHours: 'No quedan horas libres para este día o barbero.',
    tipBooking: '💡 Consejo de reserva: Las horas tachadas indican que ya han sido reservadas por otros miembros o corresponden a un tiempo que ya ha pasado.',
    chooseProfessional: 'Elige Profesional',
    chooseDate: 'Elige Fecha de Reserva',
    backToServices: '← Volver a Servicios',
    backToStep2: '← Volver al paso anterior',
    backToHours: '← Volver a Hores',
    notesLabel: 'Notas especiales para el Barbero (Opcional)',
    notesPlaceholder: 'Ej. ¿Deseas algún tipo de producto de acabado especial, degradado muy corto, café cortesía, etc.?',
    finishReserve: 'Finalizar y Reservar Turno ✓',
    clientRegistered: 'CLIENTE REGISTRADO',
    autocompleted: 'Autocompletado Activo',
    guestMessage: '¿Ya tienes cuenta del Club?',
    loginNow: 'Iniciar Sesión Ahora',
    reserveSuccess: '¡RITUAL AGENDADO CON ÉXITO!',
    reserveSuccessDesc: 'Tu cita ha sido guardada y confirmada en tiempo real. Te hemos enviado un correo electrónico con los detalles.',
    cats: { Cortes: 'Cortes', Barba: 'Barba', Combos: 'Combos', Tratamientos: 'Tratamientos' },
    services: {
      s1: { name: 'Corte Premium Palestino', desc: 'Asesoramiento de visagismo, corte premium a tijera/máquina, lavado con champú purificante, peinado con producto de alta gama y un perfilado de cejas de cortesía.' },
      s2: { name: 'Perfilado de Barba Ritual', desc: 'Diseño y perfilado de barba preciso con navaja y toalla caliente perfumada con aceites esenciales orgánicos, masaje relajante e hidratación intensa.' },
      s3: { name: 'El Combo Elite (Corte + Barba)', desc: 'La experiencia completa de autor. Corte personalizado Premium + Ritual de barba con toalla caliente, exfoliación facial y acabado impecable.' },
      s4: { name: 'Corte Infantil (Menores de 12)', desc: 'Atención especial y corte moderno y adaptado para los más jóvenes de la casa, manteniendo la esencia premium.' },
      s5: { name: 'Tratamiento Capilar Detox + Hidratación', desc: 'Exfoliación profunda del cuero cabelludo para eliminar impurezas, mascarilla nutritiva regeneradora y masaje craneal estimulante.' }
    }
  },
  en: {
    heroTag: 'STREET-LUXURY AESTHETICS & EXTREME PRECISION',
    heroTitle: 'PRECISION. STYLE. IDENTITY.',
    heroDesc: 'We do not do generic haircuts. We sculpt your identity with advanced international barbering techniques. The premium experience in Barcelona inspired by the elites of Dubai and London.',
    btnReserve: 'BOOK APPOINTMENT',
    btnServices: 'VIEW SERVICES',
    navConcept: 'Concept',
    navMenu: 'Menu',
    navGallery: 'Gallery',
    navOpinions: 'Reviews',
    clubAccess: 'Club Access',
    conceptTag: 'Our Identity',
    conceptTitle: 'WHERE THE STREET MEETS LUXURY.',
    conceptDesc1: 'Born with the vision to break the mold of traditional barbering. At Barbero Palestino, a haircut is haute couture, and every beard is a monument carved to perfection.',
    conceptDesc2: 'We have created a contemporary urban sanctuary that merges technological convenience, a strictly select environment, and master scissor craftsmanship. Here, you don’t just change your look; you reinforce your status.',
    stat1: 'Satisfied Clients',
    stat2: 'Years of Perfection',
    menuTag: 'Premium Services',
    menuTitle: 'SIGNATURE MENU',
    menuDesc: 'Transparent pricing. Comprehensive high-end services tailored for the modern man.',
    galleryTag: 'Visual Portfolio',
    galleryTitle: 'OUR STYLE',
    galleryDesc: 'Real photos taken in our barbershop. Flawless results, polished textures, and cuts with their own identity.',
    reviewsTitle: 'WHAT OUR CLIENTS SAY',
    reviewsDesc: 'Real clients who have already taken the step to elevate their visual identity.',
    ctaTag: 'Your Turn Has Arrived',
    ctaTitle: 'READY FOR THE NEXT LEVEL?',
    ctaDesc: 'Choose your ideal schedule with comfort. Integrated real-time booking system with no phone waiting.',
    footerDesc: 'The ultimate brand for male grooming, extreme precision, and urban edge.',
    footerHours: 'SIGNATURE HOURS',
    footerStudio: 'OUR STUDIO',
    footerTech: 'TECHNOLOGY',
    monFri: 'Monday to Friday',
    saturdays: 'Saturdays',
    sundays: 'Sundays',
    closed: 'Closed',
    selectLang: 'Language',
    adminPanel: 'Barber Panel',
    createAccount: 'Create Client Account',
    bookingSystem: 'INTEGRATED SYSTEM',
    reserveTitle: 'BOOK ELITE RITUAL',
    step1: '1. Service',
    step2: '2. Barber & Date',
    step3: '3. Hour',
    step4: '4. Confirm',
    noHours: 'No free slots left for this day or barber.',
    tipBooking: '💡 Booking tip: Strikethrough hours indicate that they have already been booked by other members or correspond to a time that has already passed.',
    chooseProfessional: 'Choose Professional',
    chooseDate: 'Choose Booking Date',
    backToServices: '← Back to Services',
    backToStep2: '← Back to previous step',
    backToHours: '← Back to Hours',
    notesLabel: 'Special notes for the Barber (Optional)',
    notesPlaceholder: 'E.g., Do you want any specific finish product, very short fade, complimentary coffee, etc.?',
    finishReserve: 'Complete & Book Slot ✓',
    clientRegistered: 'REGISTERED CLIENT',
    autocompleted: 'Auto-fill Active',
    guestMessage: 'Already have a Club account?',
    loginNow: 'Log In Now',
    reserveSuccess: 'RITUAL SUCCESSFULLY BOOKED!',
    reserveSuccessDesc: 'Your appointment has been saved and confirmed in real time. We have sent you a confirmation email.',
    cats: { Cortes: 'Haircuts', Barba: 'Beard', Combos: 'Combos', Tratamientos: 'Treatments' },
    services: {
      s1: { name: 'Palestinian Premium Cut', desc: 'Visagism advice, premium scissor/clipper cut, wash with purifying shampoo, styling with high-end product and a complimentary eyebrow shaping.' },
      s2: { name: 'Beard Shaping Ritual', desc: 'Precise beard design and shaping with a razor and hot towel scented with organic essential oils, relaxing massage and intense hydration.' },
      s3: { name: 'The Elite Combo (Cut + Beard)', desc: 'The complete author experience. Personalized Premium haircut + Beard ritual with hot towel, facial scrub and impeccable finish.' },
      s4: { name: 'Kids Cut (Under 12)', desc: 'Special attention and modern cut adapted for the youngest in the house, maintaining the premium essence.' },
      s5: { name: 'Detox Hair Treatment + Hydration', desc: 'Deep scalp exfoliation to remove impurities, regenerating nourishing mask and stimulating cranial massage.' }
    }
  },
  ca: {
    heroTag: 'ESTÈTICA STREET-LUXURY I PRECISIÓ EXTREMA',
    heroTitle: 'PRECISIÓ. ESTIL. IDENTITAT.',
    heroDesc: 'No fem talls genèrics. Esculpim la teva identitat amb tècniques avançades de barberia internacional. L’experiència premium de Barcelona inspirada en les elits de Dubai i Londres.',
    btnReserve: 'RESERVAR CITA',
    btnServices: 'VEURE SERVEIS',
    navConcept: 'Concepte',
    navMenu: 'Menú',
    navGallery: 'Galeria',
    navOpinions: 'Opinions',
    clubAccess: 'Accés Club',
    conceptTag: 'La Nostra Identitat',
    conceptTitle: 'ON EL CARRER ES TROBA AMB EL LUXE.',
    conceptDesc1: 'Nascuts amb la visió de trencar el motlle de la barberia tradicional. A Barbero Palestino, el tall de cabell és un art d’alta costura, i cada barba és un monument esculpit a la perfecció.',
    conceptDesc2: 'Hem creat un refugi urbà contemporani que fusiona la comoditat tecnològica, un ambient estrictament selecte i el domini artesanal de les tisores. Aquí no només cambies el teu look; Dynamicament estàs reforçant el teu estatus.',
    stat1: 'Clients Satisfets',
    stat2: 'Anys de Perfecció',
    menuTag: 'Serveis Premium',
    menuTitle: 'MENÚ D’AUTOR',
    menuDesc: 'Tarifes transparents. Serveis integrals d’alta gamma dissenyats per a l’home modern.',
    galleryTag: 'Portfolio Visual',
    galleryTitle: 'EL NOSTRE ESTIL',
    galleryDesc: 'Fotografies reals preses a la nostra barberia. Resultats perfectes, textures polides i talls amb identitat pròpia.',
    reviewsTitle: 'EL QUE OPINEN ELS NOSTRES CLIENTS',
    reviewsDesc: 'Clients reals que ja han fet el pas per elevar la seva identitat visual.',
    ctaTag: 'El Teu Torn Ha Arribat',
    ctaTitle: 'LLORT PER AL CANVI DE NIVELL?',
    ctaDesc: 'Tria el teu horari ideal amb comoditat. Sistema de reserves integrat en temps real sense esperes telefòniques.',
    footerDesc: 'La marca definitiva de cura masculina, precisió extrema i avantguarda urbana.',
    footerHours: 'HORARI D’AUTOR',
    footerStudio: 'EL NOSTRE ESTUDI',
    footerTech: 'TECNOLOGIA',
    monFri: 'Dilluns a Divendres',
    saturdays: 'Dissabtes',
    sundays: 'Diumenges',
    closed: 'Tancat',
    selectLang: 'Idioma',
    adminPanel: 'Panell del Barber',
    createAccount: 'Crear Compte Client',
    bookingSystem: 'SISTEMA INTEGRAT',
    reserveTitle: 'RESERVAR RITUAL ELITE',
    step1: '1. Servei',
    step2: '2. Professional i Dia',
    step3: '3. Hora',
    step4: '4. Confirmar',
    noHours: 'No queden hores lliures per a aquest dia o barber.',
    tipBooking: '💡 Consell de reserva: Les hores ratllades indiquen que ja han estat reservades per altres membres o corresponen a un temps que ja ha passat.',
    chooseProfessional: 'Tria Professional',
    chooseDate: 'Tria Data de Reserva',
    backToServices: '← Tornar a Serveis',
    backToStep2: '← Tornar al pas anterior',
    backToHours: '← Tornar a Hores',
    notesLabel: 'Notes especials per al Barber (Opcional)',
    notesPlaceholder: 'Ex. Desitges algun tipus de producte d’acabat especial, degradat molt curt, cafè de cortesia, etc.?',
    finishReserve: 'Finalitzar i Reservar Torn ✓',
    clientRegistered: 'CLIENT REGISTRAT',
    autocompleted: 'Autocompletar Actiu',
    guestMessage: 'Ja tens compte del Club?',
    loginNow: 'Iniciar Sessió Ara',
    reserveSuccess: '¡RITUAL RESERVAT AMB ÈXIT!',
    reserveSuccessDesc: 'La teva cita ha estat desada i confirmada en temps real. T’hem enviat un correu electrònic amb els detalls.',
    cats: { Cortes: 'Talls', Barba: 'Barba', Combos: 'Combos', Tratamientos: 'Tractaments' },
    services: {
      s1: { name: 'Tall Premium Palestí', desc: 'Assessorament de visatgisme, tall premium a tisora/màquina, rentat amb xampú purificant, pentinat amb producte d’alta gamma i un perfilat de celles de cortesia.' },
      s2: { name: 'Perfilat de Barba Ritual', desc: 'Disseny i perfilat de barba precís amb navalla i tovallola calenta perfumada amb olis essencials orgànics, massatge relaxant i hidratació intensa.' },
      s3: { name: 'El Combo Elit (Tall + Barba)', desc: 'L’experiència completa d’autor. Tall personalitzat Premium + Ritual de barba amb tovallola calenta, exfoliació facial i acabat impecable.' },
      s4: { name: 'Tall Infantil (Menors de 12)', desc: 'Atenció especial i tall modern i adaptat per als més joves de la casa, mantenint l’essència premium.' },
      s5: { name: 'Tractament Capil·lar Detox + Hidratación', desc: 'Exfoliació profunda del cuir cabellut per eliminar impureses, mascareta nutritiva regeneradora i massatge cranial estimulant.' }
    }
  },
  fr: {
    heroTag: 'ESTHÉTIQUE STREET-LUXURY & PRÉCISION EXTRÊME',
    heroTitle: 'PRÉCISION. STYLE. IDENTITÉ.',
    heroDesc: 'Nous ne faisons pas de coupes génériques. Nous sculptons votre identité grâce à des techniques avancées de coiffure internationale. L’expérience premium de Barcelone inspirée des élites de Dubaï et de Londres.',
    btnReserve: 'RÉSERVER UN CRÉNEAU',
    btnServices: 'VOIR LES SERVICES',
    navConcept: 'Concept',
    navMenu: 'Menu',
    navGallery: 'Galerie',
    navOpinions: 'Avis',
    clubAccess: 'Accès Club',
    conceptTag: 'Notre Identité',
    conceptTitle: 'LÀ OÙ LA RUE RENCONTRE LE LUXE.',
    conceptDesc1: 'Nés avec la vision de briser les codes de la coiffure traditionnelle. Chez Barbero Palestino, la coupe de cheveux est un art de haute couture, et chaque barbe est un monument sculpté à la perfection.',
    conceptDesc2: 'Nous avons créé un sanctuaire urbain contemporain qui allie confort technologique, atmosphère strictement sélective et maîtrise artisanale des ciseaux. Ici, vous ne changez pas seulement de look ; vous renforcez votre statut.',
    stat1: 'Clients Satisfaits',
    stat2: 'Années de Perfection',
    menuTag: 'Services Premium',
    menuTitle: 'MENU SIGNATURE',
    menuDesc: 'Tarifs transparents. Services complets haut de gamme conçus pour l’homme moderne.',
    galleryTag: 'Portfolio Visuel',
    galleryTitle: 'NOTRE STYLE',
    galleryDesc: 'De vraies photos prises dans notre salon. Des résultats parfaits, des textures soignées et des coupes avec leur propre identité.',
    reviewsTitle: 'CE QUE DISENT NOS CLIENTS',
    reviewsDesc: 'De vrais clients qui ont déjà franchi le pas pour sublimer leur identité visuelle.',
    ctaTag: 'Votre Tour Est Venu',
    ctaTitle: 'PRÊT POUR LE NIVEAU SUPÉRIEUR ?',
    ctaDesc: 'Choisissez votre horaire idéal en toute simplicité. Système de réservation intégré en temps réel sans attente téléphonique.',
    footerDesc: 'La marque ultime de soins pour hommes, de précision extrême et d’avant-garde urbaine.',
    footerHours: 'HORAIRES SIGNATURE',
    footerStudio: 'NOTRE STUDIO',
    footerTech: 'TECHNOLOGIE',
    monFri: 'Lundi au Vendredi',
    saturdays: 'Samedi',
    sundays: 'Dimanche',
    closed: 'Fermé',
    selectLang: 'Langue',
    adminPanel: 'Espace Barbier',
    createAccount: 'Créer un Compte Client',
    bookingSystem: 'SYSTÈME INTÉGRÉ',
    reserveTitle: 'RÉSERVER UN RITUEL D’ÉLITE',
    step1: '1. Service',
    step2: '2. Professionnel & Date',
    step3: '3. Heure',
    step4: '4. Confirmer',
    noHours: 'Plus de créneaux disponibles pour ce jour ou ce barbier.',
    tipBooking: '💡 Conseil de réservation : Les heures barrées indiquent qu’elles ont déjà été réservées par d’autres membres ou qu’elles correspondent à un horaire déjà dépassé.',
    chooseProfessional: 'Choisir un Professionnel',
    chooseDate: 'Choisir la Date',
    backToServices: '← Retour aux Services',
    backToStep2: '← Retour à l’étape précédente',
    backToHours: '← Retour aux Horaires',
    notesLabel: 'Notes spéciales pour le Barbier (Optionnel)',
    notesPlaceholder: 'Ex. Souhaitez-vous un produit de finition spécifique, un dégradé très court, un café offert, etc. ?',
    finishReserve: 'Confirmer et Réserver ✓',
    clientRegistered: 'CLIENT ENREGISTRÉ',
    autocompleted: 'Saisie Auto Active',
    guestMessage: 'Vous avez déjà un compte Club ?',
    loginNow: 'Se Connecter Maintenant',
    reserveSuccess: 'RITUAL RÉSERVÉ AVEC SUCCÈS !',
    reserveSuccessDesc: 'Votre rendez-vous a été enregistré et confirmé en temps réel. Nous vous avons envoyé un e-mail de confirmation.',
    cats: { Cortes: 'Coupes', Barba: 'Barbe', Combos: 'Combos', Tratamientos: 'Soins' },
    services: {
      s1: { name: 'Coupe Premium Palestino', desc: 'Conseils visagisme, coupe premium aux ciseaux/tondeuse, shampoing purifiant, coiffage avec produit haut de gamme et restructuration des sourcils offerte.' },
      s2: { name: 'Rituel Taille de Barbe', desc: 'Dessin et taille précise de la barbe au coupe-chou avec serviette chaude parfumée aux huiles essentielles bio, massage relaxant et hydratation intense.' },
      s3: { name: 'Le Combo Élite (Coupe + Barbe)', desc: 'L’expérience signature complète. Coupe personnalisée Premium + Rituel de barbe avec serviette chaude, gommage facial et finitions impeccables.' },
      s4: { name: 'Coupe Enfant (Moins de 12 ans)', desc: 'Attention bienveillante et coupe tendance adaptée aux plus jeunes, tout en conservant l’esprit premium.' },
      s5: { name: 'Soin Capillaire Détox + Hydratation', desc: 'Exfoliation profonde du cuir chevelu pour éliminer les impuretés, masque nourrissant régénérant et massage crânien stimulant.' }
    }
  },
  ar: {
    heroTag: 'جماليات شارع الفخامة والدقة المتناهية',
    heroTitle: 'الدقة. الأسلوب. الهوية.',
    heroDesc: 'نحن لا نقدم قصات شعر عادية. ننحت هويتك بتقنيات الحلاقة العالمية المتقدمة. تجربة النخبة في برشلونة المستوحاة من دبي ولندن.',
    btnReserve: 'حجز موعد',
    btnServices: 'عرض الخدمات',
    navConcept: 'المفهوم',
    navMenu: 'القائمة',
    navGallery: 'المعرض',
    navOpinions: 'الآراء',
    clubAccess: 'دخول الأعضاء',
    conceptTag: 'هويتنا',
    conceptTitle: 'حيث يلتقي الشارع بالفخامة والتميز.',
    conceptDesc1: 'ولدت رؤيتنا لكسر قالب الحلاقة التقليدية. في صالون الحلاق الفلسطيني، حلاقة الشعر هي فن راقٍ، وكل لحية هي صرح منحوت بدقة.',
    conceptDesc2: 'لقد أنشأنا ملاذًا حضريًا معاصرًا يجمع بين الراحة التكنولوجية والأجواء النخبوية والتحكم الحرفي بالمقص. هنا لا تغير مظهرك فحسب؛ بل تعزز مكانتك.',
    stat1: 'عملاء سعداء',
    stat2: 'سنوات من التميز',
    menuTag: 'خدمات فاخرة',
    menuTitle: 'قائمة التوقيع الخاص',
    menuDesc: 'أسعار شفافة. خدمات راقية متكاملة مصممة للرجل العصري الأنيق.',
    galleryTag: 'المعرض المرئي',
    galleryTitle: 'أسلوبنا الخاص',
    galleryDesc: 'صور حقيقية ملتقطة في صالوننا. نتائج مثالية وتفاصيل دقيقة لقصات ذات هوية فريدة.',
    reviewsTitle: 'ماذا يقول عملاؤنا',
    reviewsDesc: 'عملاء حقيقيون اتخذوا بالفعل الخطوة للارتقاء بهويتهم البصرية.',
    ctaTag: 'لقد حان دورك',
    ctaTitle: 'جاهز للانتقال للمستوى التالي؟',
    ctaDesc: 'اختر وقتك المثالي بكل سهولة وسرعة. نظام حجز متكامل وفوري دون فترات انتظار.',
    footerDesc: 'العلامة التجارية المثالية للعناية بالرجل، دقة فائقة وريادة عصرية متميزة.',
    footerHours: 'أوقات العمل المعتمدة',
    footerStudio: 'الصالون الخاص بنا',
    footerTech: 'التكنولوجيا والنظام',
    monFri: 'من الاثنين إلى الجمعة',
    saturdays: 'السبت',
    sundays: 'الأحد',
    closed: 'مغلق',
    selectLang: 'اللغة',
    adminPanel: 'لوحة التحكم للحلاق',
    createAccount: 'إنشاء حساب عميل',
    bookingSystem: 'نظام حجز ذكي ومتكامل',
    reserveTitle: 'حجز طقوس النخبة',
    step1: '١. الخدمة المطلوبة',
    step2: '٢. الحلاق واليوم',
    step3: '٣. الوقت المناسب',
    step4: '٤. تأكيد الحجز',
    noHours: 'لا توجد أوقات متاحة لهذا اليوم أو الحلاق.',
    tipBooking: '💡 تلميح الحجز: الأوقات المشطوبة تعني أنها محجوزة مسبقًا من قبل أعضاء آخرين أو أنها أوقات قد مضت بالفعل.',
    chooseProfessional: 'اختر الحلاق المفضل',
    chooseDate: 'اختر تاريخ الحجز',
    backToServices: '← العودة للخدمات',
    backToStep2: '← العودة للخطوة السابقة',
    backToHours: '← العودة لاختيار الوقت',
    notesLabel: 'ملاحظات خاصة للحلاق (اختياري)',
    notesPlaceholder: 'مثال: هل ترغب في استخدام منتجات تصفيف معينة، تدريج حاد، قهوة ترحيبية، إلخ؟',
    finishReserve: 'إنهاء وتأكيد الموعد ✓',
    clientRegistered: 'عضو مسجل في النادي',
    autocompleted: 'تعبئة البيانات تلقائيًا نشطة',
    guestMessage: 'هل لديك حساب في النادي؟',
    loginNow: 'سجل دخولك الآن',
    reserveSuccess: 'تم حجز موعدك بنجاح تام!',
    reserveSuccessDesc: 'تم حفظ موعدك وتأكيده في الوقت الفعلي. لقد أرسلنا لك بريدًا إلكترونيًا يحتوي على التفاصيل.',
    cats: { Cortes: 'قصات', Barba: 'لحية', Combos: 'كومبو', Tratamientos: 'علاجات' },
    services: {
      s1: { name: 'قصة شعر فلسطينية فاخرة', desc: 'استشارة المظهر، قصة شعر ممتازة بالمقص أو الماكينة، غسيل بشامبو مطهر، وتصفيف بمنتجات راقية مع تحديد مجاني للحواجب.' },
      s2: { name: 'طقوس تحديد اللحية', desc: 'تصميم وتحديد دقيق للحية بالشفرة والمنشفة الساخنة المعطرة بالزيوت الطبيعية العضوية، ومساج مريح وترطيب عميق.' },
      s3: { name: 'الكومبو النخبوي (شعر + لحية)', desc: 'التجربة الكاملة والمميزة. قصة شعر شخصية فاخرة + طقوس تحديد اللحية بالمنشفة الساخنة وتقشير الوجه بلمسة نهائية مثالية.' },
      s4: { name: 'قصة الأطفال (أقل من ١٢ سنة)', desc: 'عناية خاصة وتصفيف حديث ملائم لشباب المستقبل مع الحفاظ على روح الفخامة.' },
      s5: { name: 'علاج ديتوكس وترطيب الشعر', desc: 'تقشير عميق لفروة الرأس للتخلص من الشوائب، وقناع مغذٍ ومجدد مع تدليك مريح للرأس.' }
    }
  },
  ps: {
    heroTag: 'هيبة الفخامة ودقة الكامِل يا حَبيبي',
    heroTitle: 'ترتيب. هيبة. كاريزما الـPALESTINO.',
    heroDesc: 'ما بنعمل قصّات عادية. بنرسم هيبتك برسم بمقصات احترافية من دبي ولندن لقلب برشلونة. حلاقة ملوكية بتليق بمقامك الرفيع والراقي جداً.',
    btnReserve: 'احجز هيبتك هسّا',
    btnServices: 'شوف المنيو الفخم',
    navConcept: 'قصتنا',
    navMenu: 'المنيو الخاص',
    navGallery: 'معرض الهيبة',
    navOpinions: 'آراء الشباب',
    clubAccess: 'دخول الزِلم',
    conceptTag: 'أصل الحكاية والترتيب',
    conceptTitle: 'وين هيبة الشارع بتلتقي بالفخامة المطلقة.',
    conceptDesc1: 'بلشنا برؤية نكسر فيها الروتين والتقليد. عند "الحلاق الفلسطيني"، قصّة الشعر هي فن وهيبة وتفصيل عالي المستوى، وكل لحية بنرسمها رسم بالموس.',
    conceptDesc2: 'عملنالك صالون فخم ورايق يجمع بين التكنولوجيا الحديثة، والراحة الملوكية، وإبداع مقصاتنا. هون إنت ما بتغير قصة شعرك بس؛ إنت بتأكد هيبتك وحضورك الملوكي.',
    stat1: 'شباب راضيين ومبسوطين',
    stat2: 'سنين من الدقة والإبداع والترتيب',
    menuTag: 'طقوس النخبة والفخامة',
    menuTitle: 'منيو الملوك والزِلم',
    menuDesc: 'أسعار واضحة على المكشوف. خدمات ملوكية مصممة خصيصاً للرجل الأنيق والراقي.',
    galleryTag: 'شغلنا الفخم ع الأرض',
    galleryTitle: 'فن الحلاقة والهيبة',
    galleryDesc: 'صور حقيقية من صالوننا. زوايا مرسومة ومكحلة، وشغل ملوكي بيحكي عن حاله.',
    reviewsTitle: 'شو بيحكوا عنا زبائن النخبة',
    reviewsDesc: 'شباب جربوا الشغل الملوكي وأكدوا حضورهم وهيبتهم معنا.',
    ctaTag: 'صار دورك تترتب يا غالي',
    ctaTitle: 'جاهز ترفع هيبتك ليفل جديد؟',
    ctaDesc: 'احجز وقتك هسّا بكل سهولة وراحة. نظام ذكي وسريع على السريع بدون لف ودوران ولا مكالمات تليفون.',
    footerDesc: 'العلامة الفارقة في ترتيب الشباب، دقة ملوكية وحضور فخم غالي جداً.',
    footerHours: 'أوقات الهيبة والعمل',
    footerStudio: 'موقع الصالون الفخم',
    footerTech: 'تواصل وتكنولوجيا مريحة',
    monFri: 'من الاثنين للجمعة',
    saturdays: 'السبت',
    sundays: 'الأحد (راحتنا)',
    closed: 'مسكرين يا حبيبي',
    selectLang: 'اللغة الملوكية',
    adminPanel: 'دخول الحلاقين',
    createAccount: 'تسجيل زلمة جديد',
    bookingSystem: 'نظام حجز مرتب وسريع',
    reserveTitle: 'احجز موعد هيبتك هسّا',
    step1: '١. اختار الترتيب والخدمة',
    step2: '٢. الحلاق الفخم واليوم',
    step3: '٣. الساعة والوقت المتاح',
    step4: '٤. ثبت الحجز يا غالي',
    noHours: 'كل الساعات محجوزة اليوم، شوف يوم ثاني يا حبيبي.',
    tipBooking: '💡 معلومة ع السريع: الساعات المشطوبة يعني محجوزة لشباب ثانية، أو أوقات راحت ومضت بالسلامة اليوم.',
    chooseProfessional: 'اختار الحلاق الشاطر',
    chooseDate: 'اختار اليوم والترتيب',
    backToServices: '← رجوع للخدمات يا طيب',
    backToStep2: '← رجوع للخطوة السابقة',
    backToHours: '← رجوع للساعات المتاحة',
    notesLabel: 'توصية خاصة للحلاق (على ذوقك)',
    notesPlaceholder: 'مثال: حابب تدريج عالي، فنجان قهوة مرتب لما أوصل، تحديد موس حاد، إلخ...',
    finishReserve: 'ثبت موعدك الملوكي هسّا ✓',
    clientRegistered: 'عضو مسجل حبيبنا',
    autocompleted: 'البيانات جاهزة ومعبأة',
    guestMessage: 'مسجل معنا بالنادي من قبل؟',
    loginNow: 'سجل دخولك هسّا يا غالي',
    reserveSuccess: 'ألف مبروك! موعدك تثبت بنجاح',
    reserveSuccessDesc: 'موعدك الملوكي صار جاهز ومثبت بالنظام. بعتنالك رسالة إلكترونية فخمة بكل التفاصيل والترتيب.',
    cats: { Cortes: 'تضبيط شعر', Barba: 'لحية هيبة', Combos: 'كومبو فخم', Tratamientos: 'علاج ملوكي' },
    services: {
      s1: { name: 'قصة شعر فلسطينية ملوكية', desc: 'رسمة وتحديد للشعر ع الفرازة، غسيل مميز بشامبو روقان وسيشوار ملوكي وتعديل حواجب مجاني ع ذوقنا.' },
      s2: { name: 'طقوس لحية الهيبة', desc: 'ترتيب وتحديد لحيتك بالموس ع الحامي والبارد مع فوطة سخنة معطرة وزيوت ممتازة لتطلع بتلمع لمع.' },
      s3: { name: 'كومبو الزلم (شعر + لحية)', desc: 'الترتيب الملوكي الشامل. قصة فخمة على ذوقك + طقوس لحية مع فوطة سخنة وتقشير للوجه لتطلع هيبة الهيبات.' },
      s4: { name: 'تضبيط السنافر (تحت ١٢ سنة)', desc: 'دلال خاص وقصة مرتبة ع الموضة لجيل المستقبل ليكونوا دايمًا جاهزين ومكحلين.' },
      s5: { name: 'جلسة ديتوكس ملوكي للشعر', desc: 'تنظيف عميق وتغذية لفروة الرأس لترجع الحيوية لشعرك مع مساج ملوكي طيارة للرأس.' }
    }
  }
};

export default function App() {
  // --- IDIOMA SELECCIONADO ---
  const [lang, setLang] = useState('es');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  // --- FECHA Y HORA ACTUAL DE REFERENCIA (30 de mayo de 2026, 12:33 AM) ---
  const CURRENT_DATE_STR = '2026-05-30';
  const CURRENT_TIME_STR = '00:33';

  // --- ESTADO GLOBAL ---
  const [db, setDb] = useState(() => {
    const saved = localStorage.getItem(APP_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Si no tiene inicializado el pool dinámico de horas del sistema, se lo añadimos
        if (!parsed.availableHoursPool) {
          parsed.availableHoursPool = INITIAL_HOURS;
        }
        return parsed;
      } catch (e) { console.error(e); }
    }
    return {
      services: DEFAULT_SERVICES,
      barbers: DEFAULT_BARBERS,
      bookings: [
        { id: 'bk-1', serviceId: 's1', barberId: 'b1', date: '2026-06-01', time: '11:00', clientName: 'Carlos Santillana', clientPhone: '654321098', clientEmail: 'carlos@example.com', status: 'Confirmada', price: 25 },
        { id: 'bk-2', serviceId: 's3', barberId: 'b2', date: '2026-06-01', time: '16:00', clientName: 'Gael García', clientPhone: '699888777', clientEmail: 'gael@example.com', status: 'Pendiente', price: 38 }
      ],
      blockedDates: [
        { id: 'bl-1', date: '2026-06-02', barberId: 'b1', hour: null }, // Ahmed libre el 2 de Junio
        { id: 'bl-2', date: '2026-05-30', barberId: 'b2', hour: '11:00' } // Karim ocupado/bloqueado a las 11:00 hoy
      ],
      availableHoursPool: INITIAL_HOURS // Pool de horas que se puede configurar (quitar o poner)
    };
  });

  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(db));
  }, [db]);

  // --- CLIENTE AUTENTICADO SIMULADO ---
  const [activeUser, setActiveUser] = useState(() => {
    const savedUser = localStorage.getItem('barbero_palestino_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authName, setAuthName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');

  // --- ACCESO ADMIN POR USUARIO ---
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState('general'); // 'general' o ID de barbero
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [currentAdminProfile, setCurrentAdminProfile] = useState(null);

  // --- ESTADO DEL SISTEMA DE RESERVAS ---
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(CURRENT_DATE_STR);
  const [selectedTime, setSelectedTime] = useState('');
  
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestNotes, setGuestNotes] = useState('');
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  // --- ADMINISTRACIÓN EDITAR SERVICIO/HORARIOS ---
  const [editingService, setEditingService] = useState(null);
  const [adminSelectedBarberId, setAdminSelectedBarberId] = useState('b1');
  const [adminSelectedDate, setAdminSelectedDate] = useState(CURRENT_DATE_STR);
  
  // Nuevo estado para añadir hora personalizada a la plantilla del sistema
  const [newBaseHourInput, setNewBaseHourInput] = useState('');

  // --- FILTROS DE CLIENTE ---
  const [activeCategory, setActiveCategory] = useState('Todos');

  // --- TOAST NOTIFICACIÓN ---
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // --- TRADUCTOR DINÁMICO DE SERVICIOS ---
  const getTranslatedService = (srv) => {
    const sKey = srv.id;
    if (t.services && t.services[sKey]) {
      return {
        ...srv,
        name: t.services[sKey].name,
        desc: t.services[sKey].desc,
        category: t.cats[srv.category] || srv.category
      };
    }
    return srv;
  };

  // --- AUTENTICACIÓN ---
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (!authEmail || !authPhone || !authName) {
        setAuthError('Todos los campos son obligatorios.');
        return;
      }
      const newUser = { id: 'usr-' + Date.now(), name: authName, email: authEmail, phone: authPhone };
      localStorage.setItem('barbero_palestino_user', JSON.stringify(newUser));
      setActiveUser(newUser);
      triggerToast(lang === 'es' ? 'Cuenta creada con éxito. Bienvenido.' : 'Account created successfully.');
      setShowAuthModal(false);
      resetAuthForm();
    } else {
      if (!authEmail) {
        setAuthError('Ingresa tu email registrado.');
        return;
      }
      const fallbackUser = { id: 'usr-1', name: authEmail.split('@')[0], email: authEmail, phone: '600000000' };
      localStorage.setItem('barbero_palestino_user', JSON.stringify(fallbackUser));
      setActiveUser(fallbackUser);
      triggerToast('Sesión iniciada correctamente.');
      setShowAuthModal(false);
      resetAuthForm();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('barbero_palestino_user');
    setActiveUser(null);
    triggerToast('Sesión cerrada.');
  };

  const resetAuthForm = () => {
    setAuthEmail('');
    setAuthPhone('');
    setAuthName('');
    setAuthError('');
  };

  // --- PROCEDIMIENTO DE RESERVAS ---
  const openBookingWithService = (service) => {
    setSelectedService(service);
    setSelectedBarber(db.barbers[0]);
    setSelectedDate(CURRENT_DATE_STR);
    setBookingStep(2);
    setShowBookingModal(true);
  };

  const startBookingFromScratch = () => {
    setSelectedService(null);
    setSelectedBarber(null);
    setSelectedDate(CURRENT_DATE_STR);
    setSelectedTime('');
    setBookingStep(1);
    setShowBookingModal(true);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setBookingStep(2);
  };

  const handleSelectBarberAndDate = (barber, date) => {
    setSelectedBarber(barber);
    setSelectedDate(date);
    setBookingStep(3);
  };

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    if (activeUser) {
      setGuestName(activeUser.name);
      setGuestPhone(activeUser.phone);
      setGuestEmail(activeUser.email);
    }
    setBookingStep(4);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    const name = activeUser ? activeUser.name : guestName;
    const phone = activeUser ? activeUser.phone : guestPhone;
    const email = activeUser ? activeUser.email : guestEmail;

    if (!name || !phone || !email) {
      triggerToast('Por favor, completa los campos requeridos.');
      return;
    }

    // Comprobación horaria en tiempo real
    const hourStates = getHourStatesForDate(selectedDate, selectedBarber.id);
    const targetHourState = hourStates.find(h => h.hour === selectedTime);

    if (!targetHourState || targetHourState.isBusy || targetHourState.isPast || targetHourState.isBlocked) {
      triggerToast('Este horario ya no está disponible. Selecciona otro.');
      setBookingStep(3);
      return;
    }

    const newBooking = {
      id: 'bk-' + Date.now(),
      serviceId: selectedService.id,
      barberId: selectedBarber.id,
      date: selectedDate,
      time: selectedTime,
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
      notes: guestNotes,
      status: 'Confirmada',
      price: selectedService.price
    };

    setDb({
      ...db,
      bookings: [...db.bookings, newBooking]
    });

    setBookingSuccessData(newBooking);
    triggerToast('¡Cita agendada correctamente!');
    
    setGuestNotes('');
    if (!activeUser) {
      setGuestName('');
      setGuestPhone('');
      setGuestEmail('');
    }
  };

  const handleCancelBooking = (bookingId) => {
    const updated = db.bookings.map(b => {
      if (b.id === bookingId) return { ...b, status: 'Cancelada' };
      return b;
    });
    setDb({ ...db, bookings: updated });
    triggerToast('Cita cancelada con éxito.');
  };

  // --- ADMINISTRACIÓN ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin' || adminPassword === 'palestino2026') {
      setIsAdminMode(true);
      setShowAdminLogin(false);
      setAdminError('');
      setAdminPassword('');
      
      const profile = selectedAdminId === 'general' 
        ? { name: 'Administrador General', role: 'Control Total de la Marca' }
        : db.barbers.find(b => b.id === selectedAdminId);
        
      setCurrentAdminProfile(profile);
      triggerToast(`Dashboard cargado como: ${profile.name}`);
    } else {
      setAdminError('Contraseña incorrecta.');
    }
  };

  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    const updated = db.bookings.map(b => {
      if (b.id === bookingId) return { ...b, status: newStatus };
      return b;
    });
    setDb({ ...db, bookings: updated });
    triggerToast(`Estado cambiado: ${newStatus}`);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!editingService.name || !editingService.price) return;

    let updated;
    if (editingService.id) {
      updated = db.services.map(s => s.id === editingService.id ? editingService : s);
    } else {
      updated = [...db.services, { ...editingService, id: 's-' + Date.now() }];
    }
    setDb({ ...db, services: updated });
    setEditingService(null);
    triggerToast('Menú de servicios actualizado.');
  };

  const handleDeleteService = (serviceId) => {
    setDb({ ...db, services: db.services.filter(s => s.id !== serviceId) });
    triggerToast('Servicio eliminado.');
  };

  // Bloqueo y desbloqueo de Días y Horas por Barber
  const handleToggleDayBlock = (date, barberId) => {
    if (!date || !barberId) return;
    const exists = db.blockedDates.find(b => b.date === date && b.barberId === barberId && b.hour === null);
    
    if (exists) {
      setDb({ ...db, blockedDates: db.blockedDates.filter(b => b.id !== exists.id) });
      triggerToast('Día de descanso desbloqueado para este barbero.');
    } else {
      const newBlock = {
        id: 'bl-' + Date.now(),
        date,
        barberId,
        hour: null
      };
      setDb({ ...db, blockedDates: [...db.blockedDates, newBlock] });
      triggerToast('Día bloqueado para este barbero.');
    }
  };

  const handleToggleHourBlock = (date, barberId, hour) => {
    if (!date || !barberId || !hour) return;
    const exists = db.blockedDates.find(b => b.date === date && b.barberId === barberId && b.hour === hour);

    if (exists) {
      setDb({ ...db, blockedDates: db.blockedDates.filter(b => b.id !== exists.id) });
      triggerToast('Hora desbloqueada para este barbero.');
    } else {
      const newBlock = {
        id: 'bl-' + Date.now(),
        date,
        barberId,
        hour
      };
      setDb({ ...db, blockedDates: [...db.blockedDates, newBlock] });
      triggerToast('Hora bloqueada con éxito.');
    }
  };

  // --- GESTIÓN DE PLANTILLA DE HORARIOS DEL SISTEMA (AÑADIR/QUITAR HORAS BASE) ---
  const handleAddBaseHour = (e) => {
    e.preventDefault();
    if (!newBaseHourInput) return;
    
    const pool = db.availableHoursPool || INITIAL_HOURS;
    if (pool.includes(newBaseHourInput)) {
      triggerToast('Esta hora ya está en la plantilla.');
      return;
    }

    // Insertar y ordenar cronológicamente
    const updatedPool = [...pool, newBaseHourInput].sort((a, b) => {
      const [hA, mA] = a.split(':').map(Number);
      const [hB, mB] = b.split(':').map(Number);
      return (hA * 60 + mA) - (hB * 60 + mB);
    });

    setDb({
      ...db,
      availableHoursPool: updatedPool
    });
    setNewBaseHourInput('');
    triggerToast(`Hora ${newBaseHourInput} agregada a la plantilla del sistema.`);
  };

  const handleRemoveBaseHour = (hourToRemove) => {
    const pool = db.availableHoursPool || INITIAL_HOURS;
    if (pool.length <= 1) {
      triggerToast('Debe haber al menos una hora disponible en el sistema.');
      return;
    }

    const updatedPool = pool.filter(h => h !== hourToRemove);
    setDb({
      ...db,
      availableHoursPool: updatedPool
    });
    triggerToast(`Hora ${hourToRemove} eliminada de la plantilla del sistema.`);
  };

  // --- LÓGICAS DE TIEMPO COHERENTES ---
  const checkIfHourIsPassed = (dateStr, hourStr) => {
    if (!dateStr || !hourStr) return false;
    if (dateStr < CURRENT_DATE_STR) return true;
    
    if (dateStr === CURRENT_DATE_STR) {
      const [currH, currM] = CURRENT_TIME_STR.split(':').map(Number);
      const [targetH, targetM] = hourStr.split(':').map(Number);
      return (targetH * 60 + targetM) <= (currH * 60 + currM);
    }
    return false;
  };

  const getHourStatesForDate = (date, barberId) => {
    const isWholeDayBlocked = db.blockedDates.some(b => b.date === date && b.barberId === barberId && b.hour === null);
    const hoursPool = db.availableHoursPool || INITIAL_HOURS;
    
    return hoursPool.map(h => {
      const isPast = checkIfHourIsPassed(date, h);
      const isBusy = db.bookings.some(b => b.date === date && b.barberId === barberId && b.time === h && b.status !== 'Cancelada');
      const isBlocked = isWholeDayBlocked || db.blockedDates.some(b => b.date === date && b.barberId === barberId && b.hour === h);
      
      return { hour: h, isBusy, isPast, isBlocked };
    });
  };

  const getServiceById = (id) => db.services.find(s => s.id === id) || { name: 'Servicio', price: 0 };
  const getBarberById = (id) => db.barbers.find(b => b.id === id) || { name: 'Cualquier Barbero' };

  const userBookings = activeUser 
    ? db.bookings.filter(b => b.clientEmail.toLowerCase() === activeUser.email.toLowerCase())
    : [];

  const categoriesTranslated = ['Todos', 'Cortes', 'Barba', 'Combos', 'Tratamientos'];
  const filteredServices = activeCategory === 'Todos' 
    ? db.services 
    : db.services.filter(s => s.category === activeCategory);

  return (
    <div className={`min-h-screen bg-[#070707] text-[#F3F3F3] font-sans antialiased selection:bg-[#C5A880] selection:text-black relative overflow-x-hidden ${lang === 'ar' || lang === 'ps' ? 'text-right' : 'text-left'}`} style={{ direction: lang === 'ar' || lang === 'ps' ? 'rtl' : 'ltr' }}>
      
      {/* --- TOAST NOTIFICACIÓN --- */}
      {toastMessage && (
        <div className={`fixed bottom-6 ${lang === 'ar' || lang === 'ps' ? 'left-6' : 'right-6'} z-50 bg-[#141414] border-l-4 border-[#C5A880] text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 backdrop-blur-md max-w-sm`}>
          <svg className="w-5 h-5 text-[#C5A880] flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium tracking-wide mx-2">{toastMessage}</p>
        </div>
      )}

      {/* --- HEADER / NAVBAR --- */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-[#070707]/90 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setIsAdminMode(false); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <span className="text-xl md:text-2xl font-black tracking-widest text-white uppercase font-mono">
                PALESTINO<span className="text-[#C5A880]">.</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20 rounded text-[9px] uppercase tracking-widest font-bold">
                Elite Club
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8 font-mono text-xs tracking-widest uppercase gap-4">
              <a href="#concepto" className="hover:text-[#C5A880] transition-colors duration-200">{t.navConcept}</a>
              <a href="#servicios" className="hover:text-[#C5A880] transition-colors duration-200">{t.navMenu}</a>
              <a href="#galeria" className="hover:text-[#C5A880] transition-colors duration-200">{t.navGallery}</a>
              <a href="#resenas" className="hover:text-[#C5A880] transition-colors duration-200">{t.navOpinions}</a>
            </div>

            {/* Selector de Idiomas y CTAs */}
            <div className="flex items-center space-x-4 gap-2">
              
              {/* SELECTOR MULTILINGÜE */}
              <div className="relative inline-block text-left">
                <select 
                  value={lang} 
                  onChange={(e) => {
                    setLang(e.target.value);
                    triggerToast(`Language: ${e.target.value.toUpperCase()}`);
                  }}
                  className="bg-[#141414] hover:bg-[#1C1C1C] border border-white/10 text-white/90 text-[11px] font-mono rounded-full px-3 py-1.5 focus:outline-none focus:border-[#C5A880] cursor-pointer"
                >
                  <option value="es">ES</option>
                  <option value="en">EN</option>
                  <option value="ca">CA</option>
                  <option value="fr">FR</option>
                  <option value="ar">العربية (AR)</option>
                  <option value="ps">🇵🇸 Palestino</option>
                </select>
              </div>

              {activeUser ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 bg-[#141414] hover:bg-[#1C1C1C] border border-white/10 px-4 py-2 rounded-full text-xs tracking-wider transition-all duration-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mx-1"></span>
                    <span className="max-w-[100px] truncate text-white/90">{activeUser.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-[#0E0E0E] border border-white/10 rounded-xl shadow-2xl py-2 hidden group-hover:block transition-all duration-200 z-50">
                    <div className="px-4 py-2 border-b border-white/5 mb-1 text-left">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">{t.clientRegistered}</p>
                      <p className="text-xs font-semibold text-[#C5A880] truncate">{activeUser.email}</p>
                    </div>
                    <button 
                      onClick={() => setShowBookingModal(true)} 
                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#C5A880]/10 hover:text-[#C5A880] transition-colors font-mono uppercase tracking-wider"
                    >
                      {t.bookingSystem}
                    </button>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors font-mono uppercase tracking-wider"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => { setIsRegistering(false); setShowAuthModal(true); }}
                  className="hidden sm:inline-block text-xs font-mono uppercase tracking-widest text-white/60 hover:text-[#C5A880] transition-all"
                >
                  {t.clubAccess}
                </button>
              )}

              <button 
                onClick={startBookingFromScratch}
                className="bg-[#C5A880] hover:bg-[#B3966D] text-black font-mono font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-none shadow-lg transition-transform hover:-translate-y-0.5 duration-200"
              >
                {t.btnReserve}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* --- VISTA NORMAL LANDING PAGE --- */}
      {!isAdminMode ? (
        <>
          {/* --- HERO SECTION --- */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1920" 
                alt="" 
                className="w-full h-full object-cover opacity-35 scale-105 animate-slow-zoom" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-black/85"></div>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="relative z-10 text-center max-w-4xl px-4 mx-auto mt-12">
              <span className="text-[#C5A880] text-xs md:text-sm font-bold tracking-[0.3em] uppercase block mb-4 font-mono">
                {t.heroTag}
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight text-white mb-6 leading-none">
                {t.heroTitle}
              </h1>
              <p className="text-sm md:text-lg text-white/60 font-light max-w-2xl mx-auto mb-10 tracking-wide leading-relaxed">
                {t.heroDesc}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <button 
                  onClick={startBookingFromScratch}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-mono font-bold text-sm uppercase tracking-widest hover:bg-[#C5A880] transition-all duration-300 transform hover:-translate-y-1 shadow-2xl"
                >
                  {t.btnReserve}
                </button>
                <a 
                  href="#servicios"
                  className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white hover:border-[#C5A880] hover:text-[#C5A880] font-mono text-sm uppercase tracking-widest transition-all duration-300"
                >
                  {t.btnServices}
                </a>
              </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50">
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">Deslizar</span>
              <div className="w-1 h-12 bg-white/10 rounded-full relative overflow-hidden">
                <div className="w-full h-1/2 bg-[#C5A880] absolute top-0 left-0 animate-scroll-down"></div>
              </div>
            </div>
          </section>

          {/* --- SOBRE LA BARBERÍA / EL CONCEPTO --- */}
          <section id="concepto" className="py-24 relative overflow-hidden bg-[#070707] border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                <div className="relative group">
                  <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#C5A880]/30"></div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[#C5A880]/30"></div>
                  
                  <div className="relative overflow-hidden bg-[#141414] aspect-[4/5] rounded-none">
                    <img 
                      src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800" 
                      alt="" 
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-[#C5A880] font-mono text-xs uppercase tracking-widest mb-1">Ahmed & Team</p>
                      <h3 className="text-xl font-bold uppercase tracking-wide text-white">Barberos de Élite</h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#C5A880] bg-[#C5A880]/10 px-3 py-1.5 border border-[#C5A880]/20 rounded-md">
                    {t.conceptTag}
                  </span>
                  
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                    {t.conceptTitle}
                  </h2>
                  
                  <p className="text-white/75 font-light leading-relaxed font-mono text-sm">
                    {t.conceptDesc1}
                  </p>
                  
                  <p className="text-white/60 font-light leading-relaxed">
                    {t.conceptDesc2}
                  </p>

                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5 font-mono">
                    <div>
                      <h4 className="text-3xl font-black text-white">99%</h4>
                      <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{t.stat1}</p>
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-[#C5A880]">15+</h4>
                      <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{t.stat2}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* --- MENÚ DE SERVICIOS TRADUCIDOS --- */}
          <section id="servicios" className="py-24 relative bg-[#0A0A0A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-[#C5A880] text-xs font-mono tracking-widest uppercase block mb-3">{t.menuTag}</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">{t.menuTitle}</h2>
                <p className="text-white/40 text-sm font-light">{t.menuDesc}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categoriesTranslated.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-200 border ${
                      activeCategory === cat 
                        ? 'bg-[#C5A880] text-black border-[#C5A880] font-bold' 
                        : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {t.cats[cat] || cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredServices.map(srv => {
                  const item = getTranslatedService(srv);
                  return (
                    <div 
                      key={item.id} 
                      className="bg-[#111] hover:bg-[#151515] border border-white/5 hover:border-[#C5A880]/30 transition-all duration-300 p-8 flex flex-col justify-between group relative overflow-hidden text-left"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A880]/5 rounded-full blur-2xl group-hover:bg-[#C5A880]/10 transition-all"></div>
                      
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A880] bg-[#C5A880]/10 px-2 py-1 rounded">
                            {item.category}
                          </span>
                          <span className="text-2xl font-black text-[#C5A880] font-mono font-bold">
                            {item.price}€
                          </span>
                        </div>

                        <h3 className="text-xl font-bold uppercase text-white group-hover:text-[#C5A880] transition-colors duration-200 mb-2">
                          {item.name}
                        </h3>
                        
                        <p className="text-white/50 text-xs font-mono mb-4 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-[#C5A880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Duración: {item.duration}
                        </p>

                        <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
                          {item.desc}
                        </p>
                      </div>

                      <button 
                        onClick={() => openBookingWithService(srv)}
                        className="w-full text-center py-3 border border-white/10 hover:border-white text-white group-hover:bg-white group-hover:text-black transition-all duration-300 text-xs uppercase font-mono tracking-widest font-bold"
                      >
                        {t.btnReserve}
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>

          {/* --- GALERÍA --- */}
          <section id="galeria" className="py-24 bg-[#070707] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-6">
                <div>
                  <span className="text-[#C5A880] text-xs font-mono tracking-widest uppercase block mb-3">{t.galleryTag}</span>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">{t.galleryTitle}</h2>
                </div>
                <p className="text-white/40 max-w-md text-sm font-light">{t.galleryDesc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="relative group overflow-hidden aspect-[3/4]">
                  <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600" alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                    <p className="text-[#C5A880] font-mono text-[10px] tracking-widest uppercase">Skin Fade</p>
                    <h4 className="text-white font-bold uppercase tracking-wide">Degradado Milimétrico</h4>
                  </div>
                </div>

                <div className="relative group overflow-hidden aspect-[3/4]">
                  <img src="https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&q=80&w=600" alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                    <p className="text-[#C5A880] font-mono text-[10px] tracking-widest uppercase">Razor Beard</p>
                    <h4 className="text-white font-bold uppercase tracking-wide">Perfilado de Navaja</h4>
                  </div>
                </div>

                <div className="relative group overflow-hidden aspect-[3/4]">
                  <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=600" alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                    <p className="text-[#C5A880] font-mono text-[10px] tracking-widest uppercase">Premium Vibe</p>
                    <h4 className="text-white font-bold uppercase tracking-wide">Atmósfera Exclusiva</h4>
                  </div>
                </div>

                <div className="relative group overflow-hidden aspect-[3/4]">
                  <img src="https://images.unsplash.com/photo-1593702295094-aec22597af05?auto=format&fit=crop&q=80&w=600" alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                    <p className="text-[#C5A880] font-mono text-[10px] tracking-widest uppercase">Tratamiento</p>
                    <h4 className="text-white font-bold uppercase tracking-wide">Masaje Capilar Ritual</h4>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- RESEÑAS --- */}
          <section id="resenas" className="py-24 bg-[#0A0A0A] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <div className="flex justify-center items-center space-x-1 text-yellow-500 mb-4 text-lg">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  <span className="text-white font-mono text-sm ml-2">(4.9 / 5 en Booksy)</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">{t.reviewsTitle}</h2>
                <p className="text-white/40 text-sm font-light">{t.reviewsDesc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {REVIEWS_MOCK.map(review => (
                  <div key={review.id} className="bg-[#111] p-8 border border-white/5 rounded-xl flex flex-col justify-between text-left" style={{ direction: 'ltr' }}>
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-white font-bold tracking-wide">{review.name}</span>
                        <span className="text-white/30 text-xs font-mono">{review.date}</span>
                      </div>
                      <div className="flex text-yellow-500 mb-4">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <p className="text-white/70 font-light text-sm leading-relaxed">
                        "{review.text}"
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A880]">Cliente de Elite</span>
                      <span className="text-xs text-white/20 font-bold">Verificado</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <a 
                  href="https://booksy.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#C5A880] hover:text-white transition-colors"
                >
                  <span>Ver todas las valoraciones reales en Booksy</span>
                  <span className="mx-1">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* --- CTA FINAL --- */}
          <section className="relative py-32 bg-[#070707] overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1521449621644-40fe2af0f8d1?auto=format&fit=crop&q=80&w=1500" 
                alt="" 
                className="w-full h-full object-cover opacity-20 scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <span className="text-[#C5A880] text-xs font-mono tracking-[0.2em] uppercase block mb-3">{t.ctaTag}</span>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
                  {t.ctaTitle}
                </h2>
                <p className="text-white/60 text-base font-light mb-10 max-w-lg">
                  {t.ctaDesc}
                </p>
                <button 
                  onClick={startBookingFromScratch}
                  className="px-10 py-5 bg-[#C5A880] hover:bg-white hover:text-black text-black font-mono font-bold text-sm uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-2xl"
                >
                  {t.btnReserve}
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* --- MODO ADMINISTRACIÓN (DASHBOARD) --- */
        <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ direction: 'ltr' }}>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-10 text-left">
            <div>
              <span className="text-[#C5A880] text-xs font-mono tracking-widest uppercase">ZONA PRIVADA · CONECTADO COMO {currentAdminProfile?.name.toUpperCase()}</span>
              <h1 className="text-3xl md:text-5xl font-black uppercase text-white mt-2">DASHBOARD BARBERO</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs rounded-full flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Sincronizado / Live
              </span>
              <button 
                onClick={() => { setIsAdminMode(false); setCurrentAdminProfile(null); }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider rounded border border-white/10 transition-colors"
              >
                Cerrar Sesión Admin
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 font-mono text-left">
            <div className="bg-[#111] border border-white/5 p-6 rounded-xl">
              <p className="text-xs text-white/40 uppercase tracking-wider">Citas Totales</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {selectedAdminId === 'general' 
                  ? db.bookings.length 
                  : db.bookings.filter(b => b.barberId === selectedAdminId).length}
              </h3>
              <p className="text-[10px] text-white/30 mt-1">Registradas en tu perfil</p>
            </div>
            <div className="bg-[#111] border border-white/5 p-6 rounded-xl">
              <p className="text-xs text-white/40 uppercase tracking-wider">Facturación Estimada</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-2">
                {db.bookings.reduce((acc, curr) => {
                  if (selectedAdminId !== 'general' && curr.barberId !== selectedAdminId) return acc;
                  return curr.status === 'Confirmada' || curr.status === 'Finalizada' ? acc + curr.price : acc;
                }, 0)}€
              </h3>
              <p className="text-[10px] text-white/30 mt-1">Suma de citas activas</p>
            </div>
            <div className="bg-[#111] border border-white/5 p-6 rounded-xl">
              <p className="text-xs text-white/40 uppercase tracking-wider">Servicios en Menú</p>
              <h3 className="text-3xl font-black text-[#C5A880] mt-2">{db.services.length}</h3>
              <p className="text-[10px] text-white/30 mt-1">Gestionables online</p>
            </div>
            <div className="bg-[#111] border border-white/5 p-6 rounded-xl">
              <p className="text-xs text-white/40 uppercase tracking-wider">Tu Perfil Activo</p>
              <h3 className="text-lg font-black text-white mt-2 truncate">{currentAdminProfile?.name}</h3>
              <p className="text-[10px] text-white/30 mt-1">{currentAdminProfile?.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Listado de Citas */}
            <div className="lg:col-span-2 space-y-6 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold uppercase tracking-wider text-white">Próximas Reservas Recibidas</h2>
              </div>

              <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 bg-white/5 font-mono text-xs uppercase tracking-wider grid grid-cols-12 gap-2 text-white/50 border-b border-white/10">
                  <div className="col-span-4">Cliente</div>
                  <div className="col-span-3">Servicio</div>
                  <div className="col-span-3">Fecha y Hora</div>
                  <div className="col-span-2 text-right">Estatus</div>
                </div>

                <div className="divide-y divide-white/5">
                  {db.bookings.filter(b => selectedAdminId === 'general' || b.barberId === selectedAdminId).length === 0 ? (
                    <p className="p-8 text-center text-white/40 text-sm font-light">No tienes citas registradas en tu calendario.</p>
                  ) : (
                    db.bookings
                      .filter(b => selectedAdminId === 'general' || b.barberId === selectedAdminId)
                      .slice()
                      .reverse()
                      .map(booking => {
                        const srv = getServiceById(booking.serviceId);
                        const bbr = getBarberById(booking.barberId);
                        return (
                          <div key={booking.id} className="p-5 grid grid-cols-12 gap-2 items-center hover:bg-white/[0.02] transition-colors">
                            <div className="col-span-4 text-left">
                              <h4 className="font-bold text-white text-sm">{booking.clientName}</h4>
                              <p className="text-xs text-white/40 mt-1">{booking.clientPhone}</p>
                              <p className="text-[11px] text-[#C5A880]/70 truncate">{booking.clientEmail}</p>
                            </div>

                            <div className="col-span-3 text-left">
                              <span className="text-xs font-semibold text-white/90 block truncate">{srv.name}</span>
                              <span className="text-[10px] text-white/40 font-mono block mt-0.5">{bbr.name}</span>
                              <span className="text-xs font-mono text-[#C5A880] mt-1 block">{booking.price}€</span>
                            </div>

                            <div className="col-span-3 font-mono text-left">
                              <span className="text-xs text-white block">{booking.date}</span>
                              <span className="text-xs font-bold text-[#C5A880] bg-[#C5A880]/10 px-1.5 py-0.5 rounded block w-fit mt-1">
                                {booking.time}
                              </span>
                            </div>

                            <div className="col-span-2 text-right">
                              <select 
                                value={booking.status}
                                onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                                className={`text-[10px] uppercase font-mono px-2 py-1 rounded font-bold border cursor-pointer focus:outline-none bg-black`}
                              >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Confirmada">Confirmada</option>
                                <option value="Finalizada">Finalizada</option>
                                <option value="Cancelada">Cancelada</option>
                              </select>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>

            {/* SECCIÓN GESTIÓN DE DISPONIBILIDAD DIAS/HORAS + ADMINISTRAR PLANTILLA DE HORARIOS BASE */}
            <div className="space-y-8 text-left">
              
              {/* Bloqueador de Días y Horas por Barbero */}
              <div className="bg-[#111] border border-white/5 rounded-xl p-6">
                <h3 className="text-base font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C5A880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Gestión de Disponibilidad
                </h3>
                
                <div className="space-y-4 font-sans">
                  {/* Selector de barbero a configurar */}
                  <div>
                    <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono">Barbero a Configurar</label>
                    <select 
                      value={adminSelectedBarberId}
                      onChange={(e) => setAdminSelectedBarberId(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#C5A880]"
                    >
                      {db.barbers.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Selector de Fecha */}
                  <div>
                    <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono">Día Seleccionado</label>
                    <input 
                      type="date"
                      min={CURRENT_DATE_STR}
                      value={adminSelectedDate}
                      onChange={(e) => setAdminSelectedDate(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  {/* Acciones para el día completo */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleToggleDayBlock(adminSelectedDate, adminSelectedBarberId)}
                      className="w-full text-center py-2.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 text-xs font-mono font-bold uppercase tracking-wider"
                    >
                      {db.blockedDates.some(b => b.date === adminSelectedDate && b.barberId === adminSelectedBarberId && b.hour === null)
                        ? '🔓 Desbloquear Día Completo'
                        : '🔒 Bloquear Día Completo (Descanso)'}
                    </button>
                  </div>

                  {/* Bloqueador de Horas específicas */}
                  <div className="border-t border-white/5 pt-4">
                    <label className="block text-[10px] uppercase text-white/40 mb-2 font-mono">Bloquear Horas de la Jornada</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(db.availableHoursPool || INITIAL_HOURS).map(h => {
                        const isBlocked = db.blockedDates.some(b => b.date === adminSelectedDate && b.barberId === adminSelectedBarberId && (b.hour === h || b.hour === null));
                        return (
                          <button
                            key={h}
                            onClick={() => handleToggleHourBlock(adminSelectedDate, adminSelectedBarberId, h)}
                            className={`p-2 text-center text-xs font-mono rounded border transition-all ${
                              isBlocked
                                ? 'bg-red-500/10 border-red-500/30 text-red-400 line-through'
                                : 'bg-black border-white/10 text-white hover:border-[#C5A880]'
                            }`}
                          >
                            {h}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[10px] text-white/30 block mt-2">Haz clic sobre un bloque para añadir descansos o bloquear horas para este día.</span>
                  </div>
                </div>
              </div>

              {/* === NUEVA SECCIÓN: CONFIGURACIÓN / EDICIÓN DE LA PLANTILLA GENERAL DE HORAS DEL SISTEMA === */}
              <div className="bg-[#111] border border-white/5 rounded-xl p-6 font-sans">
                <h3 className="text-base font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C5A880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Configuración del Horario Base
                </h3>
                <p className="text-xs text-white/50 mb-4">
                  Añade o quita horas globales del sistema. Estas horas se aplicarán como base para las reservas de todos los días.
                </p>

                {/* Formulario para agregar una hora base */}
                <form onSubmit={handleAddBaseHour} className="flex gap-2 mb-4">
                  <input 
                    type="time" 
                    required
                    value={newBaseHourInput}
                    onChange={(e) => setNewBaseHourInput(e.target.value)}
                    className="bg-black border border-white/10 rounded px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#C5A880] flex-1"
                  />
                  <button 
                    type="submit"
                    className="bg-[#C5A880] hover:bg-white text-black font-bold font-mono text-xs px-4 py-2 rounded transition-colors"
                  >
                    + Añadir
                  </button>
                </form>

                {/* Listado de horas con opción de eliminar/quitar */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-2">Plantilla Horaria Activa:</p>
                  <div className="flex flex-wrap gap-2">
                    {(db.availableHoursPool || INITIAL_HOURS).map(h => (
                      <span 
                        key={h} 
                        className="inline-flex items-center gap-2 text-xs font-mono bg-white/5 text-white/90 border border-white/10 px-3 py-1.5 rounded-full"
                      >
                        {h}
                        <button 
                          type="button"
                          onClick={() => handleRemoveBaseHour(h)} 
                          className="text-red-400 hover:text-red-200 font-bold text-sm focus:outline-none transition-colors"
                          title="Eliminar hora del sistema"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gestión de Servicios */}
              <div className="bg-[#111] border border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold uppercase tracking-wider text-white">Menú de Servicios</h3>
                  <button 
                    onClick={() => setEditingService({ name: '', duration: '30 min', price: 20, category: 'Cortes', desc: '' })}
                    className="text-xs text-[#C5A880] hover:text-white font-mono font-bold uppercase tracking-wider"
                  >
                    + Añadir Nuevo
                  </button>
                </div>

                {editingService && (
                  <form onSubmit={handleSaveService} className="bg-black/40 border border-[#C5A880]/30 p-4 rounded-lg mb-6 space-y-3">
                    <p className="text-[10px] text-[#C5A880] font-mono uppercase tracking-widest font-bold">
                      {editingService.id ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}
                    </p>
                    
                    <div>
                      <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono">Nombre del Servicio *</label>
                      <input 
                        type="text" 
                        required
                        value={editingService.name} 
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        className="w-full bg-black border border-white/10 px-3 py-1.5 text-xs text-white rounded outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono">Precio (€) *</label>
                        <input 
                          type="number" 
                          required
                          value={editingService.price} 
                          onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                          className="w-full bg-black border border-white/10 px-3 py-1.5 text-xs text-white rounded outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono">Duración</label>
                        <input 
                          type="text" 
                          value={editingService.duration} 
                          onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                          className="w-full bg-black border border-white/10 px-3 py-1.5 text-xs text-white rounded outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono">Categoría</label>
                      <select 
                        value={editingService.category} 
                        onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                        className="w-full bg-black border border-white/10 px-3 py-1.5 text-xs text-white rounded outline-none"
                      >
                        <option value="Cortes">Cortes</option>
                        <option value="Barba">Barba</option>
                        <option value="Combos">Combos</option>
                        <option value="Tratamientos">Tratamientos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono">Descripción</label>
                      <textarea 
                        value={editingService.desc} 
                        onChange={(e) => setEditingService({ ...editingService, desc: e.target.value })}
                        rows="2"
                        className="w-full bg-black border border-white/10 px-3 py-1.5 text-xs text-white rounded outline-none"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setEditingService(null)} 
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs rounded font-mono uppercase"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="px-3 py-1.5 bg-[#C5A880] text-black text-xs font-bold rounded font-mono uppercase"
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {db.services.map(s => (
                    <div key={s.id} className="p-3 bg-black border border-white/5 rounded flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-white block">{s.name}</span>
                        <span className="text-[10px] text-[#C5A880] font-mono">{s.price}€ · {s.duration}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingService(s)}
                          className="text-xs text-white/50 hover:text-white"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteService(s.id)}
                          className="text-xs text-red-500 hover:text-red-400"
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-[#030303] border-t border-white/10 text-white/40 text-xs py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="space-y-4 text-left">
              <span className="text-xl font-black text-white tracking-widest block">PALESTINO<span className="text-[#C5A880]">.</span></span>
              <p className="font-light leading-relaxed max-w-xs">
                {t.footerDesc}
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="#instagram" className="hover:text-[#C5A880] transition-colors">Instagram</a>
                <a href="#tiktok" className="hover:text-[#C5A880] transition-colors">TikTok</a>
                <a href="#facebook" className="hover:text-[#C5A880] transition-colors">Facebook</a>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <h4 className="font-mono text-xs uppercase tracking-widest text-white font-bold">{t.footerHours}</h4>
              <ul className="space-y-2 font-mono text-[11px]">
                <li className="flex justify-between"><span>{t.monFri}</span> <span>09:00 - 21:00</span></li>
                <li className="flex justify-between"><span>{t.saturdays}</span> <span>09:00 - 18:00</span></li>
                <li className="flex justify-between text-[#C5A880]"><span>{t.sundays}</span> <span className="uppercase font-bold">{t.closed}</span></li>
              </ul>
            </div>

            <div className="space-y-4 text-left">
              <h4 className="font-mono text-xs uppercase tracking-widest text-white font-bold">{t.footerStudio}</h4>
              <p className="font-light leading-relaxed">
                Carrer de Provença, 238<br />
                08008 Barcelona, España
              </p>
              <p className="font-mono text-[11px] text-[#C5A880]">
                Tel: +34 931 234 567<br />
                Email: club@barberopalestino.com
              </p>
            </div>

            <div className="space-y-4 text-left">
              <h4 className="font-mono text-xs uppercase tracking-widest text-white font-bold">{t.footerTech}</h4>
              <ul className="space-y-2 font-mono text-[11px]">
                <li><button onClick={() => setShowAdminLogin(true)} className="hover:text-[#C5A880] text-left">{t.adminPanel}</button></li>
                <li><a href="https://booksy.com" target="_blank" rel="noreferrer" className="hover:text-[#C5A880]">Booksy Directo</a></li>
                <li><button onClick={() => { setIsRegistering(true); setShowAuthModal(true); }} className="hover:text-[#C5A880] text-left">{t.createAccount}</button></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
            <p>© 2026 Barbero Palestino Elite Club. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <a href="#privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</a>
              <a href="#cookies" className="hover:text-white transition-colors">Política de Cookies</a>
            </div>
          </div>

        </div>
      </footer>


      {/* === MODAL DE AUTENTICACIÓN CLIENTE === */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ direction: 'ltr' }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
          
          <div className="relative bg-[#0F0F0F] border border-white/10 w-full max-w-md rounded-2xl p-8 shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A880]/5 rounded-full blur-2xl"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[#C5A880] text-[10px] font-mono tracking-widest uppercase block mb-1">MEMBRESÍA CLUB</span>
                <h3 className="text-2xl font-black uppercase text-white">
                  {isRegistering ? 'Crear tu Cuenta' : 'Acceso Directo'}
                </h3>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="text-white/40 hover:text-white text-xl">×</button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg font-mono">
                  {authError}
                </div>
              )}

              {isRegistering && (
                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1 font-mono tracking-wider">Nombre Completo</label>
                  <input 
                    type="text" 
                    required 
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#C5A880]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase text-white/50 mb-1 font-mono tracking-wider">Correo Electrónico</label>
                <input 
                  type="email" 
                  required 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#C5A880]"
                />
              </div>

              {isRegistering && (
                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1 font-mono tracking-wider">Teléfono de Contacto</label>
                  <input 
                    type="tel" 
                    required 
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="Ej. +34 600 000 000"
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#C5A880]"
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-[#C5A880] hover:bg-white hover:text-black text-black font-mono font-bold py-3.5 rounded-lg text-xs uppercase tracking-widest transition-all duration-200 mt-2"
              >
                {isRegistering ? 'Confirmar Registro' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs">
              {isRegistering ? (
                <p className="text-white/40">
                  ¿Ya eres miembro?{' '}
                  <button onClick={() => { setIsRegistering(false); setAuthError(''); }} className="text-[#C5A880] hover:underline font-bold">
                    Inicia sesión aquí
                  </button>
                </p>
              ) : (
                <p className="text-white/40">
                  ¿Aún no tienes cuenta?{' '}
                  <button onClick={() => { setIsRegistering(true); setAuthError(''); }} className="text-[#C5A880] hover:underline font-bold">
                    Crea tu cuenta de socio
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>
      )}


      {/* === MODAL ACCESO ADMIN POR USUARIO === */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ direction: 'ltr' }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAdminLogin(false)}></div>
          
          <div className="relative bg-[#0F0F0F] border border-white/10 w-full max-w-md rounded-2xl p-8 shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-red-400 text-[10px] font-mono tracking-widest uppercase block mb-1 font-bold">PORTAL DE CONTROL</span>
                <h3 className="text-xl font-black uppercase text-white">Ingreso de Personal</h3>
              </div>
              <button onClick={() => setShowAdminLogin(false)} className="text-white/40 hover:text-white text-xl">×</button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              {adminError && (
                <p className="text-xs text-red-400 font-mono bg-red-500/10 p-2 rounded border border-red-500/20">{adminError}</p>
              )}
              
              {/* Selector de Usuario para Login */}
              <div>
                <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono tracking-wider">Elige tu Perfil</label>
                <select 
                  value={selectedAdminId}
                  onChange={(e) => setSelectedAdminId(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#C5A880] cursor-pointer"
                >
                  <option value="general">Administrador General</option>
                  {db.barbers.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono tracking-wider">Contraseña de Seguridad</label>
                <input 
                  type="password" 
                  required 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Introduce contraseña..."
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white outline-none focus:border-[#C5A880] font-mono"
                />
                <span className="text-[10px] text-white/30 block mt-1 font-mono">Demo: palestino2026 o admin</span>
              </div>

              <button 
                type="submit"
                className="w-full bg-white hover:bg-[#C5A880] text-black font-mono font-bold py-3.5 rounded text-xs uppercase tracking-widest transition-colors mt-2"
              >
                Cargar Dashboard Administrativo
              </button>
            </form>
          </div>
        </div>
      )}


      {/* === MODAL COMPLETO DE RESERVA COHERENTE === */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ direction: 'ltr' }}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => { if (!bookingSuccessData) setShowBookingModal(false); }}></div>
          
          <div className="relative bg-[#0D0D0D] border border-white/10 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-8 animate-scale-up text-left">
            
            <div className="p-6 md:p-8 bg-white/5 border-b border-white/5 flex justify-between items-center">
              <div>
                <span className="text-[#C5A880] text-[10px] font-mono tracking-[0.2em] uppercase block mb-1">{t.bookingSystem}</span>
                <h2 className="text-xl md:text-2xl font-black uppercase text-white">{t.reserveTitle}</h2>
              </div>
              <button 
                onClick={() => {
                  setShowBookingModal(false);
                  setBookingSuccessData(null);
                  setBookingStep(1);
                }} 
                className="text-white/40 hover:text-white text-2xl transition-colors font-light"
              >
                ✕
              </button>
            </div>

            {!bookingSuccessData && (
              <div className="flex bg-white/[0.02] border-b border-white/5 text-[10px] md:text-xs font-mono tracking-wider uppercase text-center">
                <div className={`flex-1 py-3 border-r border-white/5 ${bookingStep === 1 ? 'text-[#C5A880] font-bold bg-white/[0.02]' : 'text-white/40'}`}>{t.step1}</div>
                <div className={`flex-1 py-3 border-r border-white/5 ${bookingStep === 2 ? 'text-[#C5A880] font-bold bg-white/[0.02]' : 'text-white/40'}`}>{t.step2}</div>
                <div className={`flex-1 py-3 border-r border-white/5 ${bookingStep === 3 ? 'text-[#C5A880] font-bold bg-white/[0.02]' : 'text-white/40'}`}>{t.step3}</div>
                <div className={`flex-1 py-3 ${bookingStep === 4 ? 'text-[#C5A880] font-bold bg-white/[0.02]' : 'text-white/40'}`}>{t.step4}</div>
              </div>
            )}

            <div className="p-6 md:p-8">
              
              {bookingSuccessData ? (
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-500 text-3xl animate-bounce">
                    ✓
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase text-white">{t.reserveSuccess}</h3>
                    <p className="text-white/60 text-sm max-w-md mx-auto">{t.reserveSuccessDesc}</p>
                  </div>

                  <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-xl p-6 text-left font-mono space-y-3 text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Código:</span>
                      <span className="text-white font-bold">{bookingSuccessData.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Servicio:</span>
                      <span className="text-[#C5A880] font-bold">{getServiceById(bookingSuccessData.serviceId).name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Barbero:</span>
                      <span className="text-white">{getBarberById(bookingSuccessData.barberId).name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Fecha & Hora:</span>
                      <span className="text-[#C5A880] font-bold">{bookingSuccessData.date} - {bookingSuccessData.time} h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Importe:</span>
                      <span className="text-emerald-400 font-bold text-sm">{bookingSuccessData.price}€</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <button 
                      onClick={() => {
                        setBookingSuccessData(null);
                        setShowBookingModal(false);
                        setBookingStep(1);
                      }}
                      className="px-6 py-3 bg-[#C5A880] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
                    >
                      Entendido / Confirmado
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* PASO 1 */}
                  {bookingStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-xs text-white/50 mb-4">Selecciona el tratamiento o ritual que deseas reservar:</p>
                      <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {db.services.map(s => {
                          const item = getTranslatedService(s);
                          return (
                            <div 
                              key={item.id}
                              onClick={() => handleSelectService(s)}
                              className="bg-white/[0.03] hover:bg-[#C5A880]/10 border border-white/10 hover:border-[#C5A880]/50 p-4 rounded-xl flex justify-between items-center cursor-pointer transition-all duration-200 group"
                            >
                              <div className="pr-4 text-left">
                                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A880] bg-[#C5A880]/10 px-2 py-0.5 rounded">
                                  {item.category}
                                </span>
                                <h4 className="font-bold text-white text-sm group-hover:text-[#C5A880] transition-colors mt-2">{item.name}</h4>
                                <p className="text-xs text-white/50 font-mono mt-1">Duración: {item.duration}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="text-lg font-black font-mono text-[#C5A880]">{item.price}€</span>
                                <span className="block text-[10px] uppercase tracking-widest font-mono text-white/30 mt-1">Seleccionar →</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PASO 2 */}
                  {bookingStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => setBookingStep(1)} 
                          className="text-xs text-[#C5A880] font-mono uppercase tracking-widest hover:underline"
                        >
                          {t.backToServices}
                        </button>
                        <span className="text-xs text-white/40 font-mono">
                          Servicio: <strong className="text-white">{getTranslatedService(selectedService)?.name}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Selector de Profesionales */}
                        <div className="text-left">
                          <label className="block text-xs uppercase text-white/50 mb-3 font-mono tracking-wider">{t.chooseProfessional}</label>
                          <div className="space-y-2">
                            {db.barbers.map(b => (
                              <div
                                key={b.id}
                                onClick={() => setSelectedBarber(b)}
                                className={`flex items-center space-x-4 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                                  selectedBarber?.id === b.id 
                                    ? 'bg-[#C5A880]/10 border-[#C5A880]' 
                                    : 'bg-white/[0.02] border-white/10 hover:border-white/30'
                                }`}
                              >
                                <img src={b.avatar} alt={b.name} className="w-12 h-12 rounded-full object-cover border border-[#C5A880]/30" />
                                <div className="text-left">
                                  <h4 className="font-bold text-white text-sm">{b.name}</h4>
                                  <p className="text-xs text-white/40">{b.role}</p>
                                  <span className="text-[10px] text-yellow-500 font-mono">★ {b.rating} Valoración</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Selector de Fecha */}
                        <div className="text-left">
                          <label className="block text-xs uppercase text-white/50 mb-3 font-mono tracking-wider">{t.chooseDate}</label>
                          <input 
                            type="date"
                            min={CURRENT_DATE_STR} // IMPIDE SELECCIONAR DÍAS EN EL PASADO
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C5A880] font-mono"
                          />
                        </div>
                      </div>

                      <div className="text-right pt-4 border-t border-white/5">
                        <button
                          disabled={!selectedBarber || !selectedDate}
                          onClick={() => handleSelectBarberAndDate(selectedBarber, selectedDate)}
                          className="disabled:opacity-40 disabled:cursor-not-allowed bg-[#C5A880] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest px-6 py-3 transition-colors"
                        >
                          Siguiente: Elegir Hora →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PASO 3 */}
                  {bookingStep === 3 && (
                    <div className="space-y-6 text-left">
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => setBookingStep(2)} 
                          className="text-xs text-[#C5A880] font-mono uppercase tracking-widest hover:underline"
                        >
                          {t.backToStep2}
                        </button>
                        <span className="text-xs text-white/40 font-mono">
                          Día: <strong className="text-[#C5A880]">{selectedDate}</strong> con <strong className="text-white">{selectedBarber?.name}</strong>
                        </span>
                      </div>

                      <p className="text-xs text-white/50">
                        Horas del barbero para la fecha seleccionada:
                      </p>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {getHourStatesForDate(selectedDate, selectedBarber?.id).map(({ hour, isBusy, isPast, isBlocked }) => {
                          const isUnavailable = isBusy || isPast || isBlocked;
                          return (
                            <button
                              key={hour}
                              disabled={isUnavailable}
                              onClick={() => handleSelectTime(hour)}
                              className={`p-3 text-center text-xs font-mono font-bold rounded border transition-all ${
                                isUnavailable
                                  ? 'bg-[#141414]/40 border-dashed border-white/10 text-white/20 line-through cursor-not-allowed relative group'
                                  : 'bg-white/[0.03] hover:bg-[#C5A880] border-white/10 hover:border-[#C5A880] text-white hover:text-black'
                              }`}
                            >
                              {hour}
                              {isUnavailable && (
                                <span className="absolute inset-x-0 -bottom-1 text-[8px] tracking-tighter text-red-500/60 font-mono scale-90 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {isBusy ? 'OCUPADA' : isBlocked ? 'DESCANSO' : 'PASADA'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white/40 font-mono text-left">
                        {t.tipBooking}
                      </div>
                    </div>
                  )}

                  {/* PASO 4 */}
                  {bookingStep === 4 && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => setBookingStep(3)} 
                          className="text-xs text-[#C5A880] font-mono uppercase tracking-widest hover:underline"
                        >
                          {t.backToHours}
                        </button>
                        <span className="text-xs text-white/40 font-mono">
                          Hora elegida: <strong className="text-[#C5A880]">{selectedTime} h</strong>
                        </span>
                      </div>

                      <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-left">
                        <div>
                          <p className="text-[10px] text-[#C5A880] uppercase font-mono tracking-widest">Resumen del Ritual:</p>
                          <h4 className="font-bold text-white text-base mt-1">{getTranslatedService(selectedService)?.name}</h4>
                          <p className="text-xs text-white/50 mt-1">Con {selectedBarber?.name} el {selectedDate} a las {selectedTime} h</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-2xl font-black text-[#C5A880] font-mono">{selectedService?.price}€</p>
                          <p className="text-[10px] text-white/30 font-mono uppercase mt-0.5">IVA e Impuestos incluidos</p>
                        </div>
                      </div>

                      <form onSubmit={handleConfirmBooking} className="space-y-4 text-left">
                        {activeUser ? (
                          <div className="p-3.5 bg-[#C5A880]/10 border border-[#C5A880]/20 rounded-lg text-xs flex justify-between items-center">
                            <span className="text-white/80">Sesión iniciada como: <strong className="text-white">{activeUser.name}</strong></span>
                            <span className="text-[#C5A880] text-[10px] font-mono uppercase font-bold">{t.autocompleted}</span>
                          </div>
                        ) : (
                          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs flex justify-between items-center">
                            <span className="text-white/50">{t.guestMessage}</span>
                            <button 
                              type="button"
                              onClick={() => { setShowAuthModal(true); setIsRegistering(false); }}
                              className="text-[#C5A880] hover:underline font-mono uppercase text-[10px] font-bold"
                            >
                              {t.loginNow}
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono">Nombre Completo *</label>
                            <input 
                              type="text" 
                              required
                              disabled={!!activeUser}
                              value={activeUser ? activeUser.name : guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="Ej. Carlos Santillana"
                              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880] disabled:opacity-65 text-left"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono">Teléfono Móvil *</label>
                            <input 
                              type="tel" 
                              required
                              disabled={!!activeUser}
                              value={activeUser ? activeUser.phone : guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value)}
                              placeholder="Ej. +34 654 321 098"
                              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880] disabled:opacity-65 text-left"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono">Email *</label>
                            <input 
                              type="email" 
                              required
                              disabled={!!activeUser}
                              value={activeUser ? activeUser.email : guestEmail}
                              onChange={(e) => setGuestEmail(e.target.value)}
                              placeholder="ejemplo@correo.com"
                              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880] disabled:opacity-65 text-left"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-white/40 mb-1 font-mono">{t.notesLabel}</label>
                          <textarea 
                            value={guestNotes}
                            onChange={(e) => setGuestNotes(e.target.value)}
                            placeholder={t.notesPlaceholder}
                            rows="2"
                            className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880] text-left"
                          ></textarea>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <p className="text-[10px] text-white/30 max-w-sm text-left">
                            Al hacer clic en reservar, aceptas nuestras políticas de cancelación. Podrás modificar o cancelar tu cita hasta 24 horas antes sin coste alguno.
                          </p>
                          <button
                            type="submit"
                            className="w-full sm:w-auto bg-[#C5A880] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 transition-colors shadow-xl"
                          >
                            {t.finishReserve}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}

            </div>

            {activeUser && bookingStep === 1 && !bookingSuccessData && (
              <div className="p-6 md:p-8 bg-white/[0.01] border-t border-white/5 text-left">
                <h4 className="text-xs uppercase font-mono tracking-widest text-white font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Tu Historial de Reservas en Barbero Palestino
                </h4>
                
                {userBookings.length === 0 ? (
                  <p className="text-xs text-white/40 italic">No tienes citas anteriores o pendientes registradas con esta cuenta.</p>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {userBookings.map(b => {
                      const s = getServiceById(b.serviceId);
                      return (
                        <div key={b.id} className="p-3 bg-black border border-white/5 rounded-lg flex justify-between items-center text-xs font-mono">
                          <div>
                            <span className="text-white block font-bold">{getTranslatedService(s).name}</span>
                            <span className="text-white/40 text-[11px] block mt-0.5">{b.date} - {b.time} h · Barbero: {getBarberById(b.barberId).name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                              b.status === 'Confirmada' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              b.status === 'Pendiente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              b.status === 'Cancelada' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              'bg-white/10 text-white/40 border-white/20'
                            }`}>
                              {b.status}
                            </span>
                            {b.status !== 'Cancelada' && b.status !== 'Finalizada' && (
                              <button 
                                onClick={() => handleCancelBooking(b.id)}
                                className="text-red-400 hover:text-red-300 font-bold text-xs"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}