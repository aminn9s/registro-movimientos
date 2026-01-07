let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

const lista = document.getElementById("lista");
const totalMovs = document.getElementById("totalMovs");
const totalMonto = document.getElementById("totalMonto");

const montoEl = document.getElementById("monto");
const remitenteEl = document.getElementById("remitente");
const destinatarioEl = document.getElementById("destinatario");
const referenciaEl = document.getElementById("referencia");
const fechaEl = document.getElementById("fecha");

// Fecha de hoy por defecto
fechaEl.value = new Date().toISOString().slice(0, 10);

/* REGISTRAR NUEVO */
document.getElementById("guardar").onclick = () => {
  const monto = Number(montoEl.value);
  if (!monto) return;

  const fechaObj = fechaEl.value
    ? new Date(fechaEl.value + "T00:00:00")
    : new Date();

  movimientos.unshift({
    id: Date.now(),
    monto,
    remitente: remitenteEl.value.trim(),
    destinatario: destinatarioEl.value.trim(),
    referencia: referenciaEl.value.trim(),
    fecha: fechaObj.toLocaleDateString("es-ES")
  });

  localStorage.setItem("movimientos", JSON.stringify(movimientos));
  limpiarFormulario();
  render();
};

function limpiarFormulario() {
  montoEl.value = "";
  remitenteEl.value = "";
  destinatarioEl.value = "";
  referenciaEl.value = "";
  fechaEl.value = new Date().toISOString().slice(0, 10);
}

/* RENDER + EDICIÓN INLINE */
function render() {
  lista.innerHTML = "";
  let suma = 0;

  movimientos.forEach(m => {
    suma += m.monto;

    lista.innerHTML += `
      <div class="row">
        <div class="left">
          <div class="remitente" contenteditable="true"
            onblur="updateField(${m.id}, 'remitente', this.innerText)">
            ${m.remitente}
          </div>

          <div class="fecha" onclick="editFecha(this, ${m.id})">
            ${m.fecha}
          </div>
        </div>

        <div class="right">
          <div class="top">
            <div class="monto" contenteditable="true"
              onblur="updateMonto(${m.id}, this.innerText)">
              ${m.monto.toLocaleString()}
            </div>
            <div class="delete" onclick="del(${m.id})">×</div>
          </div>

          <div class="destinatario" contenteditable="true"
            onblur="updateField(${m.id}, 'destinatario', this.innerText)">
            ${m.destinatario}
          </div>
        </div>
      </div>
    `;
  });

  totalMovs.textContent = movimientos.length;
  totalMonto.textContent = suma.toLocaleString();
}

/* ACTUALIZACIONES */
function updateField(id, field, value) {
  movimientos = movimientos.map(m =>
    m.id === id ? { ...m, [field]: value.trim() } : m
  );
  guardarYRender();
}

function updateMonto(id, value) {
  const monto = Number(value.replace(/\D/g, "")) || 0;
  movimientos = movimientos.map(m =>
    m.id === id ? { ...m, monto } : m
  );
  guardarYRender();
}

function editFecha(el, id) {
  const input = document.createElement("input");
  input.type = "date";

  const [d, m, y] = el.innerText.split("/");
  input.value = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;

  input.onblur = () => {
    if (input.value) {
      const fechaObj = new Date(input.value + "T00:00:00");
      movimientos = movimientos.map(m =>
        m.id === id
          ? { ...m, fecha: fechaObj.toLocaleDateString("es-ES") }
          : m
      );
      guardarYRender();
    }
  };

  el.replaceWith(input);
  input.focus();
}

function guardarYRender() {
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
  render();
}

/* ELIMINAR */
function del(id) {
  if (!confirm("Eliminar movimiento?")) return;
  movimientos = movimientos.filter(m => m.id !== id);
  guardarYRender();
}

render();
