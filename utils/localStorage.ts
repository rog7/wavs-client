import { LocalStorage } from "node-localstorage";

let localStorage: Storage;

if (typeof window !== "undefined") {
  localStorage = window.localStorage;
} else {
  localStorage = new LocalStorage("./local-storage");
}

export function getItem(key: string) {
  return localStorage.getItem(key);
}

export function setItem(key: string, value: any) {
  localStorage.setItem(key, value);
}

export function removeItem(key: string) {
  localStorage.removeItem(key);
}

export function clearStorage() {
  localStorage.clear();
}
