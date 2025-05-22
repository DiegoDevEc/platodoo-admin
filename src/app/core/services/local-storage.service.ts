import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
    /**
     * Guarda un valor en localStorage
     */
    setItem<T>(key: string, value: T): void {
        try {
            const json = JSON.stringify(value);
            localStorage.setItem(key, json);
        } catch (e) {
            console.error('Error al guardar en localStorage', e);
        }
    }

    /**
     * Obtiene un valor del localStorage
     */
    getItem<T>(key: string): T | null {
        try {
            const json = localStorage.getItem(key);
            return json ? JSON.parse(json) as T : null;
        } catch (e) {
            console.error('Error al leer de localStorage', e);
            return null;
        }
    }

    /**
     * Elimina un valor del localStorage
     */
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Limpia todo el localStorage
     */
    clear(): void {
        localStorage.clear();
    }
}
