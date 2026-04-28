// src/lib/api.ts
// Módulo 07 — Utilidades de fetch tipadas para build time

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  website: string;
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function getPosts(limit = 10): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts?_limit=${limit}`);
  if (!res.ok) throw new Error(`Error al obtener posts: ${res.status}`);
  return res.json() as Promise<Post[]>;
}

export async function getPostById(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) throw new Error(`Post ${id} no encontrado: ${res.status}`);
  return res.json() as Promise<Post>;
}

export async function getUserById(id: number): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error(`Usuario ${id} no encontrado: ${res.status}`);
  return res.json() as Promise<User>;
}

/** Capitaliza la primera letra del string */
export function capitalizarTitulo(titulo: string): string {
  return titulo.charAt(0).toUpperCase() + titulo.slice(1);
}
