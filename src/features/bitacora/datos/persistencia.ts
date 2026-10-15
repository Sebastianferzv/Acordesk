/**
 * Pide al navegador que no borre los datos locales cuando le falte espacio.
 * Chrome lo concede según el uso (más fácil con la app instalada); Firefox lo pregunta.
 * Por eso se llama tras una acción del usuario (primer guardado, instalación), no al abrir.
 */
export async function pedirPersistencia(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
