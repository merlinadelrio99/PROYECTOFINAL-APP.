/* Bioferia · Lo que te sobra. Prototipo de un sistema de intercambio en el predio. */
(function () {
  const KEY = 'bioferia-intercambio-v1';
  const META = 120; // Unidad ilustrativa, no especificación de impresión.
  const BP_POR_GRAMO = 5; // Regla ilustrativa de puntos.
  const TIPOS = [['tapitas', 'Tapitas', '◉'], ['botellas', 'Botellas', '♧'], ['envases', 'Envases', '▤']];
  const COLORES = [['azul', 'Azul', '#2455a2'], ['rosa', 'Rosa', '#d81987'], ['naranja', 'Naranja', '#dc7a27'], ['mixto', 'Varios', 'linear-gradient(135deg,#2455a2 0 33%,#d81987 33% 66%,#dc7a27 66%)']];
  const PERSONAJES = [
    ['tapita', 'Tapita', 'Lo oculto', '#1e3a8a'], ['tironcito', 'Tironcito', 'La tensión', '#df7524'],
    ['vueltita', 'Vueltita', 'El giro', '#cf5262'], ['pistin', 'Pistín', 'La pista', '#089bb2'],
    ['lucecita', 'Lucecita', 'La revelación', '#9451ae'], ['justito', 'Justito', 'El equilibrio', '#3a916b']
  ];
  const nuevo = () => ({ etapa: 'traer', cantidades: { tapitas: 0, botellas: 0, envases: 0 }, color: 'mixto', gramos: '', fondo: 600, personaje: 'tapita', bono: 0 });
  let data;
  try { data = { ...nuevo(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { data = nuevo(); }
  if (!['traer', 'medir', 'intercambiar', 'transformar', 'resultado'].includes(data.etapa)) data.etapa = 'traer';
  data.cantidades = { ...nuevo().cantidades, ...data.cantidades };
  if (!Number.isFinite(Number(data.fondo)) || Number(data.fondo) < 0) data.fondo = 600;
  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} };
  const personaje = () => PERSONAJES.find(p => p[0] === data.personaje) || PERSONAJES[0];
  const diferencia = () => Number(data.gramos) - META;
  const cantidad = () => TIPOS.reduce((n, t) => n + (Number(data.cantidades[t[0]]) || 0), 0);
  const fmt = n => Number(n).toLocaleString('es-AR');
  const imagen = p => `<img src="hc/serie-${p[0]}-cutout.png" alt="Figura de ${p[1]}, ${p[2]}">`;
  window.BioferiaIntercambio = () => ({ fondo: Number(data.fondo), etapa: data.etapa, personaje: data.personaje });
  window.BioferiaCarousel = context => `<div class="un-character-carousel" data-carousel="${context}" aria-label="Personajes de Bioferia">
    <div class="un-carousel-stage">${PERSONAJES.map((p, i) => `<figure class="un-slide" style="--pc:${p[3]}" ${i ? 'hidden' : ''}>${imagen(p)}<figcaption><strong>${p[1]}</strong><small>${p[2]}</small></figcaption></figure>`).join('')}</div>
    <div class="un-carousel-controls"><button type="button" data-carousel-action="prev" aria-label="Personaje anterior">←</button><span class="un-carousel-count">01 / 06</span><button type="button" data-carousel-action="next" aria-label="Personaje siguiente">→</button></div>
  </div>`;
  const boton = (txt, accion, off = false) => `<button class="ic-cta" type="button" data-ic="${accion}" ${off ? 'disabled' : ''}>${txt}<span aria-hidden="true">↗</span></button>`;
  const pasos = ['Traer', 'Medir', 'Intercambiar', 'Transformar'];
  function progreso() {
    const n = ['traer', 'medir', 'intercambiar', 'transformar', 'resultado'].indexOf(data.etapa);
    return `<ol class="ic-pasos" aria-label="Progreso del intercambio">${pasos.map((p, i) => `<li class="${i < n ? 'listo' : i === n ? 'ahora' : ''}"><b>${i + 1}</b><span>${p}</span></li>`).join('')}</ol>`;
  }
  function traer() {
    return `<p class="ic-kicker">01 / LO QUE TRAÉS</p><h2>¿Qué tenés en casa?</h2><p>Separá el plástico que te sobra. En el predio, una cámara reconocería tipo, color y cantidad. En esta demo cargás esos datos vos.</p>
      <div class="ic-materiales">${TIPOS.map(t => `<label><span aria-hidden="true">${t[2]}</span><strong>${t[1]}</strong><input type="number" min="0" max="99" step="1" inputmode="numeric" data-ic-cantidad="${t[0]}" aria-label="Cantidad de ${t[1].toLowerCase()}" value="${Number(data.cantidades[t[0]]) || 0}"></label>`).join('')}</div>
      <strong class="ic-label">Colores que trajiste</strong><div class="ic-colores" role="group" aria-label="Color del plástico">${COLORES.map(c => `<button type="button" data-ic-color="${c[0]}" aria-pressed="${data.color === c[0]}" class="${data.color === c[0] ? 'elegido' : ''}"><i style="background:${c[2]}"></i>${c[1]}</button>`).join('')}</div>
      <p class="ic-nota">La cantidad de objetos no equivale al peso. Eso se mide después.</p>${boton('Medir mi aporte', 'medir', !cantidad())}`;
  }
  function medir() {
    return `<p class="ic-kicker">02 / LA MEDIDA JUSTA</p><h2>¿Cuánto pesa?</h2><p>Cada pieza necesita una cantidad precisa de material. La app compara lo que trajiste con esa medida.</p>
      <label class="ic-peso"><span>Tu aporte</span><span><input id="ic-gramos" type="number" min="1" max="2000" step="1" inputmode="numeric" value="${data.gramos}" aria-label="Peso del plástico en gramos"><b>g</b></span><small>La balanza del evento daría este valor.</small></label>
      <div class="ic-meta"><span>Para una pieza</span><strong>${META} g</strong></div><p class="ic-nota">${META} g es un valor de prueba para mostrar la lógica; la cantidad real se definiría para cada material y diseño.</p>
      <p class="ic-error" id="ic-error" role="alert" hidden>Ingresá un peso entero entre 1 y 2.000 gramos.</p>${boton('Ver mi resultado', 'balance')}<button class="ic-volver" data-ic="volver-traer">← Cambiar lo que traje</button>`;
  }
  function intercambiar() {
    const d = diferencia(), n = Math.abs(d), falta = d < 0, alcanza = n <= data.fondo;
    const estado = d > 0 ? 'MUY MUY · TE SOBRA' : falta ? 'TAN TAN · TE FALTA' : 'PUNTO JUSTO';
    const texto = d > 0 ? `Te sobran ${fmt(n)} g. Podés dejarlos para quien aún no llegó a su medida.` : falta ? `Te faltan ${fmt(n)} g. El fondo común puede completar tu pieza con el aporte de otra persona.` : 'Llegaste a la cantidad justa para transformar el material.';
    return `<p class="ic-kicker">03 / CIRCULAR HASTA EQUILIBRAR</p><h2>Tu punto justo.</h2><div class="ic-resultado ${d > 0 ? 'sobra' : falta ? 'falta' : 'justo'}"><span>${estado}</span><strong>${fmt(data.gramos)} <small>/ ${META} g</small></strong><div class="ic-regla"><i style="width:${Math.min(100, Number(data.gramos) / META * 100)}%"></i></div><p>${texto}</p></div>
      <div class="ic-circulacion"><div><span>Tu aporte</span><b>${fmt(data.gramos)} g</b></div><div><span>${d > 0 ? 'Dejás' : falta ? 'Recibís' : 'Intercambio'}</span><b>${fmt(n)} g</b></div><div><span>Pieza</span><b>${META} g</b></div></div>
      ${d > 0 ? `<p class="ic-premio">Por dejar ${fmt(n)} g sumarías <strong>+${fmt(n * BP_POR_GRAMO)} BioPoints</strong> en esta demo.</p>` : falta ? `<p class="ic-premio">Fondo común de prueba: <strong>${fmt(data.fondo)} g</strong>.</p>` : ''}
      ${falta && !alcanza ? '<p class="ic-error">El fondo aún no alcanza. Volvé a medir o esperá otro aporte.</p>' : ''}
      ${boton(d > 0 ? `Dejar ${fmt(n)} g y seguir` : falta ? `Tomar ${fmt(n)} g y seguir` : 'Seguir a transformación', 'confirmar', falta && !alcanza)}<button class="ic-volver" data-ic="volver-medir">← Corregir peso</button>`;
  }
  function transformar() {
    const p = personaje();
    return `<p class="ic-kicker">04 / DE SOBRA A POSIBILIDAD</p><h2>Ahora se transforma.</h2><p>El material circuló hasta completar una pieza. En el espacio abierto de la feria se vería el proceso completo.</p>
      <ol class="ic-proceso"><li>Clasificar</li><li>Triturar</li><li>Extruir</li><li>Imprimir</li></ol>
      <strong class="ic-label">Elegí uno de los seis personajes</strong><div class="ic-personajes">${PERSONAJES.map(x => `<button type="button" data-ic-personaje="${x[0]}" aria-pressed="${x[0] === p[0]}" class="${x[0] === p[0] ? 'elegido' : ''}" style="--pc:${x[3]}">${imagen(x)}<strong>${x[1]}</strong><small>${x[2]}</small></button>`).join('')}</div>
      <p class="ic-nota">La elección es parte de la demo. El color final depende de los plásticos reunidos: ninguna pieza sale igual a otra.</p>${boton(`Ver a ${p[1]}`, 'finalizar')}`;
  }
  function resultado() {
    const p = personaje(), d = diferencia();
    return `<p class="ic-kicker">RECORRIDO COMPLETO · DEMOSTRACIÓN</p><h2>Lo que sobró<br>encontró su lugar.</h2><div class="ic-final" style="--pc:${p[3]}">${imagen(p)}<div><span>${p[2].toUpperCase()}</span><h3>${p[1]}</h3><p>Una pieza nacida del intercambio, con un color que dependería de los materiales reunidos.</p></div></div>
      <div class="ic-resumen"><div><span>Trajiste</span><strong>${fmt(data.gramos)} g</strong></div><div><span>${d > 0 ? 'Compartiste' : d < 0 ? 'Recibiste' : 'Intercambio'}</span><strong>${fmt(Math.abs(d))} g</strong></div>${data.bono ? `<div><span>BioPoints sumados</span><strong>+${fmt(data.bono)} BP</strong></div>` : ''}</div>
      <p class="ic-nota">Simulación: no se reservó una impresión ni se acreditaron puntos reales.</p><button class="ic-cta ic-secondary" type="button" data-go="pieza">Ver mi pieza <span aria-hidden="true">↗</span></button>${boton('Probar otro intercambio', 'reiniciar')}`;
  }
  const vistas = { traer, medir, intercambiar, transformar, resultado };
  screens.hecho = () => `<section class="app-hero ic-hero"><p class="eyebrow">BIOFERIA · EN EL PREDIO</p><h1>Lo que te<br>sobra.</h1><p>Puede ser justo lo que alguien necesita.</p></section><section class="ic-cuerpo"><p class="ic-demo">EXPERIENCIA INTERACTIVA · PROTOTIPO</p>${progreso()}<div class="ic-panel">${vistas[data.etapa]()}</div><div class="ic-travel"><button data-go="fondo">Explorar el fondo común ↗</button><button data-go="pieza">Conocer las seis piezas ↗</button></div><details class="ic-explicacion"><summary>Cómo funciona la propuesta</summary><p>Traés tapitas, botellas o envases. El sistema identifica qué y cuánto trajiste; lo que sobra circula hacia quien necesita material. En el punto justo, el plástico se transforma en uno de los seis personajes.</p><p>La propuesta integra cámara con inteligencia artificial, app y BioPoints, triturado, extrusión e impresión 3D, en un espacio abierto donde se ve el proceso.</p></details></section>`;
  screens.fondo = () => `<section class="app-hero ic-hero un-fondo-hero"><p class="eyebrow">MUCHAS PERSONAS · UN MISMO FONDO</p><h1>Lo que circula.</h1><p>Alguien deja lo que le sobra. Otra persona encuentra lo que le falta.</p></section><section class="ic-cuerpo"><div class="un-pool" aria-label="${fmt(data.fondo)} gramos en el fondo común de prueba"><div class="un-pool-orbit" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div><span>FONDO COMÚN · DEMO</span><strong>${fmt(data.fondo)} <small>g</small></strong><p>Material disponible para completar otras piezas.</p><i aria-hidden="true">↝</i></div><div class="un-pair"><div><span aria-hidden="true">↗</span><strong>Si te sobra</strong><p>Dejás la diferencia en el fondo y sumás BioPoints de prueba.</p></div><div><span aria-hidden="true">↙</span><strong>Si te falta</strong><p>El fondo completa tu pieza si hay suficiente material.</p></div></div><button class="ic-cta" data-go="hecho">Probar mi aporte <span aria-hidden="true">↗</span></button><button class="un-inline" data-go="wallet">Ver mis BioPoints ↗</button><p class="ic-nota">El peso y la conversión a puntos son valores de demostración; la propuesta real se calibraría por material y pieza.</p></section>`;
  screens.pieza = () => {
    const p = personaje(), terminada = data.etapa === 'resultado';
    return `<section class="app-hero ic-hero un-pieza-hero"><p class="eyebrow">DEL MATERIAL A ALGO NUEVO</p><h1>Mi pieza.</h1><p>Seis personajes cuentan seis maneras de mirar lo que parecía sobrar.</p></section><section class="ic-cuerpo">${terminada ? `<div class="un-my-piece" style="--pc:${p[3]}"><span>TU INTERCAMBIO CREÓ A</span>${imagen(p)}<strong>${p[1]}</strong><small>${p[2]}</small></div>` : `<div class="un-piece-empty"><span aria-hidden="true">✳</span><strong>Todavía no elegiste tu pieza.</strong><p>Completá el intercambio para descubrir el personaje que acompaña tu aporte.</p><button class="ic-cta" data-go="hecho">Ir al intercambio <span aria-hidden="true">↗</span></button></div>`}<div class="section-head"><h2>La colección · uno a uno</h2></div>${window.BioferiaCarousel('pieza')}<div class="un-process"><b>01 Clasificar</b><b>02 Triturar</b><b>03 Extruir</b><b>04 Imprimir</b></div><p class="ic-nota">El color final depende de los plásticos reunidos. Los personajes y la impresión son parte de esta demostración.</p><div class="ic-travel"><button data-go="fondo">Ver el fondo común ↗</button><button data-go="laboratorio">Jugar a Hecho y cosido ↗</button></div></section>`;
  };
  document.addEventListener('input', e => {
    if (e.target.dataset.icCantidad) {
      const n = Number(e.target.value);
      data.cantidades[e.target.dataset.icCantidad] = Number.isInteger(n) ? Math.max(0, Math.min(99, n)) : 0;
      guardar(); document.querySelector('[data-ic="medir"]')?.toggleAttribute('disabled', !cantidad());
    }
    if (e.target.id === 'ic-gramos') { data.gramos = e.target.value; guardar(); }
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-ic],[data-ic-color],[data-ic-personaje]'); if (!b) return;
    e.stopImmediatePropagation();
    const content = document.querySelector('.app-content'), scrollTop = content.scrollTop;
    if (b.dataset.icColor) data.color = b.dataset.icColor;
    else if (b.dataset.icPersonaje) data.personaje = b.dataset.icPersonaje;
    else switch (b.dataset.ic) {
      case 'medir': if (!cantidad()) return; data.etapa = 'medir'; break;
      case 'balance': {
        const g = Number(document.querySelector('#ic-gramos')?.value);
        if (!Number.isInteger(g) || g < 1 || g > 2000) { document.querySelector('#ic-error').hidden = false; document.querySelector('#ic-gramos')?.focus(); return; }
        data.gramos = g; data.etapa = 'intercambiar'; break;
      }
      case 'volver-traer': data.etapa = 'traer'; break;
      case 'volver-medir': data.etapa = 'medir'; break;
      case 'confirmar': {
        if (data.etapa !== 'intercambiar') return;
        const d = diferencia(); if (d < 0 && data.fondo < -d) return;
        data.fondo = Number(data.fondo) + d;
        if (d > 0) {
          data.bono = d * BP_POR_GRAMO;
          state.balance += data.bono;
          state.transactions.unshift({ type: 'donation', name: 'Plástico compartido', amount: data.bono, date: new Date().toLocaleDateString('es-AR') });
          persist();
        }
        data.etapa = 'transformar'; break;
      }
      case 'finalizar': if (data.etapa !== 'transformar') return; data.etapa = 'resultado'; break;
      case 'reiniciar': data = { ...nuevo(), fondo: data.fondo }; break;
      default: return;
    }
    guardar(); render(); content.scrollTop = (b.dataset.icColor || b.dataset.icPersonaje) ? scrollTop : 0;
  }, true);
  render();
})();
