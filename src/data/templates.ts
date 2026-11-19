import type { AdventureTemplate } from "./legacy-templates";
import { legacyTemplates } from "./legacy-templates";
export type { AdventureTemplate } from "./legacy-templates";
export const templates: AdventureTemplate[] = [
  {
    id: "neighbor",
    title: "Prohibido besar al vecino",
    role: "Arquitecto",
    person: "Daniel Vidal",
    setting:
      "Edificio urbano de la localidad elegida; ningún detalle local técnico es imprescindible.",
    hook: "Has decidido reservarte un rato al día. Entonces llega Daniel, el vecino del taladro y las respuestas demasiado rápidas. Un acuerdo sobre horarios os obliga a veros más de lo previsto. Lo complicado empieza cuando él intenta arreglarte algo que no le has pedido.",
    conflict:
      "Daniel confunde resolver problemas con decidir por los demás; ella quiere conservar el control sobre su tiempo.",
    ending:
      'Opciones de final: {"commitment": "Cenan juntos tras terminar su hora propia y cada cual vuelve a su casa; la invitación siguiente se pregunta.", "slow": "Se reservan un café semanal sin prometer convivencia ni cambiar prioridades.", "autonomous": "Mantienen un trato cordial; ella usa el espacio para su proyecto y Daniel cumple las normas."}',
    category: "Tensión y risas",
    milestones: [
      {
        chapter: 1,
        aim: "El del taladro. Negocian horario y aviso; el acuerdo crea contacto recurrente. Daniel acepta una regla que ella creía que discutiría.",
      },
      {
        chapter: 2,
        aim: "Un rato que sí es mío. Ella defiende su franja; él reordena tareas. Aparece una nota de disculpa demasiado técnica.",
      },
      {
        chapter: 3,
        aim: "La norma imposible. Pactan una solución revisable con fecha; queda claro quién conserva cada turno. Él propone verse cuando no haya nada que reclamar.",
      },
      {
        chapter: 4,
        aim: "Café sin incidencias. Ella decide cuánto prolonga el encuentro. Él recuerda una preferencia que solo mencionó de pasada.",
      },
      {
        chapter: 5,
        aim: "Una chapuza reconocida. Él lo resuelve sin excusas; ella puede ayudar o seguir su plan. La cinta de carrocero recibe un nuevo uso ridículo.",
      },
      {
        chapter: 6,
        aim: "No hace falta rescate. Ella elige franja propia y propone, o no, otra cita. Daniel acepta un no y deja una invitación abierta.",
      },
      {
        chapter: 7,
        aim: "La invitación clara. Ponen nombre a la cita o acuerdan seguir conociéndose. Se acaba el encuentro y ninguno necesita inventar otra avería.",
      },
      {
        chapter: 8,
        aim: "Una puerta entornada. Él acepta el límite y revela una manía propia. Cuenta que teme no aportar nada si no arregla cosas.",
      },
      {
        chapter: 9,
        aim: "El plan estupendo. Surge el primer desacuerdo pequeño; él promete consultar. Ve que su promesa le va a resultar incómoda.",
      },
      {
        chapter: 10,
        aim: "Un hueco en la agenda. Ella confirma su reserva; él conoce su importancia. Él anuncia que se ha ocupado de un cambio sin preguntar.",
      },
      {
        chapter: 11,
        aim: "Yo no te lo había pedido. Ella pone un límite; el encuentro romántico se suspende o se reduce. Daniel entiende que pagar otra solución no devuelve la decisión.",
      },
      {
        chapter: 12,
        aim: "Lo que cuesta rectificar. Él rectifica con hechos y sin pedir una cita a cambio. La invitación sigue pendiente, ya sin excusa práctica.",
      },
      {
        chapter: 13,
        aim: "Sin herramientas. Pregunta y acepta la respuesta aunque no le guste. Ella termina un paso de su objetivo sin que él se adjudique el mérito.",
      },
      {
        chapter: 14,
        aim: "A un timbre de distancia. Ella conserva su plan y decide relación, ritmo lento o cierre. La cinta sostiene una invitación que se puede rechazar.",
      },
      {
        chapter: 15,
        aim: "La puerta que abro. Una escena cotidiana demuestra el vínculo y el tiempo propio conservado. El timbre suena a la hora pactada.",
      },
    ],
    imagePrompt:
      "Portal mediterráneo y balcón con buganvilla desenfocados al atardecer; mujer adulta de unos 37 años en primer plano, cabello castaño a la altura de los hombros, blusa terracota; Daniel detrás con camisa azul remangada, sin herramientas; tensión divertida, coral y azul petróleo.",
    heroCanon:
      '{"name": "Daniel Vidal", "age_default": 40, "profession": "Arquitecto; reforma su propia vivienda, no contrata a la protagonista.", "appearance": "Cabello castaño oscuro corto, ojos marrones, barba breve, complexión corriente atlética; camisa azul remangada.", "external_want": "Terminar la reforma y empezar una vida menos provisional.", "internal_need": "Dejar de gestionar a las personas como tareas.", "fear": "Sentirse prescindible cuando no puede solucionar algo.", "wound": "En su anterior relación confundió utilidad con cercanía; no fue una traición secreta.", "defense": "Resuelve antes de preguntar.", "contradiction": "Quiere espontaneidad y lleva una hoja de cálculo para todo.", "public_mask": "Eficiente y algo seco.", "private_behavior": "Arregla sus propias chapuzas y guarda objetos que le recuerdan a la gente.", "voice": "Frases breves, ironía literal; evita discursos sentimentales.", "humor": "Se toma al pie de la letra normas absurdamente precisas.", "values_limits": "Cumple acuerdos; no entra en casa ajena sin permiso.", "blind_spot": "Cree que avisar después equivale a haber consultado.", "arc_actions": ["Respeta la franja de silencio", "Pregunta antes de ayudar", "Anula su cambio unilateral y asume el coste", "Espera una invitación"]}',
    editorialId: "mss_01",
  },
  {
    id: "lawyer",
    title: "Mi novio de mentira besa demasiado bien",
    role: "Abogado",
    person: "Mateo Serra",
    setting:
      "Boda familiar en una casa de celebraciones ficticia accesible desde su localidad.",
    hook: "Una boda, dos adultos y un pacto bastante razonable: fingir lo justo para disfrutar del fin de semana sin interrogatorios. Mateo tiene respuesta para todo, salvo para una pregunta: ¿qué parte de lo vuestro está empezando a ser verdad?",
    conflict:
      "El acuerdo tiene fecha de caducidad; Mateo lo usa para evitar exponerse.",
    ending:
      'Opciones de final: {"commitment": "Se presentan como pareja cuando ambos lo desean, y su primera cita cotidiana no lleva un guion.", "slow": "Mateo la invita a desayunar; no hay familia ni representación y la próxima cita se decide allí.", "autonomous": "La amistad continúa con límites claros; él atiende las preguntas familiares por su cuenta."}',
    category: "Tensión y risas",
    milestones: [
      {
        chapter: 1,
        aim: "Las condiciones. Pactan farsa, amistad o encuentros locales. La primera pregunta familiar llega antes de ensayar.",
      },
      {
        chapter: 2,
        aim: "La cuarta regla. Ella bloquea una franja y definen límites de contacto. Mateo pregunta cómo quiere que la presente.",
      },
      {
        chapter: 3,
        aim: "El ensayo general. Deciden cuánto cuentan y a quién; ambos sostienen la versión acordada. A solas, él pregunta qué harían sin público.",
      },
      {
        chapter: 4,
        aim: "Dos versiones de una historia. Comparten un recuerdo adulto ficticio o un gusto real elegido. Mateo admite que ha ensayado una frase.",
      },
      {
        chapter: 5,
        aim: "Cinco minutos fuera. Usan la señal pactada y se escapan sin humillar a nadie. El silencio de fuera resulta más cómodo que la actuación.",
      },
      {
        chapter: 6,
        aim: "Una mañana aparte. Ella hace su plan y él lo respeta. Se reencuentran por ganas y no por obligación.",
      },
      {
        chapter: 7,
        aim: "Sin testigos. Aclaran un gesto, una cita o un límite. Hay algo que ya no cabe en las reglas iniciales.",
      },
      {
        chapter: 8,
        aim: "Lo que no estamos actuando. Ella pregunta o espera; él explica qué le cuesta arriesgar. Él pide hablar después de la celebración.",
      },
      {
        chapter: 9,
        aim: "La víspera. Ambos acuerdan qué dirán si alguien pregunta por después. Mateo promete no usarla como respuesta cómoda.",
      },
      {
        chapter: 10,
        aim: "Un sí que era otro. Él asiente por inercia y ella le señala el coste. Mateo intenta resolverlo con otra broma.",
      },
      {
        chapter: 11,
        aim: "La cláusula que falta. Ella decide distancia y qué versión puede seguir usando él. Tiene que hablar con su familia sin que ella lo salve.",
      },
      {
        chapter: 12,
        aim: "Decirlo yo. Mateo aclara la situación de forma discreta y sin atribuir culpa. No pide un beso como premio por hacerlo.",
      },
      {
        chapter: 13,
        aim: "Una conversación sin pacto. Se ven si ella quiere y hablan sin versión preparada. Él formula una invitación que acepta un no.",
      },
      {
        chapter: 14,
        aim: "La invitación de verdad. Ella decide relación, cita gradual o amistad y conserva su plan propio. La última regla deja de ser una cláusula.",
      },
      {
        chapter: 15,
        aim: "Después de la fiesta. Una cita corriente o un encuentro amistoso cumple lo acordado. La servilleta se guarda o se tira sin dramatismo.",
      },
    ],
    imagePrompt:
      "Jardín de boda mediterráneo al anochecer, guirnaldas doradas y flores marfil; mujer adulta unos35, cabello castaño oscuro recogido despejando el rostro, vestido verde salvia; Mateo con traje azul noche, sin corbata; burdeos, salvia y oro.",
    heroCanon:
      '{"name": "Mateo Serra", "age_default": 39, "profession": "Abogado; no representa ni emplea a la protagonista.", "appearance": "Pelo negro peinado con naturalidad, ojos castaños, afeitado, traje azul noche sin corbata rígida.", "external_want": "Disfrutar de la boda de su hermana sin convertir su vida sentimental en debate familiar.", "internal_need": "Decir qué desea sin esconderse en una fórmula.", "fear": "Arriesgar una amistad si expresa interés y no es correspondido.", "wound": "Aprendió a evitar conflictos familiares haciendo bromas y concediendo pequeñas mentiras.", "defense": "Negocia los términos de cualquier emoción.", "contradiction": "Improvisa discursos brillantes y ensaya un mensaje de dos líneas.", "public_mask": "Sociable y seguro.", "private_behavior": "Relee sus mensajes y hace tostadas cuando no sabe qué decir.", "voice": "Frases completas, preguntas ingeniosas, cierta pedantería que sabe reírse de sí misma.", "humor": "Convierte las normas del pacto en cláusulas ridículas.", "values_limits": "Lealtad y discreción; ningún contacto se incluye automáticamente en el pacto.", "blind_spot": "Cree que una mentira pequeña evita siempre una incomodidad mayor.", "arc_actions": ["Acuerda límites públicos", "Pregunta antes de cualquier gesto romántico", "Corrige la etiqueta familiar sin cargarle la tarea a ella", "Invita a una cita sin condiciones"]}',
    editorialId: "mss_02",
  },
  {
    id: "firefighter",
    title: "Los sábados llevan tu nombre",
    role: "Bombero",
    person: "Hugo Ferrer",
    setting: "Centro vecinal y plaza de la localidad elegida.",
    hook: "Hugo sabe coordinar una jornada entera y llegar con la merienda de su hija preparada. Lo que se le da fatal es invitarte a un café sin decir que ya estáis allí. Cuatro sábados pueden ser suficientes para reconocerlo. Hacerle sitio a lo que viene después será otra cosa.",
    conflict:
      "Hugo quiere acercarse, pero mantiene una distancia que ya no corresponde a lo que ofrece.",
    ending:
      'Opciones de final: {"commitment": "Acuerdan citas y tiempos propios; cualquier presentación familiar futura se decide aparte.", "slow": "Continúan con encuentros cortos entre adultos, sin dar nombres a una familia que aún no existe.", "autonomous": "Ella disfruta su plan vecinal; Hugo cumple sus tareas y la saluda sin insistencia."}',
    category: "Amor que cabe en tu vida",
    milestones: [
      {
        chapter: 1,
        aim: "La mesa coja. Acuerdan su disponibilidad y una colaboración limitada. Se comprometen a coincidir el siguiente sábado.",
      },
      {
        chapter: 2,
        aim: "Hasta aquí puedo. Ella concreta su límite y Hugo redistribuye. Él se acuerda de una preferencia suya.",
      },
      {
        chapter: 3,
        aim: "El sábado siguiente. Ella delimita cómo volverá; él reserva tiempo para hablar sin tarea. Hugo escribe un mensaje que no trata de la jornada.",
      },
      {
        chapter: 4,
        aim: "La merienda de sobra. Comparte su bocadillo o se ríen de su olvido sin rescatarlo. Inés pide que dejen sus dibujos como ella decidió.",
      },
      {
        chapter: 5,
        aim: "Cada cual con su dibujo. Hugo escucha y rectifica; ella observa cómo acepta un límite. Él pregunta por el plan de ella fuera de allí.",
      },
      {
        chapter: 6,
        aim: "Un sábado que también es mío. Ella mantiene su plan; Hugo cubre lo que le corresponde. Él propone un café sin incluir tareas.",
      },
      {
        chapter: 7,
        aim: "El café de los mayores. Ella pide una cita clara o fija otro tipo de vínculo. Él admite que no sabe cómo hacer sitio sin precipitarse.",
      },
      {
        chapter: 8,
        aim: "Lo que va despacio. Acuerdan qué comparten y qué no con los niños. Hay una siguiente cita pactada.",
      },
      {
        chapter: 9,
        aim: "No me ofrezcas. Ella detecta la oferta antes de que se consolide. Hugo responde como si fuera una cosa pequeña.",
      },
      {
        chapter: 10,
        aim: "Mi nombre no es voluntaria. Ella recuerda su límite; él debe atenderlo en concreto. El plan romántico se convierte otra vez en logística.",
      },
      {
        chapter: 11,
        aim: "Un lugar distinto. Ella reduce contacto o exige una invitación coherente. La tarea sigue existiendo y él tendrá que asumirla.",
      },
      {
        chapter: 12,
        aim: "Lo que hago yo. Hugo rectifica ante Nuria sin culparla ni usar a Inés. Propone fecha, duración y alternativa para una cita.",
      },
      {
        chapter: 13,
        aim: "Sin excusas útiles. Se encuentran por elección y cumplen la duración pactada. Él pregunta cómo quiere vivir el siguiente mes.",
      },
      {
        chapter: 14,
        aim: "El próximo sábado. Ella fija el ritmo compatible con su vida y su objetivo. Se guarda un hueco real en vez de ofrecer todos.",
      },
      {
        chapter: 15,
        aim: "Un rato reservado. Cita, paseo lento o saludo amistoso sin integrar familias a la fuerza. Los rotuladores quedan como Inés eligió.",
      },
    ],
    imagePrompt:
      "Plaza mediterránea con luces cálidas y café de tarde; mujer adulta de unos42, piel negra, cabello natural rizado recogido atrás, blusa marfil; Hugo,42, barba y canas sutiles, sobrecamisa beige sobre camiseta azul; no niños ni equipo de intervención; tonos miel y azul.",
    heroCanon:
      '{"name": "Hugo Ferrer", "age_default": 42, "profession": "Bombero; se evitan procedimientos técnicos y rescates como recurso romántico.", "appearance": "Pelo corto castaño con canas leves, ojos avellana, barba cuidada, camiseta oscura y sobrecamisa beige.", "external_want": "Cumplir con su hija y sacar adelante su parte de la jornada sin prometer de más.", "internal_need": "Aceptar una relación que no sea una responsabilidad más que controlar.", "fear": "Que implicarse afectivamente desordene la estabilidad familiar.", "wound": "Su separación fue respetuosa pero agotadora; no necesita una villana.", "defense": "Reduce cualquier cita a una actividad útil.", "contradiction": "Tiene valor en el trabajo y se atasca invitando a alguien a cenar.", "public_mask": "Sereno y fiable.", "private_behavior": "Ensaya conversaciones con una taza en la mano y pierde sus propias llaves.", "voice": "Pocas palabras, humor seco, preguntas concretas.", "humor": "Sobreprepara la merienda y olvida su bocadillo.", "values_limits": "Cumplir y proteger intimidad familiar; nunca impone cuidados.", "blind_spot": "Confunde no implicar a Inés demasiado pronto con no reconocer sus propios sentimientos.", "arc_actions": ["Respeta la disponibilidad de ella", "Asume sus tareas", "Nombra una cita entre adultos", "Cumple un plan sin usar a su hija como excusa"]}',
    editorialId: "mss_03",
  },
  {
    id: "highlands",
    title: "Cuatro noches para no enamorarme",
    role: "Copropietario de una posada ficticia, no aristócrata ni médico.",
    person: "Callum Fraser",
    setting:
      "Posada y pueblo ficticios en las Highlands; investigar referencias reales antes de describir trayectos, clima concreto o costumbres.",
    hook: "Cuatro noches, una posada junto a un lago y un hombre que tiene una respuesta seca para casi todo. Callum sabe qué camino tomar cuando llueve. Tú tienes un billete de vuelta. Lo que ninguno sabe es cuándo unas vacaciones empiezan a parecer el principio de algo.",
    conflict:
      "La estancia termina; ambos se protegen tratando lo que sienten como un paréntesis.",
    ending:
      'Opciones de final: {"commitment": "Ya en casa, una llamada a la hora acordada muestra que el vínculo cabe en la vida real; no hay traslado automático.", "slow": "Siguen en contacto y consultan una posible visita sin comprar billetes que no pueden prometer.", "autonomous": "La despedida es cálida; ella vuelve con un recuerdo valioso y su objetivo cumplido."}',
    category: "Escocia de película",
    milestones: [
      {
        chapter: 1,
        aim: "La habitación del lago. Callum propone alternativas y ella elige una. Su recomendación más personal no aparece en el folleto.",
      },
      {
        chapter: 2,
        aim: "No era venir a correr. Ella conserva un rato para sí y escoge una alternativa sencilla. Él pide acompañarla solo si quiere compañía.",
      },
      {
        chapter: 3,
        aim: "El círculo del mapa. Acuerdan una salida breve o un encuentro en la posada. Callum pregunta exactamente cuándo se marcha.",
      },
      {
        chapter: 4,
        aim: "Lo sabes desde el principio. La nombran sin promesas y siguen con su plan. Él guarda otro rato libre para el día siguiente.",
      },
      {
        chapter: 5,
        aim: "La tetera tiene razón. Una tarea cotidiana desarma la formalidad. La broma de la tetera se vuelve lenguaje compartido.",
      },
      {
        chapter: 6,
        aim: "Una mañana que no te debo. Ella cumple su objetivo; se reencuentran después si quiere. Él ha cumplido su parte del trabajo sin sacrificios teatrales.",
      },
      {
        chapter: 7,
        aim: "Una cita aunque dure poco. Acuerdan cita, cercanía lenta o amistad. Callum admite que le gustaría que no fuera la última.",
      },
      {
        chapter: 8,
        aim: "Lo que pasó otras veces. Cuenta lo imprescindible sin atribuir a ella el mismo papel. La pregunta sobre el regreso sigue sin respuesta.",
      },
      {
        chapter: 9,
        aim: "Lo que queda de estancia. Ella puede preguntarle o sostener su plan separado. Callum habla de despedida antes de que ella lo haga.",
      },
      {
        chapter: 10,
        aim: "Mi vuelta sigue en pie. Ella confirma su regreso y completa su objetivo. Él se refugia en atender la posada.",
      },
      {
        chapter: 11,
        aim: "No decidas por la distancia. Ella elige hablar, dar espacio o cerrar el paréntesis. Él tendrá que decir qué quiere sin pedirle que se quede.",
      },
      {
        chapter: 12,
        aim: "Una propuesta pequeña. Callum ofrece contacto y revisión de un posible encuentro. La propuesta incluye lugar para que ella diga no.",
      },
      {
        chapter: 13,
        aim: "La última noche completa. Comparten una actividad sencilla y acuerdan qué no saben aún. El círculo del mapa recupera su sentido.",
      },
      {
        chapter: 14,
        aim: "El billete de vuelta. Deciden plan remoto, reencuentro gradual o cierre afectuoso. Nadie tiene que romper el billete para demostrar nada.",
      },
      {
        chapter: 15,
        aim: "Después del lago. Llamada pactada, fecha posible o recuerdo completo según ruta. El mapa conserva un círculo sin exigir mudanza.",
      },
    ],
    imagePrompt:
      "Posada de piedra y lago de Highlands, niebla ligera y ventana ámbar; mujer adulta asiática de unos38, pelo negro liso despejado de ojos, abrigo camel y bufanda crema; Callum pelirrojo, ojos grises, afeitado, jersey verde bosque; verde oscuro, ámbar y azul gris.",
    heroCanon:
      '{"name": "Callum Fraser", "age_default": 41, "profession": "Copropietario de una posada ficticia, no aristócrata ni médico.", "appearance": "Cabello cobrizo corto, ojos grises, afeitado, jersey verde bosque, rasgos escoceses sin caricatura.", "external_want": "Mantener la posada funcionando y cumplir un reparto de tareas justo con su hermana.", "internal_need": "Arriesgar una invitación más allá de lo que puede controlar.", "fear": "Convertirse en un recuerdo de vacaciones para alguien importante.", "wound": "Una antigua relación a distancia acabó por expectativas nunca discutidas.", "defense": "Se despide antes de que sea necesario.", "contradiction": "Conoce rutas alternativas, pero trata su vida sentimental como si solo hubiera una salida.", "public_mask": "Reservado y práctico.", "private_behavior": "Cuida las recomendaciones para cada huésped y desafina cocinando.", "voice": "Humor sobrio, frases llanas; el diálogo se narra en español sin acento fonético inventado.", "humor": "La tetera que él asegura dominar siempre silba a destiempo.", "values_limits": "Honestidad y trabajo compartido; su ayuda no compra compañía.", "blind_spot": "Supone qué necesita alguien que tiene que irse.", "arc_actions": ["Pregunta por su plan propio", "Protege una hora compartida sin cargarla a su hermana", "Expresa que desea seguir", "Propone un reencuentro posible y acepta su respuesta"]}',
    editorialId: "mss_04",
  },
  {
    id: "chef",
    title: "Un chef para chuparse los dedos",
    role: "Chef y copropietario de restaurante",
    person: "Bruno Costa",
    setting: "Restaurante ficticio en su localidad o pueblo cercano elegido.",
    hook: "La mesa junto a la ventana era tu pequeño plan. Hasta que Bruno empezó a sentarse cinco minutos al terminar el servicio. Él sabe exactamente qué falta en un plato. Averiguar qué falta en su vida le va a costar bastante más.",
    conflict:
      "Su proyecto profesional exige marcharse o renegociar cómo quiere trabajar; ninguno quiere convertirse en la renuncia del otro.",
    ending:
      'Opciones de final: {"commitment": "Bruno conserva la decisión laboral tomada y ambos sostienen el modo de verse pactado, sin exigir una mudanza.", "slow": "Mantienen citas o contacto remoto con una revisión acordada; no convierten la incertidumbre en promesa.", "autonomous": "Ella vuelve a su mesa o estrena otra costumbre; lo vivido no invalida su espacio propio."}',
    category: "Una nueva costumbre",
    milestones: [
      {
        chapter: 1,
        aim: "La mesa libre. Ella elige lo que quiere y él rectifica. Él vuelve a preguntar al final del servicio.",
      },
      {
        chapter: 2,
        aim: "Cinco minutos. Ella decide cuánto comparte y él se sienta solo si lo invita. Menciona una candidatura pendiente sin darle importancia.",
      },
      {
        chapter: 3,
        aim: "La costumbre. Acuerdan un siguiente encuentro concreto. Bruno reconoce que reservará tiempo y no solo una mesa.",
      },
      {
        chapter: 4,
        aim: "No me tiene que gustar. Ella discrepa y él aprende a no tomarlo como rechazo personal. La discrepancia se convierte en broma privada.",
      },
      {
        chapter: 5,
        aim: "Cuando baja la persiana. Un encuentro breve revela qué le entusiasma y qué le cansa. Llega aviso de que su candidatura sigue adelante.",
      },
      {
        chapter: 6,
        aim: "Mi sitio también. Ella conserva el uso propio de ese rato. Bruno propone verse en un sitio que no es suyo.",
      },
      {
        chapter: 7,
        aim: "Fuera de la carta. Aclaran interés y ritmo fuera del restaurante. Él cuenta que una decisión laboral llegará pronto.",
      },
      {
        chapter: 8,
        aim: "Lo que quiero conseguir. Ambos expresan deseos sin prometer renuncias. Él admite que no sabe cuánto deseo es suyo.",
      },
      {
        chapter: 9,
        aim: "La oferta. Bruno comparte condiciones narrativas simples antes de decidir. Hay una fecha de respuesta cercana.",
      },
      {
        chapter: 10,
        aim: "Dos planes legítimos. Ella termina un paso suyo y define qué sí podría ofrecer. Bruno pregunta si quedarse cambiaría algo entre ellos.",
      },
      {
        chapter: 11,
        aim: "No quiero ser tu motivo. Ella pide que decida por razones propias y elige su disponibilidad. Bruno debe hablar con Mara y asumir la decisión.",
      },
      {
        chapter: 12,
        aim: "Mi decisión es esta. Él decide y explica su motivo sin exigir una recompensa afectiva. Ahora pueden hablar del vínculo real que queda.",
      },
      {
        chapter: 13,
        aim: "Una mesa en otro sitio. Ensayan una cita y un modo de contacto compatible. Se aproxima la última reserva de esta etapa.",
      },
      {
        chapter: 14,
        aim: "Lo que sí quiero pedir. Ella formula una propuesta coherente con ambos proyectos. La tarjeta de reserva deja de fijar por sí sola el encuentro.",
      },
      {
        chapter: 15,
        aim: "Una costumbre nueva. Cita local, contacto a distancia o ritual propio sin él según ruta. La mesa sigue perteneciendo a quien la reserva.",
      },
    ],
    imagePrompt:
      "Pequeño bistró mediterráneo al anochecer, ventana verde oscuro y luz interior cálida; mujer adulta unos45, cabello rubio oscuro corto peinado tras las orejas, jersey burdeos; Bruno43, canas marcadas y barba sal y pimienta, camisa blanca y delantal azul; crema, vino y verde botella.",
    heroCanon:
      '{"name": "Bruno Costa", "age_default": 43, "profession": "Chef y copropietario de restaurante; no emplea ni evalúa a la protagonista.", "appearance": "Cabello negro con canas visibles, barba corta sal y pimienta, piel oliva, ojos marrones, camisa blanca y delantal oscuro fuera de cocina activa.", "external_want": "Elegir entre consolidar su restaurante o aceptar una propuesta fuera.", "internal_need": "Distinguir ambición propia de la necesidad de demostrar algo.", "fear": "Estancarse y arrepentirse de no intentarlo.", "wound": "Asoció durante años éxito con marcharse y trabajar más.", "defense": "Hace planes sobre trabajo cuando la conversación se vuelve íntima.", "contradiction": "Defiende la cocina sencilla y complica cualquier decisión personal.", "public_mask": "Orgulloso de su oficio y rápido de respuesta.", "private_behavior": "Come de pie hasta que alguien le recuerda su propia mesa.", "voice": "Sensorial sin florituras, directo y algo impaciente.", "humor": "Se toma como un reto que ella no comparta una preferencia culinaria, hasta aprender a reírse.", "values_limits": "Respeto al trabajo y a gustos ajenos; no insiste con alimentos rechazados.", "blind_spot": "Mide su vida con criterios de prestigio aprendidos de otros.", "arc_actions": ["Se sienta a escuchar", "Cuenta la oferta antes de decidir", "Asume su elección laboral", "Propone un vínculo sin convertirla en sacrificio"]}',
    editorialId: "mss_05",
  },
  {
    id: "crossfit",
    title: "Odio los burpees (y a ti casi)",
    role: "Entrenador de CrossFit",
    person: "Nico Salas",
    setting:
      "Box ficticio y café cercano; sin describir técnica de ejercicios ni promesas de salud.",
    hook: "Nico tiene un plan para cada entrenamiento y una broma para cada excusa. Tú has venido con tu propio objetivo. Preparar juntos una jornada parecía inocente. El problema es que os está saliendo bastante mejor la química que mantener las distancias.",
    conflict:
      "Nico mide su valor por lo bien que hace las cosas; una decepción le lleva a retirarse también de la relación.",
    ending:
      'Opciones de final: {"commitment": "Se ven fuera del box y ella conserva su actividad elegida, con otro profesional si necesita supervisión.", "slow": "Un café sin prisa abre una etapa de citas, sin metas de rendimiento compartidas por obligación.", "autonomous": "Ella continúa su objetivo o deja la actividad por elección; Nico mantiene un trato respetuoso."}',
    category: "Tensión y risas",
    milestones: [
      {
        chapter: 1,
        aim: "Mi objetivo es otro. Ella define actividad, colaboración o asistencia. Él le propone un reto que no depende de levantar nada.",
      },
      {
        chapter: 2,
        aim: "La prueba más absurda. Ella elige reglas y ambos se ríen del resultado. Él acepta perder sin que parezca importarle.",
      },
      {
        chapter: 3,
        aim: "Lo que voy a hacer. Acuerdan tarea, tiempo y privacidad; la atracción queda fuera de evaluación. Nico la invita a un encuentro sin ropa deportiva obligatoria.",
      },
      {
        chapter: 4,
        aim: "Sin contar puntos. Ella cambia el foco o pregunta qué disfruta de verdad. Nico recuerda un detalle suyo que no era una marca.",
      },
      {
        chapter: 5,
        aim: "La paciencia que sí tiene. Él apoya a otro adulto sin burlas ni presión. Le sorprende lo duro que es consigo mismo.",
      },
      {
        chapter: 6,
        aim: "A mi manera. Ella conserva su objetivo y Lara ayuda con logística. Nico pregunta cómo quiere celebrar su paso.",
      },
      {
        chapter: 7,
        aim: "Una cita sin clasificación. Confirman ausencia de supervisión directa y eligen una cita o amistad. Él admite que le pone más nervioso esto que la exhibición.",
      },
      {
        chapter: 8,
        aim: "Detrás del entusiasmo. Cuenta que le cuesta ser visto cuando falla. La jornada incluirá una demostración que le importa demasiado.",
      },
      {
        chapter: 9,
        aim: "El día abierto. Ella participa de la forma acordada y logra su paso propio. La demostración de Nico no sale como esperaba.",
      },
      {
        chapter: 10,
        aim: "Después del resultado. Ella termina su objetivo sin asumir la tarea de animarlo. Él cancela el encuentro que tenían pactado.",
      },
      {
        chapter: 11,
        aim: "No era una final. Ella expresa el efecto de su retirada o fija distancia. Él tiene una tarea pendiente y ninguna medalla que ofrecer.",
      },
      {
        chapter: 12,
        aim: "Volver sin demostrar. Nico vuelve, cumple su parte y reconoce que retirarse fue decisión suya. Propone un plan en el que no puede ganar.",
      },
      {
        chapter: 13,
        aim: "Un plan corriente. Se permite una conversación imperfecta y escucha la experiencia de ella. Nadie cronometra cuándo debe ir bien.",
      },
      {
        chapter: 14,
        aim: "Lo que nos apetece. Ella elige vínculo y mantiene su objetivo fuera de la relación. El cronómetro queda guardado.",
      },
      {
        chapter: 15,
        aim: "Sin tiempo que batir. Cita sencilla, continuidad lenta o amistad según ruta. La broma regresa sin ordenar el valor de nadie.",
      },
    ],
    imagePrompt:
      "Entrada de box urbano moderno con luz de tarde y pared azul petróleo, interior deportivo desenfocado; mujer adulta de unos32, piel oliva, pelo negro liso sujeto atrás, camiseta ciruela casual; Nico37 piel morena, rizos negros, afeitado, camiseta carbón; sin ejercicios ni poses musculares; ciruela, azul y cobre.",
    heroCanon:
      '{"name": "Nico Salas", "age_default": 37, "profession": "Entrenador de CrossFit; vínculo romántico fuera de su supervisión directa.", "appearance": "Piel morena, cabello negro rizado corto, afeitado, ojos marrones, constitución atlética natural, camiseta gris carbón.", "external_want": "Organizar una jornada abierta que refleje el buen trabajo del equipo.", "internal_need": "Aceptar que puede gustar sin ser el mejor de la sala.", "fear": "Que al dejar de destacar deje de interesar.", "wound": "Se acostumbró a recibir reconocimiento solo por resultados.", "defense": "Bromea y compite antes de admitir nervios.", "contradiction": "Anima a principiantes con paciencia y no se permite fallar a sí mismo.", "public_mask": "Energético y seguro.", "private_behavior": "Da vueltas a un fallo pequeño y rehace listas que ya funcionan.", "voice": "Rápido, juguetón, sin arengas de motivación vacías.", "humor": "Convierte ordenar vasos en un campeonato y pierde por discutir las reglas.", "values_limits": "Respeta niveles y negativas; no diagnostica, prescribe ni comenta cuerpos.", "blind_spot": "Da por hecho que una mala actuación anula todo lo demás.", "arc_actions": ["Escucha el objetivo de ella", "Separa supervisión y romance", "Reconoce su vergüenza sin responsabilizarla", "Cumple un encuentro sin convertirlo en prueba"]}',
    editorialId: "mss_06",
  },
  {
    id: "reunion",
    title: "Nos debíamos un último beso",
    role: "Técnico de sonido",
    person: "Álvaro Ríos",
    setting: "Librería ficticia y calles de su localidad.",
    hook: "Álvaro sigue recordando aquel café que nunca llegasteis a tomar. Tú recuerdas bastante más. Reencontraros parecía una casualidad agradable. Hasta que descubres que esta vez vas a tener que decidir si vuelves a dejarlo para otro día.",
    conflict:
      "La complicidad anterior facilita acercarse, pero también repetir la costumbre de dejar todo para después.",
    ending:
      'Opciones de final: {"commitment": "Su siguiente encuentro ocurre en la fecha pactada y encaja con los proyectos actuales de ambos.", "slow": "Empiezan a salir como personas que se están conociendo ahora, sin tratar la oportunidad anterior como obligación.", "autonomous": "Se despiden con cariño; haber podido hablar basta para cerrar la posibilidad."}',
    category: "Segundas oportunidades",
    milestones: [
      {
        chapter: 1,
        aim: "Te iba a escribir. Eligen recordar, empezar desde cero o limitarse al presente. Álvaro propone por fin aquel café.",
      },
      {
        chapter: 2,
        aim: "Quién soy ahora. Ella conserva su objetivo y corrige una impresión desfasada. Él pregunta en lugar de completar la historia por ella.",
      },
      {
        chapter: 3,
        aim: "El café pendiente. Fijan fecha y duración, o un encuentro amistoso explícito. Álvaro pregunta por qué no se lo pidieron entonces.",
      },
      {
        chapter: 4,
        aim: "No fue una gran tragedia. Reconocen que no concretaron y dejan de buscar un culpable único. Descubren algo que les gusta del otro ahora.",
      },
      {
        chapter: 5,
        aim: "Lo que sí recuerdo. Una pequeña tarea en la librería o paseo elegido deja una nueva broma. El marcapáginas recupera un hueco para una fecha.",
      },
      {
        chapter: 6,
        aim: "Lo mío sigue adelante. Ella cumple un paso y Álvaro también mantiene su tarea. Se encuentran por elección y no para reparar una vida entera.",
      },
      {
        chapter: 7,
        aim: "Esta vez lo pregunto. Uno pregunta y la otra decide claramente qué desea. Hay una próxima ocasión que ambos reconocen como tal.",
      },
      {
        chapter: 8,
        aim: "El presente tiene agenda. Lo cuenta temprano y expresa la incertidumbre sin esconderla. Ella sabe qué pregunta tendrá que hacerle si llega.",
      },
      {
        chapter: 9,
        aim: "El correo de trabajo. Álvaro informa del hecho, pero aplaza explicar qué quiere. Vuelve la frase de hablar cuando se aclare todo.",
      },
      {
        chapter: 10,
        aim: "Otro día no es una fecha. Ella completa su paso y pide un momento concreto para hablar. Él intenta posponerlo una vez más.",
      },
      {
        chapter: 11,
        aim: "No repetirlo. Ella fija un límite de espera, abre conversación o cierra el vínculo. No puede resolverlo apelando a lo que sintieron antes.",
      },
      {
        chapter: 12,
        aim: "Hoy a esta hora. Álvaro aparece a la hora acordada y dice qué sí puede ofrecer. Por primera vez una propuesta lleva fecha.",
      },
      {
        chapter: 13,
        aim: "Conocernos de verdad. Comparten un plan nuevo sin reconstruir aquel encuentro. La decisión final ya no depende del pasado.",
      },
      {
        chapter: 14,
        aim: "Poner la fecha. Acuerdan relación, citas graduales o cierre. El marcapáginas tiene una fecha o queda libre por voluntad propia.",
      },
      {
        chapter: 15,
        aim: "Lo que sí ocurrió. Se vive el plan acordado o una despedida completa. Lo pendiente deja de ordenar el presente.",
      },
    ],
    imagePrompt:
      "Librería pequeña al final de la tarde, escaparate con libros desenfocados y luz ámbar; mujer adulta unos39, cabello rojizo castaño despejado, camisa azul humo; Álvaro40 castaño claro ondulado, afeitado, ojos verdes y chaqueta de pana marrón; azul humo, miel y cobre.",
    heroCanon:
      '{"name": "Álvaro Ríos", "age_default": 40, "profession": "Técnico de sonido; ayuda temporalmente a su hermana en una librería.", "appearance": "Pelo castaño claro ondulado, ojos verdes, afeitado, gafas de montura fina opcionales fijadas al inicio, chaqueta de pana marrón.", "external_want": "Concluir su ayuda familiar y decidir cómo encajar el siguiente trabajo.", "internal_need": "Entender que no decidir también tiene consecuencias.", "fear": "Prometer presencia que luego no sepa mantener.", "wound": "Antes pospuso decisiones importantes por miedo a equivocarse y perdió oportunidades.", "defense": "Dice que hablarán cuando todo esté más claro.", "contradiction": "Detecta cualquier ruido en una grabación y deja conversaciones propias a medias.", "public_mask": "Tranquilo y adaptable.", "private_behavior": "Guarda mensajes sin enviar y recuerda detalles concretos de encuentros.", "voice": "Pausado, observador, humor de asociaciones cotidianas.", "humor": "Recuerda con precisión un detalle absurdo y confunde el importante.", "values_limits": "No usar el pasado como deuda ni exigir una segunda oportunidad.", "blind_spot": "Cree que esperar evita el riesgo de una respuesta equivocada.", "arc_actions": ["Pregunta quién es ella ahora", "No usa recuerdos como permiso", "Avisa del cambio de agenda", "Fija una conversación y un plan que cumple"]}',
    editorialId: "mss_07",
  },
  {
    id: "business",
    title: "Besos fuera de horario",
    role: "Empresario y propietario de hotel boutique",
    person: "Adrián Belmonte",
    setting: "Hotel boutique ficticio con patio y pequeño ciclo de cine.",
    hook: "Adrián Belmonte tiene un hotel impecable, una agenda imposible y una propuesta que no te hace ninguna gracia. Tú tienes una semana para hacerle cambiar de idea. Lo de acabar deseando que alargue las reuniones es un problema que no venía en el programa.",
    conflict:
      "Él quiere reducir el riesgo económico; ella no acepta que un acuerdo común dependa de caerle bien.",
    ending:
      'Opciones de final: {"commitment": "Se ven fuera del hotel y siguen pudiendo discrepar; el ciclo conserva su acuerdo por motivos propios.", "slow": "Una cita sencilla fuera de su entorno inicia algo sin dinero ni favores como argumento.", "autonomous": "Ella disfruta del cine y su proyecto; Adrián sostiene el acuerdo independientemente de su respuesta."}',
    category: "Hombres difíciles",
    milestones: [
      {
        chapter: 1,
        aim: "El patio no es solo tuyo. El grupo obtiene un piloto y ella define su papel. Adrián pide escuchar su propuesta fuera del discurso preparado.",
      },
      {
        chapter: 2,
        aim: "Mi propuesta en una frase. Ella concreta qué quiere conservar y qué puede aportar. Una idea suya cambia el plan de la primera noche.",
      },
      {
        chapter: 3,
        aim: "Una semana de prueba. Se fijan horario, alcance y decisión posterior sin deuda afectiva. Él propone un café que no forma parte del piloto.",
      },
      {
        chapter: 4,
        aim: "La silla incómoda. Comparten una proyección o charla breve desde lugares iguales. Él recuerda una opinión suya que no trataba de dinero.",
      },
      {
        chapter: 5,
        aim: "Cuando se apaga la pantalla. Cuenta por qué evita prometer demasiado. Se menciona una posible oferta privada para el patio.",
      },
      {
        chapter: 6,
        aim: "Mi parte tiene fin. Ella completa su parte; el equipo asume lo suyo. Adrián invita a verla fuera de cualquier tarea.",
      },
      {
        chapter: 7,
        aim: "Una cita sin propuesta. Separan explícitamente vínculo y resultado del piloto. Él acepta que ella pueda seguir discrepando después de la cita.",
      },
      {
        chapter: 8,
        aim: "Lo que nos importa. Una conversación deja valores claros sin convertirlos en enemigos. La oferta privada llega con una fecha concreta.",
      },
      {
        chapter: 9,
        aim: "La excepción rentable. Adrián plantea moverla y descubre que no es intercambiable. La respuesta debe darse antes de cerrar el piloto.",
      },
      {
        chapter: 10,
        aim: "No depende de nosotros dos. Ella defiende el acuerdo o delega en la portavoz sin dejar de ser dueña de su postura. Adrián insinúa que una compensación debería bastar.",
      },
      {
        chapter: 11,
        aim: "El precio no lo arregla. Ella suspende la negociación afectiva y exige planos separados. La decisión empresarial debe sostenerla sin garantía de cita.",
      },
      {
        chapter: 12,
        aim: "Cumplir tiene un coste. Adrián elige y comunica al grupo sin atribuirlo a ella. La última noche de cine sucede como estaba pactado.",
      },
      {
        chapter: 13,
        aim: "Cuando acaba la reunión. Él propone un plan corriente y acepta su ritmo. La silla plegable aparece fuera de una reunión.",
      },
      {
        chapter: 14,
        aim: "Fuera de la agenda. Ella decide relación, citas graduales o cierre conservando su objetivo. No hay una oferta escondida detrás de la invitación.",
      },
      {
        chapter: 15,
        aim: "Una noche cualquiera. El encuentro elegido sucede sin privilegios comprados. Adrián llega y se sienta sin dirigir nada.",
      },
    ],
    imagePrompt:
      "Patio elegante de hotel urbano al anochecer con pantalla de cine desenfocada y lámparas cálidas; mujer adulta unos41 piel morena clara, cabello negro bob despejado, vestido cotidiano azul cobalto; Adrián44 afeitado, pelo corto con canas en sienes, traje grafito; azul, oro y negro.",
    heroCanon:
      '{"name": "Adrián Belmonte", "age_default": 44, "profession": "Empresario y propietario de hotel boutique; no jefe ni cliente obligado de ella.", "appearance": "Cabello oscuro muy corto con sienes grises, afeitado, ojos oscuros, traje gris grafito sin corbata.", "external_want": "Hacer rentable el uso del patio sin comprometer el hotel.", "internal_need": "Reconocer valor y criterio fuera de lo que puede medir o comprar.", "fear": "Repetir una mala decisión empresarial que afectó a su equipo.", "wound": "Antes prometió más de lo que podía sostener y desde entonces se protege con márgenes.", "defense": "Se refugia en una propuesta económica en vez de escuchar una objeción.", "contradiction": "Vende experiencias memorables y vive pendiente del siguiente horario.", "public_mask": "Controlado y exigente.", "private_behavior": "Se queda a escuchar la música cuando cree que ya no hay nadie.", "voice": "Preciso, preguntas incisivas, ironía elegante sin insultos.", "humor": "Intenta programar un momento espontáneo con hora de inicio y fin.", "values_limits": "Responsabilidad con su equipo; ni empleo ni dinero condicionan el romance.", "blind_spot": "Cree que compensar económicamente conserva cualquier acuerdo.", "arc_actions": ["Escucha la experiencia de asistentes", "Define el piloto sin favores románticos", "Asume el coste de cumplir", "Invita a verla sin mesa de negociación"]}',
    editorialId: "mss_08",
  },
  {
    id: "actor",
    title: "No era solo la lluvia",
    role: "Actor conocido de ficción",
    person: "Gabriel León",
    setting:
      "Café, paseo y zonas públicas normales de una localidad elegida; rodaje ficticio.",
    hook: "Sabes quién es Gabriel antes de que termine vuestro primer café. Lo que no esperabas era que contigo dejara de interpretar al hombre al que todo le sale bien. Diez días después tendrá que marcharse. Antes os queda decidir qué parte de lo vuestro estáis dispuestos a vivir.",
    conflict:
      "La privacidad acordada empieza a parecer una relación que solo existe cuando nadie mira.",
    ending:
      'Opciones de final: {"commitment": "Un encuentro o una llamada pactados después del rodaje confirman el vínculo sin publicación ni traslado obligatorios.", "slow": "Conservan contacto y exploran verse otra vez desde sus vidas propias.", "autonomous": "Ella continúa su plan y se despide sin convertirse en un capítulo secundario de la carrera de él."}',
    category: "Una vida de película",
    milestones: [
      {
        chapter: 1,
        aim: "Sé quién eres. Se presenta sin engaño y ella fija el tono del encuentro. Él pide volver a hablar sin una entrevista de por medio.",
      },
      {
        chapter: 2,
        aim: "Mi día también existe. Ella conserva su plan y ofrece una franja posible. Él acepta una hora que no le resulta perfecta.",
      },
      {
        chapter: 3,
        aim: "Un café sin público. Fijan límites de fotos, menciones y lugar. Gabriel pregunta si la invitación puede llamarse cita.",
      },
      {
        chapter: 4,
        aim: "La broma peor ensayada. Una torpeza compartida baja la representación. Recuerda algo de ella que no necesita audiencia.",
      },
      {
        chapter: 5,
        aim: "Entre dos jornadas. Cumple una cita breve y avisa de una limitación real. Ella descubre que puede decir que no sin perderlo.",
      },
      {
        chapter: 6,
        aim: "Un plan que es mío. Ella hace su plan y él pregunta después cómo fue. Una conversación sin agenda de rodaje dura más de lo previsto.",
      },
      {
        chapter: 7,
        aim: "Esto sí lo elijo. Acuerdan cita, cercanía lenta o amistad con límites claros. Gabriel admite qué le da miedo de ser visto.",
      },
      {
        chapter: 8,
        aim: "Privado no significa ausente. Escucha qué grado de presencia necesita ella. Pactan un encuentro en un lugar normal elegido por ambos.",
      },
      {
        chapter: 9,
        aim: "La invitación sencilla. Ambos revisan un plan que respeta los límites de privacidad. Él empieza a buscar otra excusa para cancelarlo.",
      },
      {
        chapter: 10,
        aim: "Otra puerta de atrás. Ella termina su plan y señala la repetición sin demandar fama. Gabriel intenta llamar protección a su retirada.",
      },
      {
        chapter: 11,
        aim: "Lo que estamos viviendo. Ella pide un gesto proporcionado, toma distancia o cierra. No sirve una declaración pública que ella no haya pedido.",
      },
      {
        chapter: 12,
        aim: "Un lugar acordado. Gabriel cumple el encuentro y los límites de ambos. Hablan del día en que acaba el rodaje.",
      },
      {
        chapter: 13,
        aim: "Cuando te marches. Comparten disponibilidad conocida y lo que todavía no saben. Él ofrece contacto que no depende de coincidir en hoteles.",
      },
      {
        chapter: 14,
        aim: "La parte que elegimos. Ella elige vínculo y mantiene el objetivo propio. El plan no incluye abandonar su vida para seguirlo.",
      },
      {
        chapter: 15,
        aim: "Sin escena final. Llamada, cita acordada o despedida completa. La taza vuelve a usarse sin posición de cámara.",
      },
    ],
    imagePrompt:
      "Paseo urbano junto a café con luz azul de noche y discretos reflejos cinematográficos; mujer adulta unos36, piel canela, pelo oscuro largo recogido detrás sin mechones en cara, chaqueta verde esmeralda; Gabriel39 pelo negro medio peinado atrás, barba ligera, chaqueta de ante oscura; esmeralda, plata y azul noche.",
    heroCanon:
      '{"name": "Gabriel León", "age_default": 39, "profession": "Actor conocido de ficción; nunca imita a una persona real.", "appearance": "Pelo negro liso de longitud media peinado atrás, ojos castaños, barba muy ligera, chaqueta oscura de ante sobre camiseta crema.", "external_want": "Terminar el rodaje y conservar una parte de su vida sin representación pública.", "internal_need": "Aceptar que cuidar su intimidad no equivale a esconder a quien quiere.", "fear": "Perder el control de lo que otros cuentan sobre él.", "wound": "Una relación pasada se volvió espectáculo y él dejó de diferenciar toda exposición.", "defense": "Traslada cualquier acercamiento a lugares donde no tenga que posicionarse.", "contradiction": "Trabaja siendo visible y no sabe dejarse ver en una decisión personal.", "public_mask": "Encantador, rápido y seguro.", "private_behavior": "Hace bromas malas, pregunta por cosas corrientes y se queda sin respuestas ensayadas.", "voice": "Ágil y autocrítico; sin monólogos de celebridad incomprendida.", "humor": "Imita con exageración sus propias frases promocionales, nunca a personas reales.", "values_limits": "No publica ni menciona a ella sin permiso; no pide que mienta por él.", "blind_spot": "Interpreta discreción como desaparición de todo rastro compartido.", "arc_actions": ["Declara quién es temprano", "Acuerda privacidad concreta", "Reconoce el efecto de esconderse", "Sostiene un encuentro elegido sin convertirlo en noticia"]}',
    editorialId: "mss_09",
  },
  {
    id: "detective",
    title: "Diez cafés y cero excusas",
    role: "Detective privado",
    person: "Iván Montes",
    setting: "Café ficticio y un paseo cercano en su localidad.",
    hook: "Un detective, tu café habitual y una apuesta que él se toma demasiado en serio: diez encuentros para dejar de confundir lo que supone con lo que sabe. Iván presta atención a todo. Ahora tendrá que aprender qué hacer cuando tú también lo miras.",
    conflict:
      "Iván observa y pregunta, pero se protege hablando poco de sí mismo y confundiendo deducciones con certezas.",
    ending:
      'Opciones de final: {"commitment": "El café once es una cita de dos personas que se preguntan qué quieren, sin deducir la respuesta.", "slow": "Siguen viéndose a otro ritmo, sin tarjeta ni obligación de revelar más de lo que desean.", "autonomous": "Ella conserva su ritual y él deja de leer una posibilidad romántica en cada saludo."}',
    category: "Amor que cabe en tu vida",
    milestones: [
      {
        chapter: 1,
        aim: "Eso no es lo que voy a pedir. Ella lo corrige y decide si participa en el juego. Él propone que la siguiente pregunta sea de ella.",
      },
      {
        chapter: 2,
        aim: "Una pregunta para cada uno. Acuerdan reciprocidad y derecho a no contestar. Su primera respuesta personal no tiene nada de extraordinario.",
      },
      {
        chapter: 3,
        aim: "La tercera marca. Ella elige ritmo y duración para los siguientes encuentros. Iván propone verse sin tarjeta ni pregunta preparada.",
      },
      {
        chapter: 4,
        aim: "El detective no adivina. Ambos diferencian una pista de una respuesta real. Él admite que le gusta más hablar que acertar.",
      },
      {
        chapter: 5,
        aim: "Una respuesta pequeña. Comparte un gusto cotidiano y acepta que ella no lo comparta. Descubren un plan que ambos quieren probar.",
      },
      {
        chapter: 6,
        aim: "Un rato que aprovecho. Ella realiza un paso propio y él no lo convierte en examen. Aparece una invitación con fecha y salida posible.",
      },
      {
        chapter: 7,
        aim: "Sin preguntas de prueba. Aclaran cita, cercanía gradual o amistad. Iván se queda sin una frase preparada.",
      },
      {
        chapter: 8,
        aim: "Lo que no sé decir. Cuenta una dificultad cotidiana propia sin secreto espectacular. Ella ve la diferencia entre ser discreto y ser inaccesible.",
      },
      {
        chapter: 9,
        aim: "La predicción. Ella aclara solo lo que desea compartir. Él asegura saber qué prefiere sin haber preguntado.",
      },
      {
        chapter: 10,
        aim: "Puedo elegir otra cosa. Ella actúa según su plan y él comprueba el límite de sus deducciones. El juego deja de resultar ligero.",
      },
      {
        chapter: 11,
        aim: "No soy una respuesta. Ella pide reciprocidad, suspende el juego o cierra el romance. Iván tendrá que hablar de sí sin esconderse en otro dato.",
      },
      {
        chapter: 12,
        aim: "Lo que sí sé de mí. Distingue su error, comparte un deseo y pregunta sin anticipar respuesta. Propone un encuentro sin apuesta.",
      },
      {
        chapter: 13,
        aim: "La novena vez. Comparten un plan elegido por ambos y respetan un silencio. Se acerca el décimo encuentro sin premio pactado.",
      },
      {
        chapter: 14,
        aim: "La última marca. Ella elige continuidad y conserva su objetivo. La tarjeta no contiene una respuesta correcta.",
      },
      {
        chapter: 15,
        aim: "El café once. Cita, nuevo ritmo o saludo amistoso según la elección. El pedido se pregunta antes de traerlo.",
      },
    ],
    imagePrompt:
      "Café urbano con ventana lluviosa al fondo pero luz suave despejada sobre caras; mujer adulta unos40 de piel clara con pecas, pelo castaño oscuro recogido, jersey crema; Iván42 pelo castaño muy corto, ojos gris oscuro, barba tres días, chaqueta marino y jersey tostado; ámbar, crema y azul tinta; sin armas ni distintivos.",
    heroCanon:
      '{"name": "Iván Montes", "age_default": 42, "profession": "Detective privado; ningún caso vertebra la trama y nunca investiga a la protagonista.", "appearance": "Cabello castaño muy corto, ojos gris oscuro, barba de tres días, chaqueta azul marino sobre jersey tostado.", "external_want": "Sostener un pequeño ritual cotidiano fuera del trabajo.", "internal_need": "Dejarse conocer sin usar preguntas para mantener distancia.", "fear": "Ser valorado solo por lo que descubre y no por lo que comparte.", "wound": "Ha construido una identidad de persona discreta hasta volverse difícil de conocer.", "defense": "Responde con otra pregunta o presenta una interpretación como hecho.", "contradiction": "Detecta detalles ajenos y se equivoca al interpretar lo que ella quiere.", "public_mask": "Sereno y observador.", "private_behavior": "Se atasca eligiendo una película y cambia el pedido por puro antojo.", "voice": "Preguntas concretas, pausas, humor seco; sin voz de novela negra impostada.", "humor": "Sus predicciones fallan en detalles mínimos y aprende a reconocerlo.", "values_limits": "Discreción y respeto; no sigue, verifica redes ni recoge información fuera de lo que ella comparte.", "blind_spot": "Confunde atención con conocimiento completo.", "arc_actions": ["Acepta preguntas recíprocas", "Respeta no responder", "Diferencia suposición y hecho", "Invita sin dar la respuesta por sabida"]}',
    editorialId: "mss_10",
  },
];
export function getTemplate(id: import("../domain/types").Universe) {
  const t = [...templates, ...legacyTemplates].find((x) => x.id === id);
  if (!t) throw new Error("Aventura desconocida");
  return t;
}
