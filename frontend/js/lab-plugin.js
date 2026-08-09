/* ============================================================
   GARMR · lab-plugin.js — Laboratorio "El plugin abandonado"
   El usuario gestiona los complementos de un sitio:
   - actualiza los que tienen versión nueva,
   - descubre que uno abandonado NO se puede actualizar,
   - simula el ataque y ve cómo el bot entra por ese complemento,
   - lo elimina y cierra la puerta.
   ============================================================ */

(function () {
  "use strict";

  var lab = document.getElementById("labPlugin");
  if (!lab) return;

  var tabla = lab.querySelector("#pluginsTabla");
  var btnAtaque = lab.querySelector("#btnAtaque");
  var aviso = lab.querySelector("#pluginAviso");
  var panel = lab.querySelector("#ataquePanel");
  var panelTitulo = lab.querySelector("#ataqueTitulo");
  var panelTexto = lab.querySelector("#ataqueTexto");
  var panelVeredicto = lab.querySelector("#ataqueVeredicto");

  /* Actualizar un complemento con versión nueva */
  tabla.addEventListener("click", function (e) {
    var btn = e.target.closest(".btn-actualizar");
    if (btn) {
      var fila = btn.closest(".plugin-fila");
      var estado = fila.querySelector(".plugin-estado");
      var accion = fila.querySelector(".plugin-accion");
      fila.setAttribute("data-estado", "al-dia");
      estado.className = "plugin-estado al-dia";
      estado.textContent = "Actualizado";
      accion.innerHTML = '<span class="plugin-hecho">✓ Al día</span>';
      revisarPendientes();
      return;
    }
    var btnEliminar = e.target.closest(".btn-eliminar");
    if (btnEliminar) {
      var fila2 = btnEliminar.closest(".plugin-fila");
      fila2.setAttribute("data-estado", "eliminado");
      fila2.classList.remove("atacada");
      fila2.classList.add("resuelta");
      var estado2 = fila2.querySelector(".plugin-estado");
      var accion2 = fila2.querySelector(".plugin-accion");
      estado2.className = "plugin-estado al-dia";
      estado2.textContent = "Eliminado";
      accion2.innerHTML = '<span class="plugin-hecho">✓ Puerta cerrada</span>';
      cerrarPuerta();
    }
  });

  function revisarPendientes() {
    var pendientes = tabla.querySelectorAll('.plugin-fila[data-estado="pendiente"]').length;
    if (pendientes === 0) {
      aviso.innerHTML = "Actualizaste todo lo que se podía. Pero hay un complemento que <strong>no tiene actualización</strong>… ¿está todo seguro? Compruébalo.";
    }
  }

  /* Simular el ataque: escaneo secuencial que aterriza en el vulnerable */
  btnAtaque.addEventListener("click", function () {
    btnAtaque.disabled = true;
    var filas = Array.prototype.slice.call(tabla.querySelectorAll(".plugin-fila"));
    var i = 0;
    aviso.innerHTML = "🔍 Un bot está recorriendo tus complementos, probando cuál tiene una falla conocida…";

    function escanear() {
      if (i > 0) filas[i - 1].classList.remove("escaneando");
      if (i < filas.length) {
        filas[i].classList.add("escaneando");
        i++;
        setTimeout(escanear, 420);
      } else {
        finApuntar();
      }
    }

    function finApuntar() {
      var vuln = tabla.querySelector('.plugin-fila[data-estado="vulnerable"]');
      if (vuln) {
        vuln.classList.add("atacada");
        mostrarAtaque(true);
      } else {
        mostrarAtaque(false);
      }
    }
    escanear();
  });

  function mostrarAtaque(entro) {
    panel.classList.add("visible");
    if (entro) {
      panelVeredicto.className = "veredicto veredicto--cayo";
      panelTitulo.textContent = "El bot entró por Slider Deluxe.";
      panelTexto.innerHTML = "Actualizar los demás estuvo bien, pero no bastó. <strong>Slider Deluxe está abandonado</strong>: su creador dejó de publicar arreglos en 2022, así que su falla conocida nunca se cerrará. Por ahí entró el atacante, sin importar lo demás.";
      aviso.innerHTML = "Un complemento abandonado no se arregla actualizando — <strong>no hay actualización que venga</strong>. La única salida es quitarlo.";
    } else {
      panelVeredicto.className = "veredicto veredicto--bien";
      panelTitulo.textContent = "El bot no encontró puerta.";
      panelTexto.innerHTML = "Bien jugado. Al eliminar el complemento abandonado le quitaste al atacante su vía de entrada. Eso es lo que un complemento sin soporte exige: no actualizarlo (imposible), sino <strong>retirarlo</strong>.";
    }
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function cerrarPuerta() {
    btnAtaque.disabled = false;
    aviso.innerHTML = "Puerta cerrada. Ahora vuelve a <strong>simular el ataque</strong> y comprueba que el bot ya no encuentra por dónde entrar.";
    panel.classList.remove("visible");
  }
})();
