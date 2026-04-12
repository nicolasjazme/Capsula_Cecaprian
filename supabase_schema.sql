-- Ejecutar en Supabase → SQL Editor (una vez).
-- Tabla public.usuarios: debe tener PK en columna "usuarios" (texto), más nombre, password, fecha_creacion.
-- El cliente inserta: usuarios, nombre (mismo login), password, fecha_creacion.
-- Si falta fecha_creacion, añádela:

alter table public.usuarios add column if not exists fecha_creacion timestamptz default now();

-- Nuevas tablas de la app (cápsulas, carpetas, evaluaciones, etc.)

create table if not exists public.carpetas (
  id text primary key,
  nombre text not null,
  descripcion text default '',
  created_at timestamptz default now()
);

create table if not exists public.capsulas (
  id text primary key,
  carpeta_id text references public.carpetas (id) on delete set null,
  unidad text,
  titulo text,
  descripcion text,
  video_url text,
  fecha timestamptz default now()
);

create table if not exists public.evaluaciones (
  id text primary key,
  titulo text not null,
  descripcion text default '',
  preguntas jsonb not null default '[]'::jsonb,
  fecha timestamptz default now()
);

create table if not exists public.respuestas_evaluaciones (
  id text primary key,
  usuario_id text not null,
  evaluacion_id text not null references public.evaluaciones (id) on delete cascade,
  aciertos int,
  total int,
  porcentaje int,
  fecha timestamptz default now(),
  evaluacion_titulo text,
  detalle jsonb
);

create table if not exists public.documentos (
  id text primary key,
  nombre text not null,
  contenido text,
  tamanio text,
  tipo text,
  fecha timestamptz default now()
);

-- RLS: lectura/escritura con la anon key (mismo modelo que datos en localStorage del navegador).
-- Para producción endurecer con Auth y políticas por usuario.

alter table public.carpetas enable row level security;
alter table public.capsulas enable row level security;
alter table public.evaluaciones enable row level security;
alter table public.respuestas_evaluaciones enable row level security;
alter table public.documentos enable row level security;

drop policy if exists "carpetas_public_all" on public.carpetas;
create policy "carpetas_public_all" on public.carpetas for all using (true) with check (true);

drop policy if exists "capsulas_public_all" on public.capsulas;
create policy "capsulas_public_all" on public.capsulas for all using (true) with check (true);

drop policy if exists "evaluaciones_public_all" on public.evaluaciones;
create policy "evaluaciones_public_all" on public.evaluaciones for all using (true) with check (true);

drop policy if exists "respuestas_public_all" on public.respuestas_evaluaciones;
create policy "respuestas_public_all" on public.respuestas_evaluaciones for all using (true) with check (true);

drop policy if exists "documentos_public_all" on public.documentos;
create policy "documentos_public_all" on public.documentos for all using (true) with check (true);

-- Políticas para usuarios (login y CRUD desde el cliente con anon key)
alter table public.usuarios enable row level security;

drop policy if exists "usuarios_public_all" on public.usuarios;
create policy "usuarios_public_all" on public.usuarios for all using (true) with check (true);
