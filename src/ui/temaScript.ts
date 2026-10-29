// Sin dependencias de React: lo importa el layout raíz (Server Component).

export const CLAVE_TEMA = "tema";
export const COLOR_BARRA = { claro: "#f1e9d8", oscuro: "#141311" } as const;

/** Script en línea para el <head>: aplica el tema guardado antes del primer pintado. */
export const SCRIPT_TEMA = `(function(){try{var t=JSON.parse(localStorage.getItem("${CLAVE_TEMA}")||'"oscuro"');if(t==="sistema")t=matchMedia("(prefers-color-scheme: dark)").matches?"oscuro":"claro";if(t==="oscuro")document.documentElement.setAttribute("data-theme","dark")}catch(e){}})()`;
