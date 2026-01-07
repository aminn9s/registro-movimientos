let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

const lista = document.getElementById("lista");
const totalMovs = document.getElementById("totalMovs");
const totalMonto = document.getElementById("totalMonto");

document.getElementById("guardar").onclick = () => {
  const monto = Number(document.getElementById("monto").value);
  const remitente = document.getElementById("remitente").value.trim();
  const destinatario = document.getElementById("destinatario").value.trim();
  const referencia = document.getElementById("referencia").value.trim();

  if (!monto) return;

  const d = new Date();

  movimientos.unshift({
    id: Date.now(),
    monto,
    remitente,
    destinatario,
    referencia,
    fecha: d.toLocaleDateString()
  });

  localStorage.setItem("movimientos", JSON.stringify(movimientos));

  document.querySelectorAll(".form input").forEach(i => i.value = "");
  render();
};

function render() {
  lista.innerHTML = "";
  let suma = 0;

  movimientos.forEach(m => {
    suma += m.monto;

    lista.innerHTML += `
      <div class="row">
        <div class="amount">${m.monto.toLocaleString()}</div>
        <div class="fromto">${m.remitente} → ${m.destinatario}</div>
        <div class="date">${m.fecha}</div>
        <div class="delete" onclick="del(${m.id})">×</div>
      </div>
    `;
  });

  totalMovs.textContent = movimientos.length;
  totalMonto.textContent = suma.toLocaleString();
}

function del(id) {
  if (!confirm("Eliminar movimiento?")) return;
  movimientos = movimientos.filter(m => m.id !== id);
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
  render();
}

render();
