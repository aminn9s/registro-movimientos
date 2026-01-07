let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
let editId = null;

const lista = document.getElementById("lista");
const totalMovs = document.getElementById("totalMovs");
const totalMonto = document.getElementById("totalMonto");

const montoEl = document.getElementById("monto");
const remitenteEl = document.getElementById("remitente");
const destinatarioEl = document.getElementById("destinatario");
const referenciaEl = document.getElementById("referencia");
const fechaEl = document.getElementById("fecha");
const guardarBtn = document.getElementById("guardar");

// Fecha de hoy por defecto
fechaEl.value = new Date().toISOString().slice(0, 10);

guardarBtn.onclick = () => {
  const monto = Number(montoEl.value);
  if (!monto) return;

  const fechaObj = fechaEl.value
    ? new Date(fechaEl.value + "T00:00:00")
    : new Date();

  const movimiento = {
    id: editId ?? Date.now(),
    monto,
    remitente: remitenteEl.value.trim(),
    destinatario: destinatarioEl.value.trim(),
    referencia: referenciaEl.value.trim(),
    fecha: fechaObj.toLocaleDateString("es-ES")
  };

  if (editId) {
    // EDITAR
    movimientos = movimientos.map(m =>
      m.id === editId ? movimiento : m
    );
  } else {
    // NUEVO
    movimientos.unshift(movimiento);
  }

  localStorage.setItem("movimientos", JSON.stringify(movimientos));
  resetForm();
  render();
};

function resetForm() {
  montoEl.value = "";
  remitenteEl.value = "";
  destinatarioEl.value = "";
  referenciaEl.value = "";
  fechaEl.value = new Date().toISOString().slice(0, 10);
  editId = null;
  guardarBtn.textContent = "Registrar";
}

function render() {
  lista.innerHTML = "";
  let suma = 0;

  movimientos.forEach(m => {
    suma += m.monto;

    lista.innerHTML += `
      <div class="row" onclick="editar(${m.id})">
        <div class="left">
          <div class="remitente">${m.remitente}</div>
          <div class="fecha">${m.fecha}</div>
        </div>

        <div class="right">
          <div class="top">
            <div class="monto">${m.monto.toLocaleString()}</div>
            <div class="delete" onclick="event.stopPropagation(); del(${m.id})">×</div>
          </div>
          <div class="destinatario">${m.destinatario}</div>
        </div>
      </div>
    `;
  });

  totalMovs.textContent = movimientos.length;
  totalMonto.textContent = suma.toLocaleString();
}

function editar(id) {
  const m = movimientos.find(x => x.id === id);
  if (!m) return;

  montoEl.value = m.monto;
  remitenteEl.value = m.remitente;
  destinatarioEl.value = m.destinatario;
  referenciaEl.value = m.referencia || "";

  // Convertir DD/MM/YYYY → YYYY-MM-DD
  const [d, mo, y] = m.fecha.split("/");
  fechaEl.value = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;

  editId = id;
  guardarBtn.textContent = "Guardar cambios";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function del(id) {
  if (!confirm("Eliminar movimiento?")) return;
  movimientos = movimientos.filter(m => m.id !== id);
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
  render();
}

render();
